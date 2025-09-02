import { TicketRepository } from '../repositories/TicketRepository.js';
import { CartRepository } from '../repositories/CartRepository.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { v4 as uuidv4 } from 'uuid';

export class TicketService {
  constructor() {
    this.ticketRepo = new TicketRepository();
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
  }

  /**
   * Genera un ticket de compra si el stock permite
   * @param {string} cartId - ID del carrito a procesar
   * @param {string} purchaserId - ID del usuario comprador
   * @returns {Object} - ticket generado y productos no comprados
   */
  async purchaseCart(cartId, purchaserId) {
    const cart = await this.cartRepo.getById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const productsPurchased = [];
    const productsRemaining = [];

    // Revisar stock y separar productos que se pueden comprar
    for (const item of cart.products) {
      const product = await this.productRepo.getById(item.product._id);
      if (!product) continue;

      if (product.stock >= item.quantity) {
        productsPurchased.push({ product: product._id, quantity: item.quantity, price: product.price });
        product.stock -= item.quantity;
        await this.productRepo.update(product._id, { stock: product.stock });
      } else {
        // No hay stock suficiente, queda en el carrito
        productsRemaining.push({ product: product._id, quantity: item.quantity });
      }
    }

    // Vaciar carrito y agregar los productos que no se pudieron comprar
    await this.cartRepo.updateProducts(cartId, productsRemaining);

    if (productsPurchased.length === 0) {
      throw new Error('No hay productos disponibles para comprar');
    }

    // Calcular monto total
    const amount = productsPurchased.reduce((total, p) => total + p.quantity * p.price, 0);

    // Generar ticket
    const ticketData = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount,
      purchaser: purchaserId,
      products: productsPurchased,
    };

    const ticket = await this.ticketRepo.create(ticketData);

    return { ticket, remainingProducts: productsRemaining };
  }
}
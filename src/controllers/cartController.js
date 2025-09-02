import { CartService } from '../services/CartService.js';
import { CartDTO } from '../dtos/CartDTO.js';

const cartService = new CartService();

export class CartController {
  // Obtener productos de un carrito por ID
  static async getCartById(req, res, next) {
    const cart = await cartService.getCartById(req.params.cid);
    if (!cart) throw { status: 404, message: 'Carrito no encontrado' };
    res.json({ status: 'success', payload: new CartDTO(cart) });
  }

  // Crear un nuevo carrito
  static async createCart(req, res, next) {
    const newCart = await cartService.createCart();
    res.status(201).json({ status: 'success', payload: new CartDTO(newCart) });
  }

  // Agregar producto a carrito
  static async addProduct(req, res, next) {
    const updatedCart = await cartService.addProductToCart(req.params.cid, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: new CartDTO(updatedCart) });
  }

  // Eliminar producto del carrito
  static async removeProduct(req, res, next) {
    const updatedCart = await cartService.removeProductFromCart(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: new CartDTO(updatedCart) });
  }

  // Actualizar cantidad de un producto en el carrito
  static async updateProductQuantity(req, res, next) {
    const updatedCart = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: new CartDTO(updatedCart) });
  }

  // Actualizar todos los productos del carrito
  static async updateCart(req, res, next) {
    const updatedCart = await cartService.updateCartProducts(req.params.cid, req.body.products);
    res.json({ status: 'success', payload: new CartDTO(updatedCart) });
  }

  // Vaciar carrito
  static async clearCart(req, res, next) {
    const emptiedCart = await cartService.clearCart(req.params.cid);
    res.json({ status: 'success', payload: new CartDTO(emptiedCart) });
  }
}
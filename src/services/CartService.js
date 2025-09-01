import { CartRepository } from '../repositories/CartRepository.js';

export class CartService {
  constructor() {
    this.cartRepo = new CartRepository();
  }

  // Listar todos los carritos
  async getAll() {
    return await this.cartRepo.getAll();
  }

  // Obtener carrito por ID
  async getById(id) {
    return await this.cartRepo.getById(id);
  }

  // Crear nuevo carrito
  async create(cartData = {}) {
    return await this.cartRepo.create(cartData);
  }

  // Agregar producto a un carrito
  async addProduct(cartId, productId, quantity = 1) {
    return await this.cartRepo.addProduct(cartId, productId, quantity);
  }

  // Eliminar producto de un carrito
  async removeProduct(cartId, productId) {
    return await this.cartRepo.removeProduct(cartId, productId);
  }

  // Actualizar cantidad de un producto en un carrito
  async updateProductQuantity(cartId, productId, quantity) {
    return await this.cartRepo.updateProductQuantity(cartId, productId, quantity);
  }

  // Reemplazar todos los productos de un carrito
  async updateProducts(cartId, products = []) {
    return await this.cartRepo.updateProducts(cartId, products);
  }

  // Vaciar un carrito
  async clear(cartId) {
    return await this.cartRepo.clearCart(cartId);
  }
}
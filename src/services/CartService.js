import { CartRepository } from '../repositories/CartRepository.js';

export class CartService {
  constructor() {
    this.cartRepo = new CartRepository();
  }

  async getAllCarts() {
    return await this.cartRepo.getAll();
  }

  async getCartById(id) {
    return await this.cartRepo.getById(id);
  }

  async createCart(cartData = {}) {
    return await this.cartRepo.create(cartData);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    return await this.cartRepo.addProduct(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
    return await this.cartRepo.removeProduct(cartId, productId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await this.cartRepo.updateProductQuantity(cartId, productId, quantity);
  }

  async updateCartProducts(cartId, products = []) {
    return await this.cartRepo.updateProducts(cartId, products);
  }

  async clearCart(cartId) {
    return await this.cartRepo.clearCart(cartId);
  }
}
import { Cart } from '../dao/models/Cart.js';

export class CartRepository {
  async getAll() {
    return await Cart.find();
  }

  async getById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async create(cartData) {
    return await Cart.create(cartData);
  }

  async update(id, updateData) {
    return await Cart.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Cart.findByIdAndDelete(id);
  }

  async addProduct(cartId, product) {
    const cart = await Cart.findById(cartId);
    cart.products.push(product);
    return await cart.save();
  }

  async removeProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    return await cart.save();
  }
}
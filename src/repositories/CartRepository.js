import CartModel from '../dao/models/cartModel.js';
import ProductModel from '../dao/models/productModel.js';

export class CartRepository {
  async getAll() {
    return await CartModel.find().populate('products.product');
  }

  async getById(id) {
    return await CartModel.findById(id).populate('products.product');
  }

  async create(cartData = {}) {
    return await CartModel.create(cartData);
  }

  async update(id, updateData) {
    return await CartModel.findByIdAndUpdate(id, updateData, { new: true }).populate('products.product');
  }

  async delete(id) {
    return await CartModel.findByIdAndDelete(id);
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    // Revisar si el producto ya existe en el carrito
    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return await cart.populate('products.product');
  }

  async removeProduct(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    await cart.save();
    return await cart.populate('products.product');
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = [];
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const product = cart.products.find(p => p.product.toString() === productId);
    if (!product) throw new Error('Producto no encontrado en el carrito');

    product.quantity = quantity;
    await cart.save();
    return await cart.populate('products.product');
  }

  async updateProducts(cartId, products = []) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = products.map(p => ({ product: p.product, quantity: p.quantity || 1 }));
    await cart.save();
    return await cart.populate('products.product');
  }
}
import { CartService } from '../services/CartService.js';
import { CartDTO } from '../dtos/CartDTO.js';

const cartService = new CartService();

export class CartController {
  // Obtener productos de un carrito por ID
  static async getCartById(req, res) {
    try {
      const cart = await cartService.getCartById(req.params.cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      res.json({ status: 'success', payload: new CartDTO(cart) });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Crear un nuevo carrito
  static async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({ status: 'success', payload: new CartDTO(newCart) });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Agregar producto a carrito
  static async addProduct(req, res) {
    try {
      const updatedCart = await cartService.addProductToCart(req.params.cid, req.params.pid, req.body.quantity);
      res.json({ status: 'success', payload: new CartDTO(updatedCart) });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Eliminar producto del carrito
  static async removeProduct(req, res) {
    try {
      const updatedCart = await cartService.removeProductFromCart(req.params.cid, req.params.pid);
      res.json({ status: 'success', payload: new CartDTO(updatedCart) });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Actualizar cantidad de un producto en el carrito
  static async updateProductQuantity(req, res) {
    try {
      const updatedCart = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
      res.json({ status: 'success', payload: new CartDTO(updatedCart) });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Actualizar todos los productos del carrito
  static async updateCart(req, res) {
    try {
      const updatedCart = await cartService.updateCartProducts(req.params.cid, req.body.products);
      res.json({ status: 'success', payload: new CartDTO(updatedCart) });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Vaciar carrito
  static async clearCart(req, res) {
    try {
      const emptiedCart = await cartService.clearCart(req.params.cid);
      res.json({ status: 'success', payload: new CartDTO(emptiedCart) });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
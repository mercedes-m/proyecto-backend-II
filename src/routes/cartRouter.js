import { Router } from 'express';
import { CartService } from '../services/CartService.js';
import { authorize } from '../middlewares/authorization.js';

const router = Router();
const cartService = new CartService();

/**
 * Obtener productos de un carrito por ID
 */
router.get('/:cid', authorize('user'), async (req, res) => {
  try {
    const cartProducts = await cartService.getProductsByCartId(req.params.cid);
    res.json({ status: 'success', payload: cartProducts });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Crear un nuevo carrito
 */
router.post('/', authorize('user'), async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Agregar producto a carrito
 */
router.post('/:cid/product/:pid', authorize('user'), async (req, res) => {
  try {
    const updatedCart = await cartService.addProduct(req.params.cid, req.params.pid, req.body.quantity || 1);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Eliminar producto del carrito
 */
router.delete('/:cid/product/:pid', authorize('user'), async (req, res) => {
  try {
    const updatedCart = await cartService.removeProduct(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Actualizar todos los productos del carrito
 */
router.put('/:cid', authorize('user'), async (req, res) => {
  try {
    const updatedCart = await cartService.updateProducts(req.params.cid, req.body.products);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Actualizar cantidad de un producto en el carrito
 */
router.put('/:cid/product/:pid', authorize('user'), async (req, res) => {
  try {
    const updatedCart = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Eliminar todos los productos del carrito
 */
router.delete('/:cid', authorize('user'), async (req, res) => {
  try {
    const emptiedCart = await cartService.clearCart(req.params.cid);
    res.json({ status: 'success', payload: emptiedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
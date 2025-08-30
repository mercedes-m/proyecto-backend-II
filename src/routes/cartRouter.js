import { Router } from 'express';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { CartRepository } from '../repositories/CartRepository.js';

const router = Router();
const productRepo = new ProductRepository();
const cartRepo = new CartRepository(productRepo);

// Obtener productos de un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cartProducts = await cartRepo.getProductsByCartId(req.params.cid);
    res.json({ status: 'success', payload: cartProducts });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartRepo.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Agregar producto a carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const updatedCart = await cartRepo.addProduct(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const updatedCart = await cartRepo.removeProduct(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
  try {
    const updatedCart = await cartRepo.updateProducts(req.params.cid, req.body.products);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const updatedCart = await cartRepo.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const emptiedCart = await cartRepo.clearCart(req.params.cid);
    res.json({ status: 'success', payload: emptiedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
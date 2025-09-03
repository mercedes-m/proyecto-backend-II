import { Router } from 'express';
import { CartController } from '../controllers/cartController.js';
import { authorize } from '../middlewares/authorization.js';

const router = Router();

// Obtener productos de un carrito por ID
router.get('/:cid', authorize('user'), CartController.getCartById);

// Crear un nuevo carrito
router.post('/', authorize('user'), CartController.createCart);

// Agregar producto a carrito
router.post('/:cid/product/:pid', authorize('user'), CartController.addProduct);

// Eliminar producto del carrito
router.delete('/:cid/product/:pid', authorize('user'), CartController.removeProduct);

// Actualizar todos los productos del carrito
router.put('/:cid', authorize('user'), CartController.updateCart);

// Actualizar cantidad de un producto en el carrito
router.put('/:cid/product/:pid', authorize('user'), CartController.updateProductQuantity);

// Vaciar carrito
router.delete('/:cid', authorize('user'), CartController.clearCart);

export default router;
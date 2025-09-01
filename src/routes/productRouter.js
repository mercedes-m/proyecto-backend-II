import { Router } from 'express';
import { ProductService } from '../services/ProductService.js';
import { uploader } from '../utils/multerUtil.js';
import { authorize } from '../middlewares/authorization.js';

const router = Router();
const productService = new ProductService();

/**
 * Listar todos los productos (abierto a todos)
 */
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.json({ status: 'success', payload: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * Obtener producto por ID (abierto a todos)
 */
router.get('/:pid', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Crear producto (solo admins)
 */
router.post('/', authorize('admin'), uploader.array('thumbnails', 3), async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.files) {
      productData.thumbnails = req.files.map(file => file.path);
    }

    const newProduct = await productService.createProduct(productData);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Actualizar producto (solo admins)
 */
router.put('/:pid', authorize('admin'), uploader.array('thumbnails', 3), async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.files) {
      productData.thumbnails = req.files.map(file => file.filename);
    }

    const updatedProduct = await productService.updateProduct(req.params.pid, productData);
    if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * Eliminar producto (solo admins)
 */
router.delete('/:pid', authorize('admin'), async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: deletedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
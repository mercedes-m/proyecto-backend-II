import { Router } from 'express';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { uploader } from '../utils/multerUtil.js';

const router = Router();
const productRepo = new ProductRepository();

// Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productRepo.getAll(req.query);
    res.json({ status: 'success', payload: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Obtener producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productRepo.getById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Crear producto
router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
  try {
    if (req.files) {
      req.body.thumbnails = req.files.map(file => file.path);
    }

    const newProduct = await productRepo.create(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Actualizar producto
router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {
  try {
    if (req.files) {
      req.body.thumbnails = req.files.map(file => file.filename);
    }

    const updatedProduct = await productRepo.update(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await productRepo.delete(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: deletedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
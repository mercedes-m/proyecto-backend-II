import { ProductService } from '../services/ProductService.js';
import { uploader } from '../utils/multerUtil.js';

const productService = new ProductService();

export class ProductController {
  // Listar productos (abierto a todos)
  static async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts(req.query);
      res.json({ status: 'success', payload: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Obtener producto por ID
  static async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.pid);
      if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.json({ status: 'success', payload: product });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Crear producto (solo admins)
  static async createProduct(req, res) {
    try {
      if (req.files) {
        req.body.thumbnails = req.files.map(file => file.path);
      }
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Actualizar producto (solo admins)
  static async updateProduct(req, res) {
    try {
      if (req.files) {
        req.body.thumbnails = req.files.map(file => file.filename);
      }
      const updatedProduct = await productService.updateProduct(req.params.pid, req.body);
      if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // Eliminar producto (solo admins)
  static async deleteProduct(req, res) {
    try {
      const deletedProduct = await productService.deleteProduct(req.params.pid);
      if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.json({ status: 'success', payload: deletedProduct });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

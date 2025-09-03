import { ProductService } from '../services/ProductService.js';
import { ProductDTO } from '../dtos/ProductDTO.js';
import { uploader } from '../utils/multerUtil.js';

const productService = new ProductService();

export class ProductController {
  // Listar productos (abierto a todos)
  static async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAll(req.query);
      const productsDTO = products.map(p => new ProductDTO(p));
      res.json({ status: 'success', payload: productsDTO });
    } catch (error) {
      next(error);
    }
  }

  // Obtener producto por ID
  static async getProductById(req, res, next) {
    try {
      const product = await productService.getById(req.params.pid);
      if (!product) throw { status: 404, message: 'Producto no encontrado' };
      res.json({ status: 'success', payload: new ProductDTO(product) });
    } catch (error) {
      next(error);
    }
  }

  // Crear producto (solo admins)
  static async createProduct(req, res, next) {
    try {
      if (req.files && req.files.length > 0) {
        req.body.thumbnails = req.files.map(file => file.path);
      }
      const newProduct = await productService.create(req.body);
      res.status(201).json({ status: 'success', payload: new ProductDTO(newProduct) });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar producto (solo admins)
  static async updateProduct(req, res, next) {
    try {
      if (req.files && req.files.length > 0) {
        req.body.thumbnails = req.files.map(file => file.path);
      }
      const updatedProduct = await productService.update(req.params.pid, req.body);
      if (!updatedProduct) throw { status: 404, message: 'Producto no encontrado' };
      res.json({ status: 'success', payload: new ProductDTO(updatedProduct) });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar producto (solo admins)
  static async deleteProduct(req, res, next) {
    try {
      const deletedProduct = await productService.delete(req.params.pid);
      if (!deletedProduct) throw { status: 404, message: 'Producto no encontrado' };
      res.json({ status: 'success', payload: new ProductDTO(deletedProduct) });
    } catch (error) {
      next(error);
    }
  }
}
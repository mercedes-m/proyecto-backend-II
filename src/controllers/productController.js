import { ProductService } from '../services/ProductService.js';
import { ProductDTO } from '../dtos/ProductDTO.js';
import { uploader } from '../utils/multerUtil.js';

const productService = new ProductService();

export class ProductController {
  // Listar productos (abierto a todos)
  static async getAllProducts(req, res, next) {
    const products = await productService.getAllProducts(req.query);
    const productsDTO = products.map(p => new ProductDTO(p));
    res.json({ status: 'success', payload: productsDTO });
  }

  // Obtener producto por ID
  static async getProductById(req, res, next) {
    const product = await productService.getProductById(req.params.pid);
    if (!product) throw { status: 404, message: 'Producto no encontrado' };
    res.json({ status: 'success', payload: new ProductDTO(product) });
  }

  // Crear producto (solo admins)
  static async createProduct(req, res, next) {
    if (req.files) {
      req.body.thumbnails = req.files.map(file => file.path);
    }
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({ status: 'success', payload: new ProductDTO(newProduct) });
  }

  // Actualizar producto (solo admins)
  static async updateProduct(req, res, next) {
    if (req.files) {
      req.body.thumbnails = req.files.map(file => file.filename);
    }
    const updatedProduct = await productService.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) throw { status: 404, message: 'Producto no encontrado' };
    res.json({ status: 'success', payload: new ProductDTO(updatedProduct) });
  }

  // Eliminar producto (solo admins)
  static async deleteProduct(req, res, next) {
    const deletedProduct = await productService.deleteProduct(req.params.pid);
    if (!deletedProduct) throw { status: 404, message: 'Producto no encontrado' };
    res.json({ status: 'success', payload: new ProductDTO(deletedProduct) });
  }
}
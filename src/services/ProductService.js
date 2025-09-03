import { ProductRepository } from '../repositories/ProductRepository.js';

export class ProductService {
  constructor() {
    this.productRepo = new ProductRepository();
  }

  // Listar productos con filtros y paginación
  async getAllProducts(query = {}) {
    return await this.productRepo.getAll(query);
  }

  // Obtener producto por ID
  async getProductById(id) {
    return await this.productRepo.getById(id);
  }

  // Crear nuevo producto
  async createProduct(productData) {
    return await this.productRepo.create(productData);
  }

  // Actualizar producto existente
  async updateProduct(id, updateData) {
    return await this.productRepo.update(id, updateData);
  }

  // Eliminar producto por ID
  async deleteProduct(id) {
    return await this.productRepo.delete(id);
  }
}
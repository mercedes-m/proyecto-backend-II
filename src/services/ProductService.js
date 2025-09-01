import { ProductRepository } from '../repositories/ProductRepository.js';

export class ProductService {
  constructor() {
    this.productRepo = new ProductRepository();
  }

  // Listar productos con filtros y paginación
  async getAll(query = {}) {
    return await this.productRepo.getAll(query);
  }

  // Obtener producto por ID
  async getById(id) {
    return await this.productRepo.getById(id);
  }

  // Crear nuevo producto
  async create(productData) {
    return await this.productRepo.create(productData);
  }

  // Actualizar producto existente
  async update(id, updateData) {
    return await this.productRepo.update(id, updateData);
  }

  // Eliminar producto por ID
  async delete(id) {
    return await this.productRepo.delete(id);
  }
}
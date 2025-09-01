import { ProductRepository } from '../repositories/ProductRepository.js';

export class ProductService {
  constructor() {
    this.productRepo = new ProductRepository();
  }

  async getAllProducts(query) {
    return await this.productRepo.getAll(query);
  }

  async getProductById(id) {
    return await this.productRepo.getById(id);
  }

  async createProduct(productData) {
    return await this.productRepo.create(productData);
  }

  async updateProduct(id, updateData) {
    return await this.productRepo.update(id, updateData);
  }

  async deleteProduct(id) {
    return await this.productRepo.delete(id);
  }
}
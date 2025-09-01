import ProductModel from '../dao/models/productModel.js';

export class ProductRepository {
  // Listar productos, con soporte para filtros y paginación
  async getAll(query = {}) {
    const { page = 1, limit = 10, category, stock } = query;

    const filter = {};
    if (category) filter.category = category;
    if (stock) filter.stock = { $gte: Number(stock) };

    return await ProductModel.paginate(filter, {
      page: Number(page),
      limit: Number(limit),
      lean: true
    });
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }

  async update(id, updateData) {
    return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}
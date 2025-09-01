import User from '../dao/models/userModel.js';

export class UserRepository {
  // Listar todos los usuarios
  async getAll() {
    return await User.find().lean(); // lean() devuelve objetos JS planos
  }

  // Buscar usuario por ID
  async getById(id) {
    return await User.findById(id).lean();
  }

  // Buscar usuario por email
  async getByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  // Crear usuario
  async create(userData) {
    return await User.create(userData);
  }

  // Actualizar usuario
  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Eliminar usuario
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}
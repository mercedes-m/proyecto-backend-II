import { UserRepository } from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';
import { UserDTO } from '../dtos/UserDTO.js';

export class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  // Listar todos los usuarios
  async getAll() {
    const users = await this.userRepo.getAll();
    return users.map(u => new UserDTO(u));
  }

  // Obtener usuario por ID
  async getById(id) {
    const user = await this.userRepo.getById(id);
    if (!user) return null;
    return new UserDTO(user);
  }

  // Obtener usuario por email
  async getByEmail(email) {
    const user = await this.userRepo.getByEmail(email);
    if (!user) return null;
    return new UserDTO(user);
  }

  // Crear usuario
  async create(userData) {
    if (userData.password) {
      const saltRounds = 10;
      userData.password = bcrypt.hashSync(userData.password, saltRounds);
    }
    const user = await this.userRepo.create(userData);
    return new UserDTO(user);
  }

  // Actualizar usuario
  async update(id, updateData) {
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = bcrypt.hashSync(updateData.password, saltRounds);
    }
    const updatedUser = await this.userRepo.update(id, updateData);
    if (!updatedUser) return null;
    return new UserDTO(updatedUser);
  }

  // Eliminar usuario
  async delete(id) {
    const deletedUser = await this.userRepo.delete(id);
    if (!deletedUser) return null;
    return new UserDTO(deletedUser);
  }
}
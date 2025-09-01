import { UserRepository } from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';
import { UserDTO } from '../dtos/UserDTO.js';

export class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getAllUsers() {
    const users = await this.userRepo.getAll();
    return users.map(u => new UserDTO(u));
  }

  async getUserById(id) {
    const user = await this.userRepo.getById(id);
    if (!user) return null;
    return new UserDTO(user);
  }

  async getUserByEmail(email) {
    const user = await this.userRepo.getByEmail(email);
    if (!user) return null;
    return new UserDTO(user);
  }

  async createUser(userData) {
    if (userData.password) {
      const saltRounds = 10;
      userData.password = bcrypt.hashSync(userData.password, saltRounds);
    }
    const user = await this.userRepo.create(userData);
    return new UserDTO(user);
  }

  async updateUser(id, updateData) {
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = bcrypt.hashSync(updateData.password, saltRounds);
    }
    const updatedUser = await this.userRepo.update(id, updateData);
    if (!updatedUser) return null;
    return new UserDTO(updatedUser);
  }

  async deleteUser(id) {
    const deletedUser = await this.userRepo.delete(id);
    if (!deletedUser) return null;
    return new UserDTO(deletedUser);
  }
}
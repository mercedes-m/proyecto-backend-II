import { UserService } from '../services/UserService.js';
import { UserDTO } from '../dtos/UserDTO.js';

const userService = new UserService();

export class UserController {
  // Crear un nuevo usuario (solo admins)
  static async createUser(req, res, next) {
    try {
      const user = await userService.create(req.body);
      const userDTO = new UserDTO(user);
      res.status(201).json({ message: 'Usuario creado', user: userDTO });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw { status: 400, message: 'El email ya está registrado' };
      }
      next(error);
    }
  }

  // Listar todos los usuarios (solo admins)
  static async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  // Buscar usuario por email (solo admins)
  static async getUserByEmail(req, res, next) {
    try {
      const user = await userService.getByEmail(req.params.email);
      if (!user) throw { status: 404, message: 'Usuario no encontrado' };
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Buscar usuario por ID (solo admins)
  static async getUserById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      if (!user) throw { status: 404, message: 'Usuario no encontrado' };
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar usuario por ID (solo admins)
  static async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.update(req.params.id, req.body);
      if (!updatedUser) throw { status: 404, message: 'Usuario no encontrado' };
      res.json({ message: 'Usuario actualizado', user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar usuario por ID (solo admins)
  static async deleteUser(req, res, next) {
    try {
      const deletedUser = await userService.delete(req.params.id);
      if (!deletedUser) throw { status: 404, message: 'Usuario no encontrado' };
      res.json({ message: 'Usuario eliminado', user: deletedUser });
    } catch (error) {
      next(error);
    }
  }
}
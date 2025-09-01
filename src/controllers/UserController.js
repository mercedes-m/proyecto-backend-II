import { UserService } from '../services/UserService.js';

const userService = new UserService();

export class UserController {
  // Crear un nuevo usuario (solo admins)
  static async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ message: 'Usuario creado', user });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Listar todos los usuarios (solo admins)
  static async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Buscar usuario por email (solo admins)
  static async getUserByEmail(req, res) {
    try {
      const user = await userService.getUserByEmail(req.params.email);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Buscar usuario por ID (solo admins)
  static async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar usuario por ID (solo admins)
  static async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario actualizado', user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Eliminar usuario por ID (solo admins)
  static async deleteUser(req, res) {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);
      if (!deletedUser) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado', user: deletedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
import { UserService } from '../services/UserService.js';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../services/mailService.js';
import dotenv from 'dotenv';
import { UserDTO } from '../dtos/UserDTO.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const userService = new UserService();

export class SessionController {
  // Registro de usuario
  static async register(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      // Validación mínima
      if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
      }

      const user = await userService.create({ first_name, last_name, email, age, password });
      const userDTO = new UserDTO(user);
      res.status(201).json({ status: 'success', message: 'Usuario registrado', user: userDTO });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(400).json({ status: 'error', message: 'El email ya está registrado' });
      }
      // Validaciones de Mongoose
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(e => e.message).join(', ');
        return res.status(400).json({ status: 'error', message: messages });
      }
      res.status(500).json({ status: 'error', message: error.message || error });
    }
  }

  // Login y generación de JWT
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email y contraseña son obligatorios' });
      }

      const user = await userService.getByEmail(email);
      if (!user) return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });

      const validPassword = await userService.validatePassword(user, password);
      if (!validPassword) return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });

      const payload = { id: user.id, email: user.email, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.json({ status: 'success', message: 'Login exitoso', token });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message || error });
    }
  }

  // Obtener usuario actual a partir del token
  static async current(req, res) {
    try {
      const user = new UserDTO(req.user);
      res.json({ status: 'success', user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message || error });
    }
  }

  // Solicitar recuperación de contraseña
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ status: 'error', message: 'El email es obligatorio' });

      const user = await userService.getByEmail(email);
      if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      await sendPasswordResetEmail(email, token);

      res.json({ status: 'success', message: 'Correo de recuperación enviado' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message || error });
    }
  }

  // Resetear contraseña
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) return res.status(400).json({ status: 'error', message: 'Token y nueva contraseña son obligatorios' });

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userService.getById(decoded.id);
      if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

      const samePassword = await userService.validatePassword(user, newPassword);
      if (samePassword) return res.status(400).json({ status: 'error', message: 'La nueva contraseña no puede ser igual a la anterior' });

      await userService.update(user.id, { password: newPassword });
      res.json({ status: 'success', message: 'Contraseña restablecida correctamente' });
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(400).json({ status: 'error', message: 'Token inválido o expirado' });
      }
      res.status(500).json({ status: 'error', message: error.message || error });
    }
  }
}
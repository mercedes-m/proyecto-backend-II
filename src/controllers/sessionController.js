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
      const user = await userService.createUser(req.body);
      res.status(201).json({ message: 'Usuario registrado', user });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Login y generación de JWT
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

      // Validar contraseña
      const validPassword = await userService.validatePassword(user, password);
      if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

      const payload = { id: user.id, email: user.email, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.json({ message: 'Login exitoso', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener usuario actual a partir del token
  static async current(req, res) {
    try {
      const user = new UserDTO(req.user);
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Solicitar recuperación de contraseña
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      // Generar token temporal 1h
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

      // Enviar email
      await sendPasswordResetEmail(email, token);

      res.json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Resetear contraseña
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await userService.getUserById(decoded.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      const result = await userService.updateUser(user.id, { password: newPassword });
      res.json({ message: 'Contraseña restablecida correctamente', user: result });
    } catch (error) {
      res.status(400).json({ error: 'Token inválido o expirado' });
    }
  }
}
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
  static async register(req, res, next) {
    try {
      const user = await userService.create(req.body);
      const userDTO = new UserDTO(user);
      res.status(201).json({ message: 'Usuario registrado', user: userDTO });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw { status: 400, message: 'El email ya está registrado' };
      }
      next(error);
    }
  }

  // Login y generación de JWT
  static async login(req, res, next) {
    const { email, password } = req.body;
    const user = await userService.getByEmail(email);
    if (!user) throw { status: 401, message: 'Credenciales inválidas' };

    const validPassword = await userService.validatePassword(user, password);
    if (!validPassword) throw { status: 401, message: 'Credenciales inválidas' };

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ message: 'Login exitoso', token });
  }

  // Obtener usuario actual a partir del token
  static async current(req, res, next) {
    try {
      const user = new UserDTO(req.user);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  // Solicitar recuperación de contraseña
  static async forgotPassword(req, res, next) {
    const { email } = req.body;
    const user = await userService.getByEmail(email);
    if (!user) throw { status: 404, message: 'Usuario no encontrado' };

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    await sendPasswordResetEmail(email, token);

    res.json({ message: 'Correo de recuperación enviado' });
  }

  // Resetear contraseña
  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await userService.getById(decoded.id);
      if (!user) throw { status: 404, message: 'Usuario no encontrado' };

      const samePassword = await userService.validatePassword(user, newPassword);
      if (samePassword) throw { status: 400, message: 'La nueva contraseña no puede ser igual a la anterior' };

      await userService.update(user.id, { password: newPassword });

      res.json({ message: 'Contraseña restablecida correctamente' });
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw { status: 400, message: 'Token inválido o expirado' };
      }
      next(error);
    }
  }
}
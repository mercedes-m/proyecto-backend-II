import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserDTO } from '../dtos/UserDTO.js';
import { sendPasswordResetEmail } from '../services/mailService.js';
import User from '../dao/models/userModel.js'; 

const router = Router();

// Usar variables de entorno (con fallback en caso de no estar definidas)
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Registro de usuario con Passport local
router.post('/register', (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ error: info?.message || 'Error en registro' });
    }

    const userDTO = new UserDTO(user._doc); // Se usa DTO
    res.status(201).json({ message: 'Usuario registrado', user: userDTO });
  })(req, res, next);
});

// Login con Passport local
router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ message: 'Login exitoso', token });
  })(req, res, next);
});

// Ruta /current usando DTO
router.get('/current', (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Token inválido o expirado' });
    }

    const userDTO = new UserDTO(user._doc); // Se usa DTO
    res.json({ user: userDTO });
  })(req, res, next);
});

// Recuperación de contraseña

// Endpoint para solicitar recuperación (envía email con token)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Generar token temporal de 1h
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Enviar email con el token
    await sendPasswordResetEmail(email, token);

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar correo de recuperación' });
  }
});

// Endpoint para resetear contraseña
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Validar que la nueva contraseña no sea igual a la anterior
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    // Hashear nueva contraseña y guardar
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});

export default router;
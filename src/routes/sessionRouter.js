import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../dtos/UserDTO.js';

const router = Router();
const JWT_SECRET = 'tu_secreto_super_seguro'; 
const JWT_EXPIRES_IN = '1h'; // Duración del token

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

export default router;
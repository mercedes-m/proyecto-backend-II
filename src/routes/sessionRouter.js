import { Router } from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from '../controllers/sessionController.js';

const router = Router();

// Registro de usuario con Passport local
router.post('/register', (req, res, next) => {
  passport.authenticate('register', (err, user, info) =>
    registerUser(req, res, next, err, user, info)
  )(req, res, next);
});

// Login con Passport local
router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, info) =>
    loginUser(req, res, next, err, user, info)
  )(req, res, next);
});

// Ruta /current usando DTO
router.get('/current', (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) =>
    getCurrentUser(req, res, next, err, user, info)
  )(req, res, next);
});

// Recuperación de contraseña
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
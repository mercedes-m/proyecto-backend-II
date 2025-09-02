import { Router } from 'express';
import passport from 'passport';
import { SessionController } from '../controllers/sessionController.js';
import { authorize } from '../middlewares/authorization.js';

const router = Router();

// Registro de usuario (usa estrategia "register")
router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  SessionController.register
);

// Login (usa estrategia "login")
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  SessionController.login
);

// Usuario actual con DTO (usa estrategia "current")
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  SessionController.current
);

// Recuperación de contraseña
router.post('/forgot-password', SessionController.forgotPassword);
router.post('/reset-password', SessionController.resetPassword);

export default router;
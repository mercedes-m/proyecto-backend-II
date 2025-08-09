import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = 'tu_secreto_super_seguro'; // Mejor usar variable de entorno
const JWT_EXPIRES_IN = '1h'; // Duración del token

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

// Ruta para validar token y obtener usuario actual
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  // req.user viene de la estrategia current
  res.json({ user: req.user });
});

export default router;
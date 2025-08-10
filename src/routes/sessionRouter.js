import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = 'tu_secreto_super_seguro'; 
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

// Ruta para validar token y obtener usuario actual con manejo personalizado de error
router.get('/current', (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ error: info?.message || 'Token inválido o expirado' });
    }

    // Quitar password antes de enviar
    const { password, ...userWithoutPassword } = user._doc;

   res.json({ user: userWithoutPassword });
  })(req, res, next);
});

export default router;
import passport from 'passport';

/**
 * Middleware para proteger rutas según rol
 * @param {...string} rolesPermitidos - roles permitidos para acceder a la ruta
 */
export const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || 'Token inválido o expirado' });
      }

      // Si el rol del usuario no está permitido
      if (!rolesPermitidos.includes(user.role)) {
        return res.status(403).json({ error: 'Acceso denegado: no tienes permisos' });
      }

      req.user = user; // agregamos el usuario al request
      next();
    })(req, res, next);
  };
};
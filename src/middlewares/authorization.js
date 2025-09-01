import passport from 'passport';

/**
 * Middleware de autorización por roles
 * @param {...string} rolesPermitidos - Roles que pueden acceder (opcional). 
 * Si no se pasan roles, solo valida que el usuario esté autenticado.
 */
export const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .json({ error: info?.message || 'Token inválido o expirado' });
      }

      // Si no se pasaron roles, basta con estar autenticado
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(user.role)) {
        return res
          .status(403)
          .json({ error: 'Acceso denegado: no tienes permisos suficientes' });
      }

      req.user = user; // dejamos al usuario disponible en req
      next();
    })(req, res, next);
  };
};
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware de autorización por roles
 * @param {...string} rolesPermitidos 
 * Si no se pasan roles, solo valida que el usuario esté autenticado.
 */
export const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const token = authHeader.split(' ')[1]; // formato: "Bearer <token>"
      const decoded = jwt.verify(token, JWT_SECRET);

      // Guardamos al usuario decodificado en req.user
      req.user = decoded;

      // Si hay roles definidos, validamos
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.role)) {
        return res
          .status(403)
          .json({ error: 'Acceso denegado: no tienes permisos suficientes' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
};
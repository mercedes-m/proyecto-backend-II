import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { User } from '../dao/models/User.js';
import bcrypt from 'bcrypt';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const JWT_SECRET = 'tu_secreto_super_seguro'; 

export const initializePassport = () => {
  // Estrategia local para login con email y contraseña
  passport.use('login', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Estrategia JWT current
  passport.use('current', new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (!user) {
          return done(null, false, { message: 'Token inválido' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
};  

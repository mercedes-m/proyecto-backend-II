import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { User } from '../dao/models/userModel.js';
import bcrypt from 'bcrypt';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const JWT_SECRET = 'tu_secreto_super_seguro'; 

export const initializePassport = () => {
  // Estrategia local para registro
  passport.use('register', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false
    },
    async (req, email, password, done) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, false, { message: 'El usuario ya existe' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
          ...req.body,
          email,
          password: hashedPassword
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Estrategia local para login
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

  // Estrategia JWT para validar token
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
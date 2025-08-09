import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import passport from 'passport';
import { initializePassport } from './config/passportConfig.js';  // Ajusta ruta si es distinta

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import userRouter from './routes/userRouter.js'; 
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';

const app = express();

const uri = 'mongodb://127.0.0.1:27017/entrega-final';
mongoose.connect(uri)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Inicializar passport
initializePassport();
app.use(passport.initialize());

// Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter); 
app.use('/', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});

const io = new Server(httpServer);
websocket(io);
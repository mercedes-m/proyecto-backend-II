import { Router } from 'express';
import { User } from '../dao/models/User.js';

const router = Router();

// Ruta para crear un usuario (POST /api/users)
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    // Aquí luego vas a encriptar la contraseña antes de guardar
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
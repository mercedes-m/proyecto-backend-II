import { Router } from 'express';
import { User } from '../dao/models/User.js';

const router = Router();

/**
 * Crear un nuevo usuario
 */
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    // TODO: Aquí puedes encriptar la contraseña antes de guardarla
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Listar todos los usuarios
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Buscar usuario por email (poner antes de la búsqueda por ID)
 */
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Buscar usuario por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Eliminar usuario por ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado', user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
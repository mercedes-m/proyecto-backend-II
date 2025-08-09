import { Router } from 'express';
import { User } from '../dao/models/User.js';
import bcrypt from 'bcrypt';

const router = Router();

/**
 * Crear un nuevo usuario
 */
router.post('/', async (req, res) => {
  try {
    const userData = req.body;

    if (userData.password) {
      const saltRounds = 10;
      userData.password = bcrypt.hashSync(userData.password, saltRounds);
    }

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
 * Buscar usuario por email (antes de ID)
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
 * Actualizar usuario por ID
 */
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = bcrypt.hashSync(updateData.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado', user: updatedUser });
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
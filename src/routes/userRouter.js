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

    // Excluir password de la respuesta
    const { password, ...userWithoutPassword } = newUser._doc;

    res.status(201).json({ message: 'Usuario creado', user: userWithoutPassword });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * Listar todos los usuarios
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    // Quitar password de cada usuario
    const usersWithoutPassword = users.map(({ _doc }) => {
      const { password, ...userWithoutPassword } = _doc;
      return userWithoutPassword;
    });
    res.json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Buscar usuario por email 
 */
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { password, ...userWithoutPassword } = user._doc;
    res.json(userWithoutPassword);
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
    const { password, ...userWithoutPassword } = user._doc;
    res.json(userWithoutPassword);
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

    const { password, ...userWithoutPassword } = updatedUser._doc;
    res.json({ message: 'Usuario actualizado', user: userWithoutPassword });
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
    const { password, ...userWithoutPassword } = deletedUser._doc;
    res.json({ message: 'Usuario eliminado', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
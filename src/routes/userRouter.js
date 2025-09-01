import { Router } from 'express';
import { UserRepository } from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';
import { authorize } from '../middlewares/authorization.js';

const router = Router();
const userRepo = new UserRepository();

/**
 * Crear un nuevo usuario
 * (solo administradores pueden crear usuarios directamente)
 */
router.post('/', authorize('admin'), async (req, res) => {
  try {
    const userData = { ...req.body };

    if (userData.password) {
      const saltRounds = 10;
      userData.password = bcrypt.hashSync(userData.password, saltRounds);
    }

    const newUser = await userRepo.create(userData);

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
 * Listar todos los usuarios (solo admins)
 */
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const users = await userRepo.getAll();
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
 * Buscar usuario por email (solo admins)
 */
router.get('/email/:email', authorize('admin'), async (req, res) => {
  try {
    const user = await userRepo.getByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { password, ...userWithoutPassword } = user._doc;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Buscar usuario por ID (solo admins)
 */
router.get('/:id', authorize('admin'), async (req, res) => {
  try {
    const user = await userRepo.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { password, ...userWithoutPassword } = user._doc;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Actualizar usuario por ID (solo admins)
 */
router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = bcrypt.hashSync(updateData.password, saltRounds);
    }

    const updatedUser = await userRepo.update(req.params.id, updateData);
    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { password, ...userWithoutPassword } = updatedUser._doc;
    res.json({ message: 'Usuario actualizado', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Eliminar usuario por ID (solo admins)
 */
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const deletedUser = await userRepo.delete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { password, ...userWithoutPassword } = deletedUser._doc;
    res.json({ message: 'Usuario eliminado', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
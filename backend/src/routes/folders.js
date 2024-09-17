import express from 'express';
import Folder from '../models/Folder.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Crear una nueva carpeta
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, color } = req.body;
    const newFolder = new Folder({
      name,
      color,
      user: req.user.userId
    });
    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Error al crear la carpeta:', error);
    res.status(500).json({ message: 'Error al crear la carpeta' });
  }
});

// Obtener todas las carpetas del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.userId });
    res.json(folders);
  } catch (error) {
    console.error('Error al obtener las carpetas:', error);
    res.status(500).json({ message: 'Error al obtener las carpetas' });
  }
});
// Eliminar una carpeta
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const folder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
      if (!folder) {
        return res.status(404).json({ message: 'Carpeta no encontrada' });
      }
      res.json({ message: 'Carpeta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la carpeta:', error);
      res.status(500).json({ message: 'Error al eliminar la carpeta' });
    }
  });

export default router;
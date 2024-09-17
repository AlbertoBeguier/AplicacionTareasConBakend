import express from 'express';
import Folder from '../models/Folder.js';
import Task from '../models/Task.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all folders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.userId });
    
    // Obtener información adicional para cada carpeta
    const foldersWithInfo = await Promise.all(folders.map(async (folder) => {
      const taskCount = await Task.countDocuments({ folder: folder._id });
      const upcomingTasks = await Task.find({
        folder: folder._id,
        dueDate: { $gte: new Date() },
        completed: false
      }).sort({ dueDate: 1 }).limit(3);

      return {
        ...folder.toObject(),
        taskCount,
        upcomingTasks: upcomingTasks.map(task => ({
          _id: task._id,
          title: task.title,
          dueDate: task.dueDate
        }))
      };
    }));

    res.json(foldersWithInfo);
  } catch (error) {
    console.error('Error al obtener las carpetas:', error);
    res.status(500).json({ message: 'Error al obtener las carpetas' });
  }
});

// GET specific folder with tasks
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user.userId });
    if (!folder) {
      return res.status(404).json({ message: 'Carpeta no encontrada' });
    }
    const tasks = await Task.find({ folder: folder._id });
    res.json({ folder, tasks });
  } catch (error) {
    console.error('Error al obtener la carpeta y las tareas:', error);
    res.status(500).json({ message: 'Error al obtener la carpeta y las tareas' });
  }
});

// POST new folder
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

// PUT update folder
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, color } = req.body;
    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { name, color },
      { new: true }
    );
    if (!updatedFolder) {
      return res.status(404).json({ message: 'Carpeta no encontrada' });
    }
    res.json(updatedFolder);
  } catch (error) {
    console.error('Error al actualizar la carpeta:', error);
    res.status(500).json({ message: 'Error al actualizar la carpeta' });
  }
});

// DELETE folder
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedFolder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedFolder) {
      return res.status(404).json({ message: 'Carpeta no encontrada' });
    }
    // Eliminar todas las tareas asociadas a esta carpeta
    await Task.deleteMany({ folder: req.params.id });
    res.json({ message: 'Carpeta y tareas asociadas eliminadas exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la carpeta:', error);
    res.status(500).json({ message: 'Error al eliminar la carpeta' });
  }
});

export default router;
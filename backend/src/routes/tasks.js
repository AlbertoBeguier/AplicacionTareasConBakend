import express from 'express';
import Task from '../models/Task.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all tasks for a specific folder
router.get('/folder/:folderId', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ folder: req.params.folderId, user: req.user.userId });
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
});

// POST new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, dueDate, folderId } = req.body;
    let dueDateObj = null;
    if (dueDate) {
      dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime())) {
        return res.status(400).json({ message: 'Fecha de vencimiento inválida' });
      }
    }
    const newTask = new Task({
      title,
      description,
      dueDate: dueDateObj,
      folder: folderId,
      user: req.user.userId
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
});

// PUT update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, dueDate, completed } = req.body;
    let dueDateObj = null;
    if (dueDate) {
      dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime())) {
        return res.status(400).json({ message: 'Fecha de vencimiento inválida' });
      }
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, description, dueDate: dueDateObj, completed },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
});

// DELETE task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
});

export default router;
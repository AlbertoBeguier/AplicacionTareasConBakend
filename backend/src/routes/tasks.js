import express from 'express';

const router = express.Router();

// GET all tasks
router.get('/', (req, res) => {
  res.json({ message: "Get all tasks" });
});

// POST new task
router.post('/', (req, res) => {
  res.json({ message: "Create a new task" });
});

// Puedes agregar más rutas según sea necesario

export default router;
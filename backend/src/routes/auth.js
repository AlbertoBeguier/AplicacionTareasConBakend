import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`Intento de login para el usuario: ${username}`);
    console.log('Contraseña recibida:', password);
    
    // Buscar el usuario en la base de datos
    const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    
    if (!user) {
      console.log(`Usuario no encontrado: ${username}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    
    
    // Comparar la contraseña directamente
    if (user.password !== password) {
      console.log(`Contraseña incorrecta para el usuario: ${username}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    console.log(`Login exitoso para el usuario: ${username}`);
    
    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import FolderManager from './components/FolderManager';
import CreateUserForm from './components/CreateUserForm';
import FolderView from './components/FolderView';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');
    if (storedUsername && storedToken) {
      setUser({ username: storedUsername, token: storedToken });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  const handleCreateUser = () => {
    setShowCreateUserForm(true);
  };

  const handleCloseCreateUserForm = () => {
    setShowCreateUserForm(false);
  };

  const handleCreateUserSubmit = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/users', { username, password });
      console.log('Usuario creado:', response.data);
      setShowCreateUserForm(false);
      // Opcionalmente, puedes iniciar sesión automáticamente con el nuevo usuario
      // handleLogin(response.data);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error; // Re-lanza el error para que pueda ser manejado en el componente CreateUserForm
    }
  };

  const isAdmin = user && user.username === 'Alberto';

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onCreateUser={isAdmin ? handleCreateUser : undefined} 
        />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16">
          <Routes>
            <Route path="/login" element={!user ? <LoginForm onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route 
              path="/" 
              element={user ? <FolderManager user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/folder/:folderId" 
              element={user ? <FolderView /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        {showCreateUserForm && isAdmin && (
          <CreateUserForm onClose={handleCloseCreateUserForm} onCreateUser={handleCreateUserSubmit} />
        )}
      </div>
    </Router>
  );
}

export default App;
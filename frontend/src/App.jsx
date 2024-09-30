import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import LoginForm from './components/LoginForm';
import FolderManager from './components/FolderManager';
import CreateUserForm from './components/CreateUserForm';
import FolderView from './components/FolderView';
import axios from 'axios';
import './App.css';

const INACTIVITY_TIMEOUT = 12 * 60 * 60 * 1000; // 12 horas en milisegundos

function App() {
  const [user, setUser] = useState(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('lastActivity');
  }, []);

  const checkInactivity = useCallback(() => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity && Date.now() - parseInt(lastActivity, 10) > INACTIVITY_TIMEOUT) {
      handleLogout();
    }
  }, [handleLogout]);

  const updateLastActivity = useCallback(() => {
    localStorage.setItem('lastActivity', Date.now().toString());
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get('http://localhost:3000/api/verify-token', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (response.data.valid) {
            const storedUsername = localStorage.getItem('username');
            setUser({ username: storedUsername, token: storedToken });
            updateLastActivity();
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Error al verificar el token:', error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    const inactivityCheck = setInterval(checkInactivity, 60000); // Verificar cada minuto

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [handleLogout, checkInactivity, updateLastActivity]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('token', userData.token);
    updateLastActivity();
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
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  };

  const isAdmin = user && user.username === 'Alberto';

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onCreateUser={isAdmin ? handleCreateUser : undefined} 
        />
        <main className="flex-grow w-full px-2 sm:px-4 py-8 mt-16">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <LoginForm onLogin={handleLogin} />} 
            />
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;
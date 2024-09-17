import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import FolderManager from './components/FolderManager';
import CreateUserForm from './components/CreateUserForm';
import FolderView from './components/FolderView';

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

  const isAdmin = user && user.username === 'Alberto';

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onCreateUser={isAdmin ? handleCreateUser : undefined} 
        />
        <div className="container mx-auto px-4 py-8">
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
        </div>
        {showCreateUserForm && isAdmin && (
          <CreateUserForm onClose={handleCloseCreateUserForm} />
        )}
      </div>
    </Router>
  );
}

export default App;
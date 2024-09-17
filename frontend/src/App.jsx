import  { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import FolderManager from './components/FolderManager';
import CreateUserForm from './components/CreateUserForm';

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
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onCreateUser={isAdmin ? handleCreateUser : undefined} 
      />
      <div className="container mx-auto px-4 py-8">
        {user ? (
          <FolderManager user={user} />
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
      {showCreateUserForm && isAdmin && (
        <CreateUserForm onClose={handleCloseCreateUserForm} />
      )}
    </div>
  );
}

export default App;
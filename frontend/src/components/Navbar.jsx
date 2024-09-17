
import { LogOut, UserPlus } from 'lucide-react';
import PropTypes from 'prop-types';

const Navbar = ({ user, onLogout, onCreateUser }) => {
  const isAdmin = user && user.username === 'Alberto' && user.password === '12358131849';

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">TAREAS</h1>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white mr-4">Bienvenido, {user.username}</span>
            {isAdmin && (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                onClick={onCreateUser}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Crear Usuario
              </button>
            )}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }),
  onLogout: PropTypes.func.isRequired,
  onCreateUser: PropTypes.func.isRequired,
};

export default Navbar;
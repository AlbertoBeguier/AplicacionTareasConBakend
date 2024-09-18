import { LogOut, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <nav className="bg-gray-800 p-4 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {location.pathname !== '/' && (
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center mr-4"
                onClick={handleGoBack}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver
              </button>
            )}
            <h1 className="text-white text-2xl font-bold">TAREAS</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white mr-4">Bienvenido, {user.username}</span>
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
      <div className="h-1"></div>
    </>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;
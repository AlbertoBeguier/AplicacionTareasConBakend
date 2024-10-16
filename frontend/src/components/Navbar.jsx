import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import logo from "../assets/logoEstudio.png";
import logo1 from "../assets/logoEstudio1.png";
import './NavBar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogo1, setShowLogo1] = useState(true);

  useEffect(() => {
    const logoTimer = setInterval(() => {
      setShowLogo1(prevShowLogo1 => !prevShowLogo1);
    }, 20000); // Cambia el logo cada 20 segundos
    return () => clearInterval(logoTimer);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // Limpiar localStorage y sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Llamar a la función original de cierre de sesión
    onLogout();
  };

  return (
    <>
      <nav className="bg-gray-950 p-4 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="navbar-brand logo-container">
              <img
                src={logo}
                className={`d-inline-block align-top logo-img ${
                  showLogo1 ? "show" : ""
                }`}
                alt="logo"
              />
              <img
                src={logo1}
                className={`d-inline-block align-top logo-img ${
                  showLogo1 ? "" : "show"
                }`}
                alt="logo1"
              />
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {location.pathname !== '/' && (
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                onClick={handleGoBack}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver
              </button>
            )}
            {user && (
              <>
                <span className="text-white">Usuario Autorizado: {user.username}</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="h-2"></div>
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
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateFolderForm from './CreateFolderForm';
import FolderList from './FolderList';
import './FolderManager.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function FolderManager() {
  const [folders, setFolders] = useState([]);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/folders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFolders(response.data);
    } catch (error) {
      console.error('Error al obtener las carpetas:', error);
      setError('Error al cargar las carpetas. Por favor, intente de nuevo más tarde.');
    }
  };

  const handleCreateFolder = async (newFolder) => {
    try {
      const response = await axios.post(`${API_URL}/api/folders`, newFolder, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFolders([...folders, response.data]);
      setIsFormExpanded(false);
    } catch (error) {
      console.error('Error al crear la carpeta:', error);
      setError('Error al crear la carpeta. Por favor, intente de nuevo.');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(`${API_URL}/api/folders/${folderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFolders(folders.filter(folder => folder._id !== folderId));
    } catch (error) {
      console.error('Error al eliminar la carpeta:', error);
      setError('Error al eliminar la carpeta. Por favor, intente de nuevo.');
    }
  };

  const handleFolderSelect = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="mb-8">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4 titulo-nueva-carpeta">Crear Nueva Carpeta</h2>
          <button
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="w-full mb-4 bg-gray-800 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            {isFormExpanded ? 'Cerrar' : 'Abrir'} Formulario
            {isFormExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </button>

          {isFormExpanded && <CreateFolderForm onCreateFolder={handleCreateFolder} />}
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <FolderList
          folders={folders}
          onDeleteFolder={handleDeleteFolder}
          onSelectFolder={handleFolderSelect}
        />
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import CreateFolderForm from './CreateFolderForm';
import FolderList from './FolderList';

export default function FolderManager() {
  const [folders, setFolders] = useState([]);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/folders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFolders(response.data);
    } catch (error) {
      console.error('Error al obtener las carpetas:', error);
      setError('Error al cargar las carpetas');
    }
  };

  const handleCreateFolder = async (newFolder) => {
    try {
      const response = await axios.post('http://localhost:5000/api/folders', newFolder, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFolders([...folders, response.data]);
      setIsFormExpanded(false);
    } catch (error) {
      console.error('Error al crear la carpeta:', error);
      setError('Error al crear la carpeta');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/folders/${folderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFolders(folders.filter(folder => folder._id !== folderId));
    } catch (error) {
      console.error('Error al eliminar la carpeta:', error);
      setError('Error al eliminar la carpeta');
    }
  };

  return (
    <div className="w-full">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-8">
        <div className="w-1/2 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Crear Nueva Carpeta</h2>
          <button
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="w-full mb-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            {isFormExpanded ? 'Cerrar' : 'Abrir'} Formulario
            {isFormExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </button>

          {isFormExpanded && <CreateFolderForm onCreateFolder={handleCreateFolder} />}
        </div>

        <div className="w-1/2 bg-gray-800 p-8 rounded-lg shadow-lg">
          <FolderList folders={folders} onDeleteFolder={handleDeleteFolder} />
        </div>
      </div>
    </div>
  );
}
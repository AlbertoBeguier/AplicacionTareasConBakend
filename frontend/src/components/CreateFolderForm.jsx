import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const initialColor = '#3B82F6'; // Un azul por defecto

export default function CreateFolderForm({ onCreateFolder }) {
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState(initialColor);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    onCreateFolder({ name: folderName, color: folderColor });
    setFolderName('');
    setFolderColor(initialColor);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="folderName" className="block text-sm font-medium text-gray-300 carpetas">
          Nombre de la Carpeta
        </label>
        <input
          type="text"
          id="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Ingrese el nombre de la carpeta"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center space-x-3">
        <label htmlFor="folderColor" className="text-sm font-medium text-gray-300">
          Color de la Carpeta:
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            id="folderColor"
            value={folderColor}
            onChange={(e) => setFolderColor(e.target.value)}
            className="w-8 h-8 rounded-md border-0 cursor-pointer"
          />
          <span className="text-gray-300 text-sm">{folderColor}</span>
        </div>
      </div>
      <button 
        type="submit" 
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
        style={{ backgroundColor: folderColor }}
      >
        <PlusCircle className="mr-2 h-5 w-5" /> Crear Carpeta
      </button>
    </form>
  );
}

CreateFolderForm.propTypes = {
  onCreateFolder: PropTypes.func.isRequired,
};
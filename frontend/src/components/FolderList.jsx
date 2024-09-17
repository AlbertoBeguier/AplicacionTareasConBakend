import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder } from 'lucide-react';
import PropTypes from 'prop-types';
import ConfirmDialog from './ConfirmDialog';

export default function FolderList({ folders, onDeleteFolder }) {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, folderId: null, folderName: '' });
  const navigate = useNavigate();

  const handleDeleteClick = (e, folderId, folderName) => {
    e.stopPropagation();
    setConfirmDialog({ isOpen: true, folderId, folderName });
  };

  const handleConfirmDelete = () => {
    onDeleteFolder(confirmDialog.folderId);
    setConfirmDialog({ isOpen: false, folderId: null, folderName: '' });
  };

  const handleFolderClick = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Carpetas</h2>
      {folders.length === 0 ? (
        <p className="text-gray-400">No hay carpetas aún.</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {folders.map((folder) => (
            <div 
              key={folder._id} 
              className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-700"
              style={{ backgroundColor: folder.color + '33' }}
              onClick={() => handleFolderClick(folder._id)}
            >
              <div className="flex items-center">
                <Folder className="mr-3 h-5 w-5" style={{ color: folder.color }} />
                <span className="text-white">{folder.name}</span>
              </div>
              <button
                onClick={(e) => handleDeleteClick(e, folder._id, folder.name)}
                className="focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110"
              >
                <img 
                  src="/images/trash.png" 
                  alt="Eliminar carpeta" 
                  className="w-6 h-6"
                />
              </button>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, folderId: null, folderName: '' })}
        onConfirm={handleConfirmDelete}
        folderName={confirmDialog.folderName}
      />
    </div>
  );
}

FolderList.propTypes = {
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDeleteFolder: PropTypes.func.isRequired,
};
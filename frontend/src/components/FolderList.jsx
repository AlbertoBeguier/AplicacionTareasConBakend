import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Calendar } from 'lucide-react';
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Carpetas</h2>
      {folders.length === 0 ? (
        <p className="text-gray-400">No hay carpetas aún.</p>
      ) : (
        <div className="space-y-4">
          {folders.map((folder) => (
            <div 
              key={folder._id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-md"
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700"
                style={{ backgroundColor: folder.color + '33' }}
                onClick={() => handleFolderClick(folder._id)}
              >
                <div className="flex items-center">
                  <Folder className="mr-3 h-5 w-5" style={{ color: folder.color }} />
                  <span className="text-white font-medium">{folder.name}</span>
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
              <div className="px-4 py-2 bg-gray-700">
                <p className="text-sm text-gray-300">Total de tareas: {folder.taskCount}</p>
                {folder.upcomingTasks && folder.upcomingTasks.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-300">Próximas fechas de vencimiento:</p>
                    <ul className="mt-1 space-y-1">
                      {folder.upcomingTasks.map(task => (
                        <li key={task._id} className="flex items-center text-xs text-gray-400">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{task.title}: {formatDate(task.dueDate)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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
      taskCount: PropTypes.number.isRequired,
      upcomingTasks: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          dueDate: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  onDeleteFolder: PropTypes.func.isRequired,
};
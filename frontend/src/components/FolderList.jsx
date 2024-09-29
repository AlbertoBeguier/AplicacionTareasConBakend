import { useState } from 'react';
import { Folder, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import ConfirmDialog from './ConfirmDialog';
import './FolderList.css';

export default function FolderList({ folders, onDeleteFolder, onSelectFolder, onSelectTask }) {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, folderId: null, folderName: '' });

  const handleDeleteClick = (e, folderId, folderName) => {
    e.stopPropagation();
    setConfirmDialog({ isOpen: true, folderId, folderName });
  };

  const handleConfirmDelete = () => {
    onDeleteFolder(confirmDialog.folderId);
    setConfirmDialog({ isOpen: false, folderId: null, folderName: '' });
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Agregamos dos días a todos los cálculos
    const adjustedDiffDays = diffDays + 2;

    if (adjustedDiffDays <= 0) return { type: "overdue", text: "Tarea vencida" };
    if (adjustedDiffDays === 1) return { type: "today", text: "Vence hoy" };
    if (adjustedDiffDays === 2) return { type: "oneDay", text: "Vence mañana" };
    if (adjustedDiffDays === 3) return { type: "twoDays", text: "Vence pasado mañana" };
    return null;
  };

  if (!folders || folders.length === 0) {
    return <p className="text-gray-400">No hay carpetas aún.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 carpetas">Carpetas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <div 
            key={folder._id} 
            className="bg-gray-900 rounded-lg overflow-hidden shadow-md"
          >
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-900"
              style={{ backgroundColor: folder.color + '33' }}
              onClick={() => onSelectFolder(folder._id)}
            >
              <div className="flex items-center">
                <Folder className="mr-3 h-5 w-5" style={{ color: folder.color }} />
                <span className="text-white font-medium">{folder.name}</span>
              </div>
              <button
                onClick={(e) => handleDeleteClick(e, folder._id, folder.name)}
                className="p-1 bg-gray-900 text-white rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="px-4 py-2 bg-gray-900">
              {folder.upcomingTasks && folder.upcomingTasks.length > 0 ? (
                <div className="mt-2">
                  <ul className="mt-1 space-y-1">
                    {folder.upcomingTasks.map(task => {
                      const dueDateStatus = getDueDateStatus(task.dueDate);
                      return (
                        <li key={task._id} className="flex items-center justify-between text-xs text-gray-200">
                          <span 
                            className="cursor-pointer hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTask(folder._id, task._id);
                            }}
                          >
                            {task.title}
                          </span>
                          {dueDateStatus && (
                            <button
                              className={`px-2 py-1 rounded text-xs font-semibold animate-pulse ${
                                dueDateStatus.type === "overdue"
                                  ? "bg-red-500"
                                  : dueDateStatus.type === "today" || dueDateStatus.type === "oneDay"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              } text-white`}
                            >
                              {dueDateStatus.text}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Ingrese para ver tareas o agregarlas</p>
              )}
            </div>
          </div>
        ))}
      </div>
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
      upcomingTasks: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          dueDate: PropTypes.string,
          completed: PropTypes.bool,
        })
      ),
    })
  ),
  onDeleteFolder: PropTypes.func.isRequired,
  onSelectFolder: PropTypes.func.isRequired,
  onSelectTask: PropTypes.func.isRequired,
};
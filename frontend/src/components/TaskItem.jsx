import PropTypes from 'prop-types';
import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';

export default function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');

  const handleToggleComplete = () => {
    onUpdateTask(task._id, { completed: !task.completed });
  };

  const handleSaveEdit = () => {
    const updatedTask = {
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate ? new Date(editedDueDate).toISOString() : null
    };
    onUpdateTask(task._id, updatedTask);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <div className="bg-gray-700 p-4 rounded-md shadow-md">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-gray-600 text-white p-2 rounded"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full bg-gray-600 text-white p-2 rounded"
            rows="3"
          ></textarea>
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            className="w-full bg-gray-600 text-white p-2 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={handleSaveEdit} className="p-1 bg-green-500 text-white rounded">
              <Check size={16} />
            </button>
            <button onClick={() => setIsEditing(false)} className="p-1 bg-red-500 text-white rounded">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
              {task.title}
            </h3>
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(true)} className="p-1 bg-blue-500 text-white rounded">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDeleteTask(task._id)} className="p-1 bg-red-500 text-white rounded">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <p className="text-gray-300 mb-2 whitespace-pre-wrap">{task.description}</p>
          <div className="text-sm text-gray-400">
            <p>Creado: {formatDate(task.createdAt)}</p>
            {task.dueDate && <p>Vence: {formatDate(task.dueDate)}</p>}
          </div>
          <div className="mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-white">Completada</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onUpdateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
};
import  { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusCircle, X } from 'lucide-react';

export default function CreateTaskForm({ onCreateTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onCreateTask({ 
        title: title.trim().toUpperCase(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate) : null
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setIsFormVisible(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value.toUpperCase());
  };

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <button 
        onClick={handleToggleForm} 
        className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
      >
        {isFormVisible ? (
          <>
            <X className="mr-2 h-5 w-5" />
            Cerrar Formulario
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear Nueva Tarea
          </>
        )}
      </button>

      {isFormVisible && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Título</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="flex items-end space-x-4">
              <div className="flex-grow">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha de vencimiento (opcional)
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Crear
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

CreateTaskForm.propTypes = {
  onCreateTask: PropTypes.func.isRequired,
};
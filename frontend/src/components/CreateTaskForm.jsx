import { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusCircle } from 'lucide-react';

export default function CreateTaskForm({ onCreateTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false); // Controlar la visibilidad del formulario

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onCreateTask({ 
        title: title.trim(), 
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate) : null
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setIsFormVisible(false); // Ocultar el formulario después de crear la tarea
    }
  };

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible); // Cambiar la visibilidad del formulario
  };

  return (
    <div>
      {/* Botón para alternar el formulario */}
      <button 
        onClick={handleToggleForm} 
        className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
      >
        <PlusCircle className="mr-2 h-5 w-5" /> {isFormVisible ? 'Cerrar Formulario' : 'Abrir Formulario'}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300">Fecha de vencimiento (opcional)</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Crear Tarea
          </button>
        </form>
      )}
    </div>
  );
}

CreateTaskForm.propTypes = {
  onCreateTask: PropTypes.func.isRequired,
};

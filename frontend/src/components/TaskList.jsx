import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TaskItem from './TaskItem';
import CreateTaskForm from './CreateTaskForm';

export default function TaskList({ folderId }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!folderId) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/folder/${folderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(response.data);
      setError('');
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      setError('Error al cargar las tareas');
    }
  }, [folderId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (newTask) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', 
        { ...newTask, folderId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setTasks(prevTasks => [...prevTasks, response.data]);
      setError('');
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      setError('Error al crear la tarea');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, 
        updates,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? response.data : task));
      setError('');
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      setError('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setError('');
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      setError('Error al eliminar la tarea');
    }
  };

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-xl font-bold text-white mb-4">Tareas</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <CreateTaskForm onCreateTask={handleCreateTask} />
      {tasks.length === 0 ? (
        <p className="text-gray-400 mt-4">No hay tareas en esta carpeta.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
          {tasks.map((task) => (
            <div key={task._id} className="w-full">
              <TaskItem 
                task={task} 
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

TaskList.propTypes = {
  folderId: PropTypes.string.isRequired,
};
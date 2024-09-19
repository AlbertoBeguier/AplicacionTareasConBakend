import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateTaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';
import './FolderView.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function FolderView() {
  const [folder, setFolder] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const { folderId } = useParams();

  const fetchFolderAndTasks = useCallback(async () => {
    try {
      const [folderResponse, tasksResponse] = await Promise.all([
        axios.get(`${API_URL}/api/folders/${folderId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${API_URL}/api/tasks/folder/${folderId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setFolder(folderResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error al obtener la carpeta y las tareas:', error);
      setError('Error al cargar la carpeta y las tareas');
    }
  }, [folderId]);

  useEffect(() => {
    fetchFolderAndTasks();
  }, [fetchFolderAndTasks]);

  const handleCreateTask = async (newTask) => {
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, 
        { ...newTask, folderId },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(prevTasks => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      setError('Error al crear la tarea');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, 
        updates,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? response.data : task));
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      setError('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      setError('Error al eliminar la tarea');
    }
  };

  if (!folder) return <div className="text-white">Cargando...</div>;

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-6">{folder.name}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
 
        <CreateTaskForm onCreateTask={handleCreateTask} />
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4 titulo-tareas">Tareas</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No hay tareas en esta carpeta.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}
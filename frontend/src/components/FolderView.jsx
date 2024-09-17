import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateTaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

export default function FolderView() {
  const [folder, setFolder] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const { folderId } = useParams();
  const navigate = useNavigate();

  const fetchFolderAndTasks = useCallback(async () => {
    try {
      const [folderResponse, tasksResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/folders/${folderId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`http://localhost:5000/api/tasks/folder/${folderId}`, {
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
      const response = await axios.post('http://localhost:5000/api/tasks', 
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
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, 
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
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
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
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Volver
      </button>
      <h2 className="text-3xl font-bold text-white mb-6">{folder.name}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Crear Nueva Tarea</h3>
        <CreateTaskForm onCreateTask={handleCreateTask} />
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Tareas</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No hay tareas en esta carpeta.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem 
                key={task._id} 
                task={task} 
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
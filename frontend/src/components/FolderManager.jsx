import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateFolderForm from "./CreateFolderForm";
import FolderList from "./FolderList";
import "./FolderManager.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FolderManager() {
  const [folders, setFolders] = useState([]);
  const [tasks, setTasks] = useState({});
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const taskRefs = useRef({});

  const fetchTasksForFolder = useCallback(async (folderId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/tasks/folder/${folderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks((prevTasks) => ({
        ...prevTasks,
        [folderId]: response.data,
      }));
    } catch (error) {
      console.error(
        `Error al obtener las tareas para la carpeta ${folderId}:`,
        error
      );
    }
  }, []);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/folders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFolders(response.data);
      response.data.forEach((folder) => fetchTasksForFolder(folder._id));
    } catch (error) {
      console.error("Error al obtener las carpetas:", error);
      setError(
        "Error al cargar las carpetas. Por favor, intente de nuevo más tarde."
      );
    }
  }, [fetchTasksForFolder]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreateFolder = async (newFolder) => {
    try {
      const response = await axios.post(`${API_URL}/api/folders`, newFolder, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFolders((prevFolders) => [...prevFolders, response.data]);
      setIsFormExpanded(false);
      fetchTasksForFolder(response.data._id);
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
      setError("Error al crear la carpeta. Por favor, intente de nuevo.");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(`${API_URL}/api/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder._id !== folderId)
      );
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        delete newTasks[folderId];
        return newTasks;
      });
    } catch (error) {
      console.error("Error al eliminar la carpeta:", error);
      setError("Error al eliminar la carpeta. Por favor, intente de nuevo.");
    }
  };

  const handleFolderSelect = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  const handleTaskSelect = (folderId, taskId) => {
    const taskElement = taskRefs.current[`${folderId}-${taskId}`];
    if (taskElement) {
      taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const adjustedDiffDays = diffDays + 2;
   
    if (adjustedDiffDays <= 0) return { type: "overdue", text: "Tarea vencida", color: "bg-red-500" };
    if (adjustedDiffDays === 1) return { type: "today", text: "Vence hoy", color: "bg-orange-500" };
    if (adjustedDiffDays === 2) return { type: "oneDay", text: "Vence mañana", color: "bg-yellow-500" };
    if (adjustedDiffDays === 3) return { type: "twoDays", text: "Vence pasado mañana", color: "bg-green-500" };
    return null;
  };

  const foldersWithTasks = folders.map(folder => ({
    ...folder,
    upcomingTasks: tasks[folder._id] || []
  }));

  // Nuevo useEffect para cambiar el título dinámicamente
  useEffect(() => {
    const checkTasksStatus = () => {
      let hasOverdueTasks = false;
      let hasUpcomingTasks = false;

      folders.forEach((folder) => {
        const folderTasks = tasks[folder._id] || [];
        folderTasks.forEach((task) => {
          if (task.dueDate) {
            const today = new Date();
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
              hasOverdueTasks = true;
            } else if (diffDays <= 2) {
              hasUpcomingTasks = true;
            }
          }
        });
      });

      if (hasOverdueTasks && hasUpcomingTasks) {
        document.title = "Tareas Vencidas & A Vencer";
      } else if (hasOverdueTasks) {
        document.title = "Tareas Vencidas";
      } else if (hasUpcomingTasks) {
        document.title = "Tareas Próximas a Vencer";
      } else {
        document.title = "Tareas";
      }
    };

    checkTasksStatus();
  }, [folders, tasks]);

  return (
    <div className="w-full px-2 sm:px-4">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="mb-4">
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4 titulo-nueva-carpeta">
            Crear Nueva Carpeta
          </h2>
          <button
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="w-full mb-4 bg-gray-800 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            {isFormExpanded ? "Cerrar" : "Abrir"} Formulario
            {isFormExpanded ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </button>

          {isFormExpanded && (
            <CreateFolderForm onCreateFolder={handleCreateFolder} />
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
        <FolderList
          folders={foldersWithTasks}
          onDeleteFolder={handleDeleteFolder}
          onSelectFolder={handleFolderSelect}
          onSelectTask={handleTaskSelect}
        />
      </div>

      <div className="space-y-8">
        {foldersWithTasks.map((folder) => (
          <div key={folder._id} className="p-4 rounded-lg shadow-lg">
            <h3
              className="text-xl font-semibold mb-4 text-center uppercase"
              style={{ color: folder.color || "#ffffff" }}
            >
              {folder.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {folder.upcomingTasks.map((task) => {
                const dueDateStatus = getDueDateStatus(task.dueDate);
                return (
                  <div
                    key={task._id}
                    ref={el => taskRefs.current[`${folder._id}-${task._id}`] = el}
                    className="rounded-md shadow-md overflow-hidden"
                    style={{ backgroundColor: folder.color || "#374151" }}
                  >
                    <div
                      className="bg-black p-2 flex justify-between items-center cursor-pointer"
                      style={{
                        border: `1px solid ${folder.color || "#ffffff"}`,
                        borderTopLeftRadius: "0.375rem",
                        borderTopRightRadius: "0.375rem",
                        borderBottom: "none",
                      }}
                      onClick={() => handleFolderSelect(folder._id)}
                    >
                      <h4
                        className={`font-semibold ${
                          task.completed ? "line-through" : ""
                        }`}
                        style={{ color: folder.color || "#ffffff" }}
                      >
                        {task.title}
                      </h4>
                      {dueDateStatus && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold animate-pulse ${dueDateStatus.color} text-black`}
                        >
                          {dueDateStatus.text}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-black font-semibold mb-2 whitespace-pre-wrap">
                        {task.description}
                      </p>
                      <div className="text-sm text-black">
                        <p>Creado: {formatDate(task.createdAt)}</p>
                        {task.dueDate && (
                          <p>Vence: {formatDate(task.dueDate)}</p>
                        )}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-2 rounded ${
                            task.completed ? "bg-green-500" : "bg-yellow-500"
                          } text-black text-xs font-semibold shadow-md rounded-md border border-black`}
                          style={{ borderWidth: "0.5px" }}
                        >
                          {task.completed ? "Completada" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

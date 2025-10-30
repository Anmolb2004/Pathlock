import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.ts';
import type { Project, Task } from '../types';
import { Loader2, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import AddTaskForm from '../components/AddTaskForm.tsx';
import TaskItem from '../components/TaskItem.tsx';

type LoadingStates = {
  page: boolean;
  createTask: boolean;
  updateTask: string | null;
  deleteTask: string | null;
};

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<LoadingStates>({
    page: true,
    createTask: false,
    updateTask: null,
    deleteTask: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      navigate('/404');
      return;
    }
    const fetchProject = async () => {
      setLoading((prev) => ({ ...prev, page: true }));
      setError(null);
      try {
        const res = await api.get<Project>(`/projects/${projectId}`);
        setProject(res.data);
        const sortedTasks = (res.data.tasks || []).sort((a, b) => {
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
          }
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          return a.dueDate ? 1 : -1;
        });
        setTasks(sortedTasks);
      } catch (err: any) {
        if (err.response?.status === 401) navigate('/auth');
        else setError('Failed to fetch project details.');
      } finally {
        setLoading((prev) => ({ ...prev, page: false }));
      }
    };
    fetchProject();
  }, [projectId, navigate]);

  const handleAddTask = async (title: string, dueDate: string | null) => {
    if (!projectId) return;
    setLoading((prev) => ({ ...prev, createTask: true }));
    setError(null);
    try {
      const res = await api.post<Task>(`/projects/${projectId}/tasks`, {
        title,
        dueDate: dueDate || null,
      });
      setTasks([res.data, ...tasks]);
    } catch (err) {
      setError('Failed to create task.');
    } finally {
      setLoading((prev) => ({ ...prev, createTask: false }));
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    setLoading((prev) => ({ ...prev, updateTask: taskId }));
    setError(null);
    try {
      await api.put(`/tasks/${taskId}`, {
        isCompleted: !currentStatus,
      });
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, isCompleted: !currentStatus } : t
        )
      );
    } catch (err) {
      setError('Failed to update task.');
    } finally {
      setLoading((prev) => ({ ...prev, updateTask: null }));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading((prev) => ({ ...prev, deleteTask: taskId }));
    setError(null);
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task.');
    } finally {
      setLoading((prev) => ({ ...prev, deleteTask: null }));
    }
  };

  if (loading.page) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={40} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error && !project) {
    /* --- STYLE (DARK) --- */
    return (
      <div className="text-center p-10 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <AlertCircle size={48} className="mx-auto text-red-400" />
        <h2 className="text-2xl font-bold mt-6 mb-2 text-white">Error</h2>
        <p className="text-gray-300">{error}</p>
        <Link 
          to="/" 
          className="mt-6 inline-flex items-center gap-2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div>
      {/* --- STYLE (DARK) --- */ }
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
        <h1 className="text-4xl font-bold text-white">{project.title}</h1>
        {project.description && (
          <p className="text-lg text-gray-300 mt-2 max-w-2xl">{project.description}</p>
        )}
      </div>

      {error && (
        /* --- STYLE (DARK) --- */
        <div className="my-4 p-4 bg-red-900 bg-opacity-30 text-red-400 rounded-lg flex items-center gap-2 border border-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* --- STYLE (DARK) --- */ }
      <div className="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Add New Task
        </h2>
        <AddTaskForm onSubmit={handleAddTask} isLoading={loading.createTask} />
      </div>

      {/* --- STYLE (DARK) --- */ }
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Tasks ({tasks.length})
          </h2>
        </div>
        
        {tasks.length > 0 ? (
          /* --- STYLE (DARK) --- */
          <ul className="divide-y divide-gray-700">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                isUpdating={loading.updateTask === task.id || loading.deleteTask === task.id}
              />
            ))}
          </ul>
        ) : (
          /* --- STYLE (DARK) --- */
          <div className="text-center p-12">
            <Check size={48} className="mx-auto text-gray-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-300">All done!</h3>
            <p className="text-sm text-gray-400 mt-1">
              There are no tasks for this project yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
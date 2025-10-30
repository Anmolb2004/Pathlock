import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.ts';
import type { Project } from '../types';
import { useAuthStore } from '../store/authStore.ts';
import { Plus, Trash2, Loader2, AlertCircle, Folder, MessageSquare } from 'lucide-react';
import { AxiosError } from 'axios';

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get<Project[]>('/projects');
        setProjects(res.data);
      } catch (err: any) {
        setError('Failed to fetch projects.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    setIsCreating(true);
    setError(null);
    try {
      const res = await api.post<Project>('/projects', {
        title: newProjectTitle,
        description: newProjectDesc,
      });
      setProjects([res.data, ...projects]);
      setNewProjectTitle('');
      setNewProjectDesc('');
    } catch (err: any) {
      if (err instanceof AxiosError && err.response?.data?.errors) {
        setError('Validation failed. Title must be 3-100 characters.');
      } else {
        setError('Failed to create project.');
      }
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    setError(null);
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err: any) {
      setError('Failed to delete project. Ensure it has no tasks first.');
      console.error(err);
    }
  };

  // --- 4. RENDER LOGIC ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      );
    }

    if (error && projects.length === 0) {
      /* --- STYLE (DARK) --- */
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <AlertCircle className="text-red-400" size={32} />
          <p className="mt-4 text-lg font-medium text-red-400">{error}</p>
        </div>
      );
    }

    if (projects.length === 0) {
      /* --- STYLE (DARK) --- */
      return (
        <div className="text-center py-20 bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <Folder size={48} className="mx-auto text-gray-500" />
          <h3 className="mt-4 text-xl font-medium text-gray-200">No projects yet</h3>
          <p className="text-gray-400 mt-2">Get started by creating your first project.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          /* --- STYLE (DARK) --- */
          <div
            key={project.id}
            className="bg-gray-800 rounded-lg shadow-md border border-gray-700 transition-all hover:shadow-lg hover:border-indigo-600"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <Link
                  to={`/project/${project.id}`}
                  className="flex-grow"
                >
                  <h3 className="font-bold text-lg text-indigo-400 hover:underline">
                    {project.title}
                  </h3>
                </Link>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  /* --- STYLE (DARK) --- */
                  className="p-2 -mt-2 -mr-2 text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Delete project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-300 mt-2 h-10 line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
            </div>
            {/* --- STYLE (DARK) --- */ }
            <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 rounded-b-lg flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MessageSquare size={16} />
                <span>{project.taskCount} task(s)</span>
              </div>
              <span className="text-xs text-gray-500">
                Created: {new Date(project.creationDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {user?.username}
        </h1>
      </div>

      {/* --- STYLE (DARK) --- */ }
      <form onSubmit={handleCreateProject} className="mb-10 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">
          Create New Project
        </h2>
        {error && !projects.length && (
          <p className="text-sm text-red-400 mb-4">{error}</p>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="new-project-title" className="block text-sm font-medium text-gray-300 mb-1">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              id="new-project-title"
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="E.g., Website Redesign"
              /* --- STYLE (DARK) --- */
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required minLength={3} maxLength={100}
            />
          </div>
          <div>
            <label htmlFor="new-project-desc" className="block text-sm font-medium text-gray-300 mb-1">
              Description (Optional)
            </label>
            <input
              id="new-project-desc"
              type="text"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              placeholder="A brief summary of the project..."
              /* --- STYLE (DARK) --- */
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={500}
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            /* --- STYLE (DARK) --- */
            className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-150 disabled:opacity-60"
          >
            {isCreating ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Plus size={20} />
            )}
            <span className="ml-2">Create Project</span>
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold text-white mb-6">Your Projects</h2>
      {renderContent()}
    </div>
  );
};

export default DashboardPage;

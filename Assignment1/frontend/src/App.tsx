import { useState, useEffect, useMemo } from 'react';
import type { TaskItem } from './types.ts';
import * as api from './api.ts';
import TaskList from './components/TaskList.tsx';
import AddTaskForm from './components/AddTaskForm.tsx';
import { Loader2, AlertCircle } from 'lucide-react';

// Define the filter types
type FilterType = 'all' | 'active' | 'completed';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial page load
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // A Set to track IDs of tasks being added, toggled, or deleted
  const [mutatingIds, setMutatingIds] = useState(new Set<string>());

  // Initial Data Load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const fetchedTasks = await api.getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // --- Task Handlers ---

  const handleTaskAdded = async (description: string) => {
    try {
      setError(null);
      const newTask = await api.addTask(description);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      throw err;
    }
  };

  const handleToggleTask = async (id: string) => {
    // Optimistic UI update
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
    
    setMutatingIds(prev => new Set(prev).add(id));
    
    try {
      setError(null);
      await api.toggleTask(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
      // Revert optimistic update on error
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );
    } finally {
      setMutatingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Optimistic UI update
    const originalTasks = tasks;
    setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    
    setMutatingIds(prev => new Set(prev).add(id));

    try {
      setError(null);
      await api.deleteTask(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      // Revert optimistic update on error
      setTasks(originalTasks);
    } finally {
      setMutatingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // --- Filtering ---

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.isCompleted);
      case 'completed':
        return tasks.filter((task) => task.isCompleted);
      case 'all':
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // --- Render ---

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <Loader2 size={40} className="animate-spin text-blue-400" />
        </div>
      );
    }
    
    return (
      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        mutatingIds={mutatingIds}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 sm:py-12 font-sans">
      <div className="mx-auto w-full max-w-2xl px-4">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
              My Tasks
            </span>
          </h1>
        </header>

        {/* Main Card */}
        <div className="divide-y divide-slate-700 rounded-lg bg-slate-800 shadow-2xl border border-slate-700">
          {/* Add Task Form */}
          <div className="p-6">
            <AddTaskForm onTaskAdded={handleTaskAdded} />
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-2 p-4">
            <FilterButton
              label="All"
              isActive={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            <FilterButton
              label="Active"
              isActive={filter === 'active'}
              onClick={() => setFilter('active')}
            />
            <FilterButton
              label="Completed"
              isActive={filter === 'completed'}
              onClick={() => setFilter('completed')}
            />
          </div>

          {/* Task List or Loader */}
          <div className="px-6">
            {renderContent()}
          </div>
        </div>
        
        {/* Global Error Toast */}
        {error && <ErrorMessage message={error} onClear={() => setError(null)} />}

      </div>
    </div>
  );
}

// --- Sub-Components ---

function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors
        ${isActive
          ? 'bg-blue-600 text-white'
          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
        }
      `}
    >
      {label}
    </button>
  );
}

function ErrorMessage({ message, onClear }: { message: string, onClear: () => void }) {
  // This component's styling is already good for dark mode
  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg bg-red-600 p-4 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle />
          <span className="font-medium">{message}</span>
        </div>
        <button onClick={onClear} className="font-bold text-red-100 hover:text-white">&times;</button>
      </div>
    </div>
  )
}
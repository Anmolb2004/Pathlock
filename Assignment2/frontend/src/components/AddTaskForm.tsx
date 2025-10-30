import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

type AddTaskFormProps = {
  onSubmit: (title: string, dueDate: string | null) => Promise<void>;
  isLoading: boolean;
};

const AddTaskForm = ({ onSubmit, isLoading }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    
    await onSubmit(title.trim(), dueDate || null);
    
    setTitle('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          /* --- STYLE (DARK) --- */
          className="flex-grow px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600"
          disabled={isLoading}
          required
        />
        
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          /* --- STYLE (DARK) --- */
          className="px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600"
          disabled={isLoading}
          aria-label="Due date"
        />

        <button
          type="submit"
          /* --- STYLE (DARK) --- */
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || title.trim() === ''}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          <span>Add Task</span>
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;


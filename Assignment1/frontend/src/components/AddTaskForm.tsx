import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

// This component now has its own loading state
interface AddTaskFormProps {
  onTaskAdded: (description: string) => Promise<void>;
}

export default function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsAdding(true);
    try {
      await onTaskAdded(description);
      setDescription(''); // Clear input only on success
    } catch (error) {
      // The parent App.tsx will show the error message
      console.error('Failed to add task:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isAdding} // Disable input while adding
        className="flex-grow rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-lg text-gray-100
                   placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isAdding} // Disable button while adding
        className="flex w-32 items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white 
                   shadow-sm transition-colors duration-150 hover:bg-blue-700 
                   disabled:cursor-not-allowed disabled:bg-blue-500 disabled:opacity-60"
      >
        {isAdding ? (
          <Loader2 className="animate-spin" /> // Show spinner
        ) : (
          <><Plus size={20} className="mr-1" /> Add</>
        )}
      </button>
    </form>
  );
}
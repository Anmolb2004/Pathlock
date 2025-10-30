import type { Task } from '../types';
import { Trash2, Loader2, Check, Circle, Calendar } from 'lucide-react';

type TaskItemProps = {
  task: Task;
  onToggle: (taskId: string, currentStatus: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  isUpdating: boolean;
};

const TaskItem = ({ task, onToggle, onDelete, isUpdating }: TaskItemProps) => {
  
  const isCompleted = task.isCompleted;
  const Icon = isCompleted ? Check : Circle;
  
  const isOverdue = task.dueDate && !isCompleted && new Date(task.dueDate) < new Date();

  return (
    /* --- STYLE (DARK) --- */
    <li className="flex items-center justify-between p-4 pl-5 group hover:bg-gray-700 bg-gray-800 transition-colors">
      <div className="flex items-center gap-4">
        {/* --- STYLE (DARK) --- */ }
        <button
          onClick={() => onToggle(task.id, isCompleted)}
          disabled={isUpdating}
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150
            ${isCompleted 
              ? 'bg-indigo-600 text-white' 
              : 'border-2 border-gray-500 text-gray-500 hover:border-indigo-500 hover:text-indigo-500'}
            ${isUpdating ? 'cursor-not-allowed' : ''}`}
          aria-label={isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
        >
          {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} strokeWidth={3} />}
        </button>
        
        <div>
          {/* --- STYLE (DARK) --- */ }
          <span className={`text-gray-100 ${isCompleted ? 'line-through text-gray-500' : 'font-medium'}`}>
            {task.title}
          </span>
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 text-sm mt-1
              ${isCompleted ? 'text-gray-500' : isOverdue ? 'text-red-400 font-medium' : 'text-gray-400'}
            `}>
              <Calendar size={14} />
              <span>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        disabled={isUpdating}
        /* --- STYLE (DARK) --- */
        className="p-2 text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-700 transition-all
                   sm:opacity-0 group-hover:opacity-100 focus:opacity-100
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Delete task"
      >
        {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </li>
  );
};

export default TaskItem;
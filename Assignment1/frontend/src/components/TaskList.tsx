import type { TaskItem } from '../types.ts';
import { Trash2, Loader2, Check } from 'lucide-react';

interface TaskListProps {
  tasks: TaskItem[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  mutatingIds: Set<string>;
}

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  mutatingIds,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="py-8 text-center text-lg text-gray-400">
        No tasks yet. Add one above!
      </p>
    );
  }

  // Handle the async call and let App.tsx manage errors
  const handleToggle = (id: string) => {
    onToggle(id);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <ul className="divide-y divide-slate-700">
      {tasks.map((task) => {
        const isMutating = mutatingIds.has(task.id);
        return (
          <li
            key={task.id}
            className={`flex items-center justify-between gap-4 py-4 transition-opacity ${
              isMutating ? 'opacity-40' : 'opacity-100'
            }`}
          >
            {/* Checkbox and Description */}
            <div
              className="flex flex-grow cursor-pointer items-center gap-3"
              onClick={() => !isMutating && handleToggle(task.id)}
            >
              <button
                aria-label="Toggle task"
                disabled={isMutating}
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
                  ${task.isCompleted
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-500 bg-transparent hover:border-blue-500'}
                  ${isMutating ? 'cursor-not-allowed' : ''}
                `}
              >
                {task.isCompleted && <Check size={16} className="text-white" />}
              </button>
              <span
                className={`text-lg ${
                  task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-100'
                }`}
              >
                {task.description}
              </span>
            </div>

            {/* Delete Button / Spinner */}
            <div className="flex-shrink-0">
              {isMutating ? (
                <Loader2 className="animate-spin text-gray-400" />
              ) : (
                <button
                  onClick={() => handleDelete(task.id)}
                  aria-label="Delete task"
                  className="rounded-md p-1 text-gray-500 transition-colors hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
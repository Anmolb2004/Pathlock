using BasicTaskManager.Models;

namespace BasicTaskManager.Services
{
    /// <summary>
    /// The "in-memory" implementation of the service.
    /// This is the class that holds the list.
    /// </summary>
    public class InMemoryTaskService : ITaskService
    {
        // A static list holds the data as long as the app is running
        private static readonly List<TaskItem> _tasks = new();

        // Add some dummy data on startup
        public InMemoryTaskService()
        {
            if (_tasks.Count == 0)
            {
                _tasks.Add(new TaskItem { Id = Guid.NewGuid(), Description = "Build .NET 8 Backend (Properly)", IsCompleted = true });
                _tasks.Add(new TaskItem { Id = Guid.NewGuid(), Description = "Build React Frontend (Properly)", IsCompleted = false });
            }
        }

        // *** THIS IS THE FIX ***
        // Added the { return ... ; }
        public IEnumerable<TaskItem> GetAllTasks()
        {
            return _tasks.OrderBy(t => t.IsCompleted).ThenBy(t => t.Description);
        }

        public TaskItem AddTask(string description)
        {
            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Description = description,
                IsCompleted = false
            };
            _tasks.Add(task);
            return task;
        }

        public bool ToggleTaskCompletion(Guid id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return false; // Not found

            task.IsCompleted = !task.IsCompleted;
            return true;
        }

        public bool DeleteTask(Guid id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return false; // Not found

            _tasks.Remove(task);
            return true;
        }
    }
}
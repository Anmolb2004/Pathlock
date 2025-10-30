using BasicTaskManager.Models;

namespace BasicTaskManager.Services
{
    /// <summary>
    /// An "Interface" for our service. Defines *what* it can do.
    /// This is key for testing and good practice (Dependency Inversion).
    /// </summary>
    public interface ITaskService
    {
        IEnumerable<TaskItem> GetAllTasks();
        TaskItem AddTask(string description);
        bool ToggleTaskCompletion(Guid id);
        bool DeleteTask(Guid id);
    }
}

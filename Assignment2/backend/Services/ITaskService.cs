using MiniProjectManager.Dtos;

namespace MiniProjectManager.Services
{
    public interface ITaskService
    {
        Task<TaskDto?> CreateTaskAsync(Guid projectId, CreateTaskRequest request);
        Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskRequest request);
        Task<bool> DeleteTaskAsync(Guid taskId);
    }
}

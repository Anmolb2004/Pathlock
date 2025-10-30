using MiniProjectManager.Dtos;

namespace MiniProjectManager.Services
{
    public interface ISchedulerService
    {
        Task<ScheduleResponse?> GetScheduleAsync(Guid projectId, ScheduleRequest request);
    }
}

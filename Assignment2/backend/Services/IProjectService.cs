using MiniProjectManager.Dtos;

namespace MiniProjectManager.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetProjectsAsync();
        Task<ProjectDto?> GetProjectByIdAsync(Guid projectId);
        Task<ProjectDto> CreateProjectAsync(CreateProjectRequest request);
        Task<bool> DeleteProjectAsync(Guid projectId);
    }
}


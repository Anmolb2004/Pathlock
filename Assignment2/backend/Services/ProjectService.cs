using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Data;
using MiniProjectManager.Dtos; 
using MiniProjectManager.Models;
using System.Security.Claims;

namespace MiniProjectManager.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ProjectManagerDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProjectService(ProjectManagerDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        private Guid GetCurrentUserId()
        {
            var userId = _httpContextAccessor.HttpContext?.User?
                .FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (userId == null)
            {
                throw new ApplicationException("User not authenticated.");
            }
            return new Guid(userId);
        }

        public async Task<IEnumerable<ProjectDto>> GetProjectsAsync()
        {
            var userId = GetCurrentUserId();

            // This is the key: .Where(p => p.UserId == userId)
            return await _context.Projects
                .Where(p => p.UserId == userId)
                .OrderBy(p => p.CreationDate)
                .Select(p => new ProjectDto // Note: This DTO doesn't include the task list
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreationDate = p.CreationDate,
                    // We can get the count efficiently
                    // Tasks = new List<TaskDto>(), // Keep this empty for the list view
                })
                .ToListAsync();
        }

        public async Task<ProjectDto?> GetProjectByIdAsync(Guid projectId)
        {
            var userId = GetCurrentUserId();

            // --- MODIFIED ---
            // Now we .Include(p => p.Tasks) to load them
            var project = await _context.Projects
                .Include(p => p.Tasks) 
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId); 

            if (project == null) return null;

            // Map the project and its tasks to the DTO
            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreationDate = project.CreationDate,
                // --- NEW ---
                // Map the loaded tasks to TaskDto
                Tasks = project.Tasks.Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    // --- THIS IS THE FIX ---
                    // The DTO (left) is IsCompleted, the Model (right) is CompletionStatus
                    IsCompleted = t.CompletionStatus, 
                    // ----------------------
                    DueDate = t.DueDate,
                    ProjectId = t.ProjectId
                }).OrderBy(t => t.IsCompleted).ThenBy(t => t.DueDate).ToList()
            };
        }

        public async Task<ProjectDto> CreateProjectAsync(CreateProjectRequest request)
        {
            var userId = GetCurrentUserId();

            var project = new Project
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                CreationDate = DateTime.UtcNow,
                UserId = userId 
            };

            await _context.Projects.AddAsync(project);
            await _context.SaveChangesAsync();

            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreationDate = project.CreationDate,
                Tasks = new List<TaskDto>() // New project has no tasks
            };
        }

        public async Task<bool> DeleteProjectAsync(Guid projectId)
        {
            var userId = GetCurrentUserId();

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null) return false; 

            // Note: EF Core is smart. Deleting the project will
            // cascade and delete all its tasks.
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Data;
using MiniProjectManager.Dtos;
using MiniProjectManager.Models;
using System.Security.Claims;

namespace MiniProjectManager.Services
{
    public class TaskService : ITaskService
    {
        private readonly ProjectManagerDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TaskService(ProjectManagerDbContext context, IHttpContextAccessor httpContextAccessor)
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

        public async Task<TaskDto?> CreateTaskAsync(Guid projectId, CreateTaskRequest request)
        {
            var userId = GetCurrentUserId();

            // First, find the project and verify the user owns it
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                // Project not found or user doesn't own it
                return null;
            }

            // If ownership is verified, create the task
            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                DueDate = request.DueDate,
                // --- FIX 1 ---
                // Model property is CompletionStatus
                CompletionStatus = false,
                // ---------------
                ProjectId = projectId // Link to the parent project
            };

            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();

            // Map to DTO to send back
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                // --- FIX 2 ---
                // DTO property = Model property
                IsCompleted = task.CompletionStatus,
                // ---------------
                ProjectId = task.ProjectId
            };
        }

        public async Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskRequest request)
        {
            var userId = GetCurrentUserId();

            // This is the key security check:
            // Find the task, include its Project, and check the Project's UserId
            var task = await _context.Tasks
                .Include(t => t.Project) // Load the parent project
                .FirstOrDefaultAsync(t => t.Id == taskId);
            
            // --- FIX 4 (for Warning CS8602) ---
            // Added check for task.Project
            if (task == null || task.Project == null || task.Project.UserId != userId)
            {
                // Task not found, or user doesn't own the parent project
                return false;
            }

            // If checks pass, update the task
            task.Title = request.Title;
            task.DueDate = request.DueDate;
            // --- FIX 3 ---
            // Model property = DTO property
            task.CompletionStatus = request.IsCompleted;
            // ---------------

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTaskAsync(Guid taskId)
        {
            var userId = GetCurrentUserId();

            // Same security check as Update
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            // --- FIX 4 (for Warning CS8602) ---
            // Added check for task.Project
            if (task == null || task.Project == null || task.Project.UserId != userId)
            {
                return false;
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
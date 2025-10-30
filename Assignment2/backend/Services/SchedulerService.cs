using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Data;
using MiniProjectManager.Dtos;
using System.Security.Claims;

namespace MiniProjectManager.Services
{
    public class SchedulerService : ISchedulerService
    {
        private readonly ProjectManagerDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SchedulerService(ProjectManagerDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ScheduleResponse?> GetScheduleAsync(Guid projectId, ScheduleRequest request)
        {
            var userId = GetCurrentUserId();

            // --- 1. Security Check ---
            // First, verify the user owns the project they're asking to schedule for.
            var project = await _context.Projects
                .AsNoTracking() // Read-only, faster
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                // Project not found or user doesn't own it.
                return null; 
            }

            // --- 2. Topological Sort (Kahn's Algorithm) ---
            var recommendedOrder = new List<string>();
            
            // Stores the "in-degree" (number of dependencies) for each task
            var inDegree = new Dictionary<string, int>();
            
            // An "adjacency list" mapping a task to all tasks that depend on it
            var adj = new Dictionary<string, List<string>>();

            // Initialize the graph and in-degree map
            foreach (var task in request.Tasks)
            {
                adj[task.Title] = new List<string>();
                inDegree[task.Title] = 0;
            }

            // Build the graph and in-degree counts
            foreach (var task in request.Tasks)
            {
                foreach (var depTitle in task.Dependencies)
                {
                    // If "Implement Backend" depends on "Design API",
                    // add "Implement Backend" to "Design API"'s adjacency list.
                    if (adj.ContainsKey(depTitle))
                    {
                        adj[depTitle].Add(task.Title);
                        // Increment the in-degree of "Implement Backend"
                        inDegree[task.Title]++;
                    }
                    // We could add an error case here if a dependency doesn't exist
                }
            }

            // Initialize the queue with all tasks that have 0 dependencies
            var queue = new Queue<string>();
            foreach (var task in request.Tasks)
            {
                if (inDegree[task.Title] == 0)
                {
                    queue.Enqueue(task.Title);
                }
            }

            // Process the queue
            while (queue.Count > 0)
            {
                var currentTaskTitle = queue.Dequeue();
                recommendedOrder.Add(currentTaskTitle);

                // "Complete" this task by decrementing the in-degree
                // of all tasks that depended on it.
                foreach (var neighborTaskTitle in adj[currentTaskTitle])
                {
                    inDegree[neighborTaskTitle]--;
                    if (inDegree[neighborTaskTitle] == 0)
                    {
                        queue.Enqueue(neighborTaskTitle);
                    }
                }
            }

            // --- 3. Cycle Detection ---
            // If the final list doesn't have all tasks, there was a cycle.
            if (recommendedOrder.Count != request.Tasks.Count)
            {
                // e.g., Task A depends on B, and Task B depends on A
                return null; // Or throw a specific error
            }

            return new ScheduleResponse { RecommendedOrder = recommendedOrder };
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
    }
}

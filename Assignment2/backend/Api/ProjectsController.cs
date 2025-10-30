using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.Dtos;
using MiniProjectManager.Services;

namespace MiniProjectManager.Api
{
    [ApiController]
    [Route("api/projects")]
    [Authorize] 
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ITaskService _taskService; // --- NEW ---

        // --- MODIFIED ---
        public ProjectsController(IProjectService projectService, ITaskService taskService)
        {
            _projectService = projectService;
            _taskService = taskService; // --- NEW ---
        }

        // GET /api/projects
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _projectService.GetProjectsAsync();
            return Ok(projects);
        }

        // GET /api/projects/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(Guid id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null)
            {
                return NotFound("Project not found or you do not have access.");
            }
            return Ok(project);
        }

        // POST /api/projects
        [HttpPost]
        public async Task<IActionResult> CreateProject(CreateProjectRequest request)
        {
            var project = await _projectService.CreateProjectAsync(request);
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // DELETE /api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var success = await _projectService.DeleteProjectAsync(id);
            if (!success)
            {
                return NotFound("Project not found or you do not have access.");
            }
            return NoContent(); 
        }

        // --- NEW ENDPOINT ---
        // POST /api/projects/{projectId}/tasks
        [HttpPost("{projectId}/tasks")]
        public async Task<IActionResult> CreateTask(Guid projectId, CreateTaskRequest request)
        {
            var task = await _taskService.CreateTaskAsync(projectId, request);
            if (task == null)
            {
                // This means the project wasn't found or user doesn't own it
                return Forbid("You do not have access to this project.");
            }
            
            // We don't have a "GetTask" endpoint, so just return 201 Created
            return Created($"api/tasks/{task.Id}", task); 
        }
    }
}
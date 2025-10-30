using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.Dtos;
using MiniProjectManager.Services;

namespace MiniProjectManager.Api
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize] // All task endpoints are protected
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // PUT /api/tasks/{taskId}
        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateTask(Guid taskId, UpdateTaskRequest request)
        {
            var success = await _taskService.UpdateTaskAsync(taskId, request);
            if (!success)
            {
                return NotFound("Task not found or you do not have access.");
            }
            return NoContent(); // 204 No Content (success)
        }

        // DELETE /api/tasks/{taskId}
        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(Guid taskId)
        {
            var success = await _taskService.DeleteTaskAsync(taskId);
            if (!success)
            {
                return NotFound("Task not found or you do not have access.");
            }
            return NoContent(); // 204 No Content (success)
        }
    }
}
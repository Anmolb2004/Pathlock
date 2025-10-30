using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.Dtos;
using MiniProjectManager.Services;

namespace MiniProjectManager.Api
{
    [ApiController]
    [Route("api/v1/projects")] // Note the "v1" route
    [Authorize] // All endpoints here are protected
    public class SchedulerController : ControllerBase
    {
        private readonly ISchedulerService _schedulerService;

        public SchedulerController(ISchedulerService schedulerService)
        {
            _schedulerService = schedulerService;
        }

        // POST /api/v1/projects/{projectId}/schedule
        [HttpPost("{projectId}/schedule")]
        public async Task<IActionResult> ScheduleProject(Guid projectId, ScheduleRequest request)
        {
            if (request.Tasks == null || !request.Tasks.Any())
            {
                return BadRequest("No tasks provided to schedule.");
            }

            var response = await _schedulerService.GetScheduleAsync(projectId, request);

            if (response == null)
            {
                return BadRequest("Could not generate schedule. This may be due to a project access issue or a dependency cycle in your tasks.");
            }

            return Ok(response);
        }
    }
}

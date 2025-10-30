using BasicTaskManager.Models;
using BasicTaskManager.Services;
using Microsoft.AspNetCore.Mvc;

namespace BasicTaskManager.Api
{
    /// <summary>
    /// This static class holds our API endpoint definitions.
    /// It's clean and separate from Program.cs.
    /// </summary>
    public static class TaskEndpoints
    {
        // This is an "extension method" that we can call from Program.cs
        public static void MapTaskEndpoints(this IEndpointRouteBuilder app)
        {
            // Group all task endpoints under "/api/tasks" and tag them for Swagger
            var taskGroup = app.MapGroup("/api/tasks")
                               .WithTags("Tasks");

            // GET /api/tasks  (Read all tasks)
            taskGroup.MapGet("/", (ITaskService service) =>
            {
                return Results.Ok(service.GetAllTasks());
            });

            // POST /api/tasks  (Create a new task)
            taskGroup.MapPost("/", (TaskRequest request, ITaskService service) =>
            {
                if (string.IsNullOrWhiteSpace(request.Description))
                {
                    return Results.BadRequest("Description cannot be empty.");
                }
                var task = service.AddTask(request.Description);
                return Results.Created($"/api/tasks/{task.Id}", task); // Return 201 Created
            });

            // PUT /api/tasks/{id}  (Update a task - for toggling completion)
            taskGroup.MapPut("/{id}", (Guid id, ITaskService service) =>
            {
                var success = service.ToggleTaskCompletion(id);
                if (!success)
                {
                    return Results.NotFound("Task not found.");
                }
                return Results.NoContent(); // Return 204 No Content (success)
            });

            // DELETE /api/tasks/{id}  (Delete a task)
            taskGroup.MapDelete("/{id}", (Guid id, ITaskService service) =>
            {
                var success = service.DeleteTask(id);
                if (!success)
                {
                    return Results.NotFound("Task not found.");
                }
                return Results.NoContent(); // Return 204 No Content (success)
            });
        }
    }
}
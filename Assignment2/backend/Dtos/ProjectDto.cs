namespace MiniProjectManager.Dtos
{
    // This is what we send back to the user
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreationDate { get; set; }
        
        // --- NEW ---
        // When getting a single project, we'll include its tasks
        public List<TaskDto> Tasks { get; set; } = new();
    }
}

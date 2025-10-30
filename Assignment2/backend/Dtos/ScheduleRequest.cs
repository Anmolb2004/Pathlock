using System.Text.Json.Serialization;

namespace MiniProjectManager.Dtos
{
    // This is the main request body
    public class ScheduleRequest
    {
        [JsonPropertyName("tasks")]
        public List<ScheduleTaskRequest> Tasks { get; set; } = new();
    }

    // This is the DTO for a single task within the request
    public class ScheduleTaskRequest
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("estimatedHours")]
        public double EstimatedHours { get; set; }

        [JsonPropertyName("dueDate")]
        public DateTime? DueDate { get; set; }
        
        [JsonPropertyName("dependencies")]
        public List<string> Dependencies { get; set; } = new();
    }
}
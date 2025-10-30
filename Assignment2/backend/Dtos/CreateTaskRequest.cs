using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Dtos
{
    // User sends this to create a task
    public class CreateTaskRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
    }
}

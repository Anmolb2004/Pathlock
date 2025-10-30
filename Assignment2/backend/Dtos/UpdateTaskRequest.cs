using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Dtos
{
    // User sends this to update a task
    public class UpdateTaskRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
    }
}
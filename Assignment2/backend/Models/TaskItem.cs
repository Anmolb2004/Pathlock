using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool CompletionStatus { get; set; }

        // Foreign Key for Project
        public Guid ProjectId { get; set; }
        // Navigation Property: Belongs to ONE Project
        public Project? Project { get; set; }
    }
}


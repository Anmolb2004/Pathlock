using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models
{
    public class Project
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public DateTime CreationDate { get; set; }

        // Foreign Key for User
        public Guid UserId { get; set; }
        // Navigation Property: Belongs to ONE User
        public User? User { get; set; }

        // Navigation Property: One Project has MANY Tasks
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}

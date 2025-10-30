using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation Property: One User has MANY Projects
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}

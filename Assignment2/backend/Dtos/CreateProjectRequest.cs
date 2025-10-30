using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Dtos
{
    // This is what the user sends to create a project
    public class CreateProjectRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }
}

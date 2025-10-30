namespace BasicTaskManager.Models
{
    /// <summary>
    /// A "Data Transfer Object" (DTO) for the POST request.
    /// Using a DTO is good practice.
    /// </summary>
    public record TaskRequest(string Description);
}

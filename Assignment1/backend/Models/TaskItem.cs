namespace BasicTaskManager.Models
{
    /// <summary>
    /// The TaskItem model as required by the assignment [cite: 16-20].
    /// We put it in its own file in the Models folder.
    /// </summary>
    public class TaskItem
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
    }
}

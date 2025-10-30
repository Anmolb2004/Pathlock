using System.Text.Json.Serialization;

namespace MiniProjectManager.Dtos
{
    public class ScheduleResponse
    {
        [JsonPropertyName("recommendedOrder")]
        public List<string> RecommendedOrder { get; set; } = new();
    }
}

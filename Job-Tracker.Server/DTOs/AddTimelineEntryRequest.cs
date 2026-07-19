using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DTOs
{
    public class AddTimelineEntryRequest
    {
        public TimelineEventType EventType { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? OccurredAt { get; set; }
    }
}

namespace Job_Tracker.Server.Models
{
    public class TimelineEntry
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public Application? Application { get; set; }

        public TimelineEventType EventType { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime OccurredAt { get; set; }
        public DateTime CreatedAt { get; set; }
 
    }
}

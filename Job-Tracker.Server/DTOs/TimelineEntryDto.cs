namespace Job_Tracker.Server.DTOs
{
    public class TimelineEntryDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime OccurredAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

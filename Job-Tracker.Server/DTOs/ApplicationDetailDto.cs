namespace Job_Tracker.Server.DTOs
{
    public class ApplicationDetailDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string? JobPostingUrl { get; set; }
        public string? Location { get; set; }
        public string Stage { get; set; } = string.Empty;
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? Notes { get; set; }
        public DateTime? AppliedOn { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<ContactDto> Contacts { get; set; } = new List<ContactDto>();
        public List<TaskDto> Tasks { get; set; } = new List<TaskDto>();
        public List<TimelineEntryDto> TimelineEntries { get; set; } = new List<TimelineEntryDto>();
        public List<DocumentDto> Documents { get; set; } = new List<DocumentDto>();
    }
}

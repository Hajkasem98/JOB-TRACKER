namespace Job_Tracker.Server.Models
{
    public class Application
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public string CompanyName { get; set; } = string.Empty;   
        public string JobTitle { get; set; } = string.Empty;
        public string? JobPostingUrl { get; set; }
        public string? Location { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? Notes { get; set; }
        public ApplicationStage Stage { get; set; }
        public DateTime? AppliedOn { get; set; }    // DateTime is a structure used to represent dates and times
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        /*
        ICollection<T> is a generic interface from the .NET standard library. 
        It represents a group of items of type T that you can add to, remove from, and count.
        */
        public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
        public ICollection<JobTask> Tasks { get; set; } = new List<JobTask>();
        public ICollection<TimelineEntry> TimelineEntries { get; set; } = new List<TimelineEntry>();
        public ICollection<Document> Documents { get; set; } = new List<Document>();
       }
}

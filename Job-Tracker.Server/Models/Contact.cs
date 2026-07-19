namespace Job_Tracker.Server.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public Application? Application { get; set; }

        public string Name { get; set; } = string.Empty;
        public string? Role { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

namespace Job_Tracker.Server.DTOs
{
    public class CreateContactRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Role { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? Notes { get; set; }
    }
}

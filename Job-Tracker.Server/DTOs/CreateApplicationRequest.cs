namespace Job_Tracker.Server.DTOs
{
    public class CreateApplicationRequest
    {
        public string CompanyName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string? JobPostingUrl { get; set; }
        public string? Location { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? Notes { get; set; }
        public DateTime? AppliedOn { get; set; }
    }
}

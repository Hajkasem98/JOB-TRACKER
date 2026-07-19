namespace Job_Tracker.Server.DTOs
{
    public class ApiError
    {
        public string Message { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public List<string>? Errors { get; set; }
        public string? TraceId { get; set; }
    }
}

namespace Job_Tracker.Server.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalApplications { get; set; }
        public int ActiveApplications { get; set; }
        public int OffersReceived { get; set; }
        public int RejectionCount { get; set; }
        public Dictionary<string, int> ApplicationsByStage { get; set; } = new Dictionary<string, int>();
        public int UpcomingTasksCount { get; set; }
    }
}

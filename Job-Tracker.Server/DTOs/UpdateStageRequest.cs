using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DTOs
{
    public class UpdateStageRequest
    {
        public ApplicationStage Stage { get; set; }
        public string? Note { get; set; }
    }
}

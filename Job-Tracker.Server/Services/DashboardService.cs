using Job_Tracker.Server.DAL.Interfaces;
using Job_Tracker.Server.DTOs;
using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.Services
{
    public class DashboardService
    {
        private static readonly ApplicationStage[] ActiveStages =
        {
            ApplicationStage.Saved,
            ApplicationStage.Applied,
            ApplicationStage.PhoneScreen,
            ApplicationStage.Interviewing
        };

        private readonly IApplicationRepository _applicationRepository;
        private readonly ITaskRepository _taskRepository;

        public DashboardService(IApplicationRepository applicationRepository, ITaskRepository taskRepository)
        {
            _applicationRepository = applicationRepository;
            _taskRepository = taskRepository;
        }

        public async Task<DashboardStatsDto> GetStatsAsync(int userId)
        {
            var applications = (await _applicationRepository.GetAllByUserIdAsync(userId)).ToList();
            var upcomingTasks = await _taskRepository.GetUpcomingByUserIdAsync(userId, 7);

            return new DashboardStatsDto
            {
                TotalApplications = applications.Count,
                ActiveApplications = applications.Count(a => ActiveStages.Contains(a.Stage)),
                OffersReceived = applications.Count(a => a.Stage == ApplicationStage.OfferReceived || a.Stage == ApplicationStage.Accepted),
                RejectionCount = applications.Count(a => a.Stage == ApplicationStage.Rejected),
                ApplicationsByStage = applications
                    .GroupBy(a => a.Stage.ToString())
                    .ToDictionary(g => g.Key, g => g.Count()),
                UpcomingTasksCount = upcomingTasks.Count()
            };
        }
    }
}

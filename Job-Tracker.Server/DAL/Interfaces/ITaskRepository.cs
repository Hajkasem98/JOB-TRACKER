using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DAL.Interfaces
{
    public interface ITaskRepository
    {
        Task<IEnumerable<JobTask>> GetByApplicationIdAsync(int applicationId);
        Task<IEnumerable<JobTask>> GetUpcomingByUserIdAsync(int userId, int withinDays);
        Task<JobTask?> GetByIdAsync(int id);
        Task<JobTask> AddAsync(JobTask task);
        Task UpdateAsync(JobTask task);
        Task DeleteAsync(int id);
    }
}

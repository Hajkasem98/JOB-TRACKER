using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DAL.Interfaces
{
    public interface ITimelineRepository
    {
        Task<IEnumerable<TimelineEntry>> GetByApplicationIdAsync(int applicationId);
        Task<TimelineEntry?> GetByIdAsync(int id);
        Task<TimelineEntry> AddAsync(TimelineEntry entry);
        Task DeleteAsync(int id);
    }
}

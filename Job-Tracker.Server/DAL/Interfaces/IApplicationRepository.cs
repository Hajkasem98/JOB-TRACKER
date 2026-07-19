using Job_Tracker.Server.Models;
using Job_Tracker.Server.DTOs;

namespace Job_Tracker.Server.DAL.Interfaces
{
    public interface IApplicationRepository
    {
        Task<PagedResult<Application>> GetByUserIdAsync(int userId, int page, int pageSize);    // generic type inside a generic type
        Task<IEnumerable<Application>> GetAllByUserIdAsync(int userId);
        Task<Application?> GetByIdAsync(int id);
        Task<Application?> GetByIdWithDetailsAsync(int id);
        Task<Application> AddAsync(Application application);
        Task UpdateAsync(Application application);
        Task DeleteAsync(int id);
    }
}

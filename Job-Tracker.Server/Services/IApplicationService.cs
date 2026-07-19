using Job_Tracker.Server.DTOs;

namespace Job_Tracker.Server.Services
{
    public interface IApplicationService
    {
        Task<PagedResult<ApplicationDto>> GetApplicationsAsync(int userId, int page, int pageSize);
        Task<ApplicationDetailDto?> GetApplicationDetailAsync(int userId, int applicationId);
        Task<ApplicationDto> CreateApplicationAsync(int userId, CreateApplicationRequest request);
        Task<ApplicationDto?> UpdateApplicationAsync(int userId, int applicationId, UpdateApplicationRequest request);
        Task<bool> DeleteApplicationAsync(int userId, int applicationId);
        Task<ApplicationDto?> UpdateStageAsync(int userId, int applicationId, UpdateStageRequest request);
    }
}

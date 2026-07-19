using Job_Tracker.Server.DAL.Interfaces;
using Job_Tracker.Server.DTOs;
using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly ITimelineRepository _timelineRepository;

        public ApplicationService(IApplicationRepository applicationRepository, ITimelineRepository timelineRepository)
        {
            _applicationRepository = applicationRepository;
            _timelineRepository = timelineRepository;
        }

        public async Task<PagedResult<ApplicationDto>> GetApplicationsAsync(int userId, int page, int pageSize)
        {
            var result = await _applicationRepository.GetByUserIdAsync(userId, page, pageSize);

            return new PagedResult<ApplicationDto>
            {
                Items = result.Items.Select(MapToDto).ToList(),
                TotalCount = result.TotalCount,
                Page = result.Page,
                PageSize = result.PageSize
            };
        }

        public async Task<ApplicationDetailDto?> GetApplicationDetailAsync(int userId, int applicationId)
        {
            var application = await _applicationRepository.GetByIdWithDetailsAsync(applicationId);
            if (application == null || application.UserId != userId)
            {
                return null;
            }

            return MapToDetailDto(application);
        }

        public async Task<ApplicationDto> CreateApplicationAsync(int userId, CreateApplicationRequest request)
        {
            var now = DateTime.UtcNow;
            var application = new Application
            {
                UserId = userId,
                CompanyName = request.CompanyName,
                JobTitle = request.JobTitle,
                JobPostingUrl = request.JobPostingUrl,
                Location = request.Location,
                SalaryMin = request.SalaryMin,
                SalaryMax = request.SalaryMax,
                Notes = request.Notes,
                AppliedOn = request.AppliedOn,
                Stage = ApplicationStage.Saved,
                CreatedAt = now,
                UpdatedAt = now
            };

            await _applicationRepository.AddAsync(application);
            return MapToDto(application);
        }

        public async Task<ApplicationDto?> UpdateApplicationAsync(int userId, int applicationId, UpdateApplicationRequest request)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null || application.UserId != userId)
            {
                return null;
            }

            application.CompanyName = request.CompanyName;
            application.JobTitle = request.JobTitle;
            application.JobPostingUrl = request.JobPostingUrl;
            application.Location = request.Location;
            application.SalaryMin = request.SalaryMin;
            application.SalaryMax = request.SalaryMax;
            application.Notes = request.Notes;
            application.AppliedOn = request.AppliedOn;
            application.UpdatedAt = DateTime.UtcNow;

            await _applicationRepository.UpdateAsync(application);
            return MapToDto(application);
        }

        public async Task<bool> DeleteApplicationAsync(int userId, int applicationId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null || application.UserId != userId)
            {
                return false;
            }

            await _applicationRepository.DeleteAsync(applicationId);
            return true;
        }

        public async Task<ApplicationDto?> UpdateStageAsync(int userId, int applicationId, UpdateStageRequest request)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null || application.UserId != userId)
            {
                return null;
            }

            if (application.Stage != request.Stage)
            {
                application.Stage = request.Stage;
                application.UpdatedAt = DateTime.UtcNow;
                await _applicationRepository.UpdateAsync(application);

                await _timelineRepository.AddAsync(new TimelineEntry
                {
                    ApplicationId = applicationId,
                    EventType = TimelineEventType.StageChange,
                    Title = $"Stage changed to {request.Stage}",
                    Description = request.Note,
                    OccurredAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                });
            }

            return MapToDto(application);
        }

        private static ApplicationDto MapToDto(Application a) => new ApplicationDto
        {
            Id = a.Id,
            CompanyName = a.CompanyName,
            JobTitle = a.JobTitle,
            JobPostingUrl = a.JobPostingUrl,
            Location = a.Location,
            Stage = a.Stage.ToString(),
            SalaryMin = a.SalaryMin,
            SalaryMax = a.SalaryMax,
            AppliedOn = a.AppliedOn,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        };

        private static ApplicationDetailDto MapToDetailDto(Application a) => new ApplicationDetailDto
        {
            Id = a.Id,
            CompanyName = a.CompanyName,
            JobTitle = a.JobTitle,
            JobPostingUrl = a.JobPostingUrl,
            Location = a.Location,
            Stage = a.Stage.ToString(),
            SalaryMin = a.SalaryMin,
            SalaryMax = a.SalaryMax,
            Notes = a.Notes,
            AppliedOn = a.AppliedOn,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt,
            Contacts = a.Contacts.Select(c => new ContactDto
            {
                Id = c.Id,
                ApplicationId = c.ApplicationId,
                Name = c.Name,
                Role = c.Role,
                Email = c.Email,
                Phone = c.Phone,
                LinkedInUrl = c.LinkedInUrl,
                Notes = c.Notes,
                CreatedAt = c.CreatedAt
            }).ToList(),
            Tasks = a.Tasks.Select(t => new TaskDto
            {
                Id = t.Id,
                ApplicationId = t.ApplicationId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt,
                CompletedAt = t.CompletedAt
            }).ToList(),
            TimelineEntries = a.TimelineEntries.Select(te => new TimelineEntryDto
            {
                Id = te.Id,
                ApplicationId = te.ApplicationId,
                EventType = te.EventType.ToString(),
                Title = te.Title,
                Description = te.Description,
                OccurredAt = te.OccurredAt,
                CreatedAt = te.CreatedAt
            }).ToList(),
            Documents = a.Documents.Select(d => new DocumentDto
            {
                Id = d.Id,
                ApplicationId = d.ApplicationId,
                FileName = d.FileName,
                FileType = d.FileType.ToString(),
                ContentType = d.ContentType,
                FileSizeBytes = d.FileSizeBytes,
                UploadedAt = d.UploadedAt
            }).ToList()
        };
    }
}

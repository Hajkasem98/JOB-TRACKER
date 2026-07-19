using System.Security.Claims;
using Job_Tracker.Server.DAL.Interfaces;
using Job_Tracker.Server.DTOs;
using Job_Tracker.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Job_Tracker.Server.Controllers
{
    [ApiController]
    [Authorize]
    public class TimelineController : ControllerBase
    {
        private readonly ITimelineRepository _timelineRepository;
        private readonly IApplicationRepository _applicationRepository;

        public TimelineController(ITimelineRepository timelineRepository, IApplicationRepository applicationRepository)
        {
            _timelineRepository = timelineRepository;
            _applicationRepository = applicationRepository;
        }

        private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private async Task<bool> UserOwnsApplicationAsync(int applicationId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            return application != null && application.UserId == GetCurrentUserId();
        }

        [HttpGet("api/applications/{applicationId:int}/timeline")]
        public async Task<ActionResult<List<TimelineEntryDto>>> GetTimeline(int applicationId)
        {
            if (!await UserOwnsApplicationAsync(applicationId))
            {
                return NotFound();
            }

            var entries = await _timelineRepository.GetByApplicationIdAsync(applicationId);
            return Ok(entries.Select(MapToDto).ToList());
        }

        [HttpPost("api/applications/{applicationId:int}/timeline")]
        public async Task<ActionResult<TimelineEntryDto>> AddTimelineEntry(int applicationId, AddTimelineEntryRequest request)
        {
            if (!await UserOwnsApplicationAsync(applicationId))
            {
                return NotFound();
            }

            var entry = new TimelineEntry
            {
                ApplicationId = applicationId,
                EventType = request.EventType,
                Title = request.Title,
                Description = request.Description,
                OccurredAt = request.OccurredAt ?? DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await _timelineRepository.AddAsync(entry);
            return StatusCode(StatusCodes.Status201Created, MapToDto(entry));
        }

        [HttpDelete("api/timeline/{id:int}")]
        public async Task<IActionResult> DeleteTimelineEntry(int id)
        {
            var entry = await _timelineRepository.GetByIdAsync(id);
            if (entry == null || !await UserOwnsApplicationAsync(entry.ApplicationId))
            {
                return NotFound();
            }

            await _timelineRepository.DeleteAsync(id);
            return NoContent();
        }

        private static TimelineEntryDto MapToDto(TimelineEntry te) => new TimelineEntryDto
        {
            Id = te.Id,
            ApplicationId = te.ApplicationId,
            EventType = te.EventType.ToString(),
            Title = te.Title,
            Description = te.Description,
            OccurredAt = te.OccurredAt,
            CreatedAt = te.CreatedAt
        };
    }
}

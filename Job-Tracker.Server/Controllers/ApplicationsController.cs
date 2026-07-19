using System.Security.Claims;
using Job_Tracker.Server.DTOs;
using Job_Tracker.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Job_Tracker.Server.Controllers
{
    [ApiController]
    [Route("api/applications")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<PagedResult<ApplicationDto>>> GetApplications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _applicationService.GetApplicationsAsync(GetCurrentUserId(), page, pageSize);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApplicationDetailDto>> GetApplication(int id)
        {
            var application = await _applicationService.GetApplicationDetailAsync(GetCurrentUserId(), id);
            if (application == null)
            {
                return NotFound();
            }

            return Ok(application);
        }

        [HttpPost]
        public async Task<ActionResult<ApplicationDto>> CreateApplication(CreateApplicationRequest request)
        {
            var created = await _applicationService.CreateApplicationAsync(GetCurrentUserId(), request);
            return CreatedAtAction(nameof(GetApplication), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApplicationDto>> UpdateApplication(int id, UpdateApplicationRequest request)
        {
            var updated = await _applicationService.UpdateApplicationAsync(GetCurrentUserId(), id, request);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var deleted = await _applicationService.DeleteApplicationAsync(GetCurrentUserId(), id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPatch("{id:int}/stage")]
        public async Task<ActionResult<ApplicationDto>> UpdateStage(int id, UpdateStageRequest request)
        {
            var updated = await _applicationService.UpdateStageAsync(GetCurrentUserId(), id, request);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }
    }
}

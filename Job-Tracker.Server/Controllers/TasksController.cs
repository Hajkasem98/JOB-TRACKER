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
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IApplicationRepository _applicationRepository;

        public TasksController(ITaskRepository taskRepository, IApplicationRepository applicationRepository)
        {
            _taskRepository = taskRepository;
            _applicationRepository = applicationRepository;
        }

        private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private async Task<bool> UserOwnsApplicationAsync(int applicationId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            return application != null && application.UserId == GetCurrentUserId();
        }

        [HttpGet("api/applications/{applicationId:int}/tasks")]
        public async Task<ActionResult<List<TaskDto>>> GetTasks(int applicationId)
        {
            if (!await UserOwnsApplicationAsync(applicationId))
            {
                return NotFound();
            }

            var tasks = await _taskRepository.GetByApplicationIdAsync(applicationId);
            return Ok(tasks.Select(MapToDto).ToList());
        }

        [HttpGet("api/tasks/upcoming")]
        public async Task<ActionResult<List<TaskDto>>> GetUpcoming([FromQuery] int withinDays = 7)
        {
            var tasks = await _taskRepository.GetUpcomingByUserIdAsync(GetCurrentUserId(), withinDays);
            return Ok(tasks.Select(MapToDto).ToList());
        }

        [HttpPost("api/applications/{applicationId:int}/tasks")]
        public async Task<ActionResult<TaskDto>> CreateTask(int applicationId, CreateTaskRequest request)
        {
            if (!await UserOwnsApplicationAsync(applicationId))
            {
                return NotFound();
            }

            var task = new JobTask
            {
                ApplicationId = applicationId,
                Title = request.Title,
                Description = request.Description,
                DueDate = request.DueDate,
                CreatedAt = DateTime.UtcNow
            };

            await _taskRepository.AddAsync(task);
            return StatusCode(StatusCodes.Status201Created, MapToDto(task));
        }

        [HttpPut("api/tasks/{id:int}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int id, CreateTaskRequest request)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null || !await UserOwnsApplicationAsync(task.ApplicationId))
            {
                return NotFound();
            }

            task.Title = request.Title;
            task.Description = request.Description;
            task.DueDate = request.DueDate;

            await _taskRepository.UpdateAsync(task);
            return Ok(MapToDto(task));
        }

        [HttpPatch("api/tasks/{id:int}/complete")]
        public async Task<ActionResult<TaskDto>> CompleteTask(int id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null || !await UserOwnsApplicationAsync(task.ApplicationId))
            {
                return NotFound();
            }

            task.IsCompleted = true;
            task.CompletedAt = DateTime.UtcNow;

            await _taskRepository.UpdateAsync(task);
            return Ok(MapToDto(task));
        }

        [HttpDelete("api/tasks/{id:int}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null || !await UserOwnsApplicationAsync(task.ApplicationId))
            {
                return NotFound();
            }

            await _taskRepository.DeleteAsync(id);
            return NoContent();
        }

        private static TaskDto MapToDto(JobTask t) => new TaskDto
        {
            Id = t.Id,
            ApplicationId = t.ApplicationId,
            Title = t.Title,
            Description = t.Description,
            DueDate = t.DueDate,
            IsCompleted = t.IsCompleted,
            CreatedAt = t.CreatedAt,
            CompletedAt = t.CompletedAt
        };
    }
}

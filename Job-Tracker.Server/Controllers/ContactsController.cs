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
    public class ContactsController : ControllerBase
    {
        private readonly IContactRepository _contactRepository;
        private readonly IApplicationRepository _applicationRepository;

        public ContactsController(IContactRepository contactRepository, IApplicationRepository applicationRepository)
        {
            _contactRepository = contactRepository;
            _applicationRepository = applicationRepository;
        }

        private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private async Task<bool> UserOwnsApplicationAsync(int applicationId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            return application != null && application.UserId == GetCurrentUserId();
        }

        [HttpGet("api/applications/{applicationId:int}/contacts")]
        public async Task<ActionResult<List<ContactDto>>> GetContacts(int applicationId)
        {
            if (!await UserOwnsApplicationAsync(applicationId))
            {
                return NotFound();
            }

            var contacts = await _contactRepository.GetByApplicationIdAsync(applicationId);
            return Ok(contacts.Select(MapToDto).ToList());
        }

        [HttpPost("api/applications/{applicationId:int}/contacts")]
        public async Task<ActionResult<ContactDto>> CreateContact(int applicationId, CreateContactRequest request)
        {
            if (!await UserOwnsApplicationAsync(applicationId))
            {
                return NotFound();
            }

            var contact = new Contact
            {
                ApplicationId = applicationId,
                Name = request.Name,
                Role = request.Role,
                Email = request.Email,
                Phone = request.Phone,
                LinkedInUrl = request.LinkedInUrl,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow
            };

            await _contactRepository.AddAsync(contact);
            return StatusCode(StatusCodes.Status201Created, MapToDto(contact));
        }

        [HttpPut("api/contacts/{id:int}")]
        public async Task<ActionResult<ContactDto>> UpdateContact(int id, CreateContactRequest request)
        {
            var contact = await _contactRepository.GetByIdAsync(id);
            if (contact == null || !await UserOwnsApplicationAsync(contact.ApplicationId))
            {
                return NotFound();
            }

            contact.Name = request.Name;
            contact.Role = request.Role;
            contact.Email = request.Email;
            contact.Phone = request.Phone;
            contact.LinkedInUrl = request.LinkedInUrl;
            contact.Notes = request.Notes;

            await _contactRepository.UpdateAsync(contact);
            return Ok(MapToDto(contact));
        }

        [HttpDelete("api/contacts/{id:int}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _contactRepository.GetByIdAsync(id);
            if (contact == null || !await UserOwnsApplicationAsync(contact.ApplicationId))
            {
                return NotFound();
            }

            await _contactRepository.DeleteAsync(id);
            return NoContent();
        }

        private static ContactDto MapToDto(Contact c) => new ContactDto
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
        };
    }
}

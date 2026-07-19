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
    public class DocumentsController : ControllerBase
    {
        private static readonly string[] AllowedExtensions = { ".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg" };
        private const long MaxFileSizeBytes = 10_000_000;

        private readonly IDocumentRepository _documentRepository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IWebHostEnvironment _environment;

        public DocumentsController(IDocumentRepository documentRepository, IApplicationRepository applicationRepository, IWebHostEnvironment environment)
        {
            _documentRepository = documentRepository;
            _applicationRepository = applicationRepository;
            _environment = environment;
        }

        private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private async Task<bool> UserOwnsApplicationAsync(int applicationId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            return application != null && application.UserId == GetCurrentUserId();
        }

        private string UploadsRoot => Path.Combine(_environment.ContentRootPath, "Uploads");

        [HttpGet("api/applications/{applicationId:int}/documents")]
        public async Task<ActionResult<List<DocumentDto>>> GetDocuments(int applicationId)
        {
            if (!await UserOwnsApplicationAsync(applicationId))
            {
                return NotFound();
            }

            var documents = await _documentRepository.GetByApplicationIdAsync(applicationId);
            return Ok(documents.Select(MapToDto).ToList());
        }

        [HttpPost("api/applications/{applicationId:int}/documents")]
        [RequestSizeLimit(MaxFileSizeBytes)]
        public async Task<ActionResult<DocumentDto>> UploadDocument(int applicationId, [FromForm] UploadDocumentRequest request)
        {
            if (!await UserOwnsApplicationAsync(applicationId))
            {
                return NotFound();
            }

            var file = request.File;
            if (file == null || file.Length == 0 || file.Length > MaxFileSizeBytes)
            {
                return BadRequest(new ApiError { Message = "File is empty or exceeds the 10MB limit.", StatusCode = StatusCodes.Status400BadRequest });
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                return BadRequest(new ApiError { Message = "File type is not allowed.", StatusCode = StatusCodes.Status400BadRequest });
            }

            var applicationFolder = Path.Combine(UploadsRoot, applicationId.ToString());
            Directory.CreateDirectory(applicationFolder);

            var relativePath = Path.Combine(applicationId.ToString(), $"{Guid.NewGuid()}{extension}");
            var fullPath = Path.Combine(UploadsRoot, relativePath);

            using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }

            var document = new Document
            {
                ApplicationId = applicationId,
                FileName = file.FileName,
                FileType = request.FileType,
                FilePath = relativePath,
                ContentType = file.ContentType,
                FileSizeBytes = file.Length,
                UploadedAt = DateTime.UtcNow
            };

            await _documentRepository.AddAsync(document);
            return StatusCode(StatusCodes.Status201Created, MapToDto(document));
        }

        [HttpGet("api/documents/{id:int}/download")]
        public async Task<IActionResult> DownloadDocument(int id)
        {
            var document = await _documentRepository.GetByIdAsync(id);
            if (document == null || !await UserOwnsApplicationAsync(document.ApplicationId))
            {
                return NotFound();
            }

            var fullPath = Path.Combine(UploadsRoot, document.FilePath);
            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound();
            }

            var stream = System.IO.File.OpenRead(fullPath);
            return File(stream, document.ContentType, document.FileName);
        }

        [HttpDelete("api/documents/{id:int}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            var document = await _documentRepository.GetByIdAsync(id);
            if (document == null || !await UserOwnsApplicationAsync(document.ApplicationId))
            {
                return NotFound();
            }

            var fullPath = Path.Combine(UploadsRoot, document.FilePath);
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }

            await _documentRepository.DeleteAsync(id);
            return NoContent();
        }

        private static DocumentDto MapToDto(Document d) => new DocumentDto
        {
            Id = d.Id,
            ApplicationId = d.ApplicationId,
            FileName = d.FileName,
            FileType = d.FileType.ToString(),
            ContentType = d.ContentType,
            FileSizeBytes = d.FileSizeBytes,
            UploadedAt = d.UploadedAt
        };
    }
}

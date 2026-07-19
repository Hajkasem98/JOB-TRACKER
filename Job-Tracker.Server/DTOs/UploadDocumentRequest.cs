using Microsoft.AspNetCore.Http;
using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DTOs
{
    public class UploadDocumentRequest
    {
        public IFormFile File { get; set; } = null!;
        public DocumentType FileType { get; set; }
    }
}

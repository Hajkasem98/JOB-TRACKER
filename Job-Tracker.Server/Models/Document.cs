namespace Job_Tracker.Server.Models
{
    public class Document
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public Application? Application { get; set; }

        public string FileName { get; set; } = string.Empty;
        public DocumentType FileType { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}

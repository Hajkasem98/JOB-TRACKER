using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DAL.Interfaces
{
    public interface IDocumentRepository
    {
        Task<IEnumerable<Document>> GetByApplicationIdAsync(int applicationId);
        Task<Document?> GetByIdAsync(int id);
        Task<Document> AddAsync(Document document);
        Task DeleteAsync(int id);
    }
}

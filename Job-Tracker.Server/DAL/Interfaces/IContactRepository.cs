using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DAL.Interfaces
{
    public interface IContactRepository
    {
        Task<IEnumerable<Contact>> GetByApplicationIdAsync(int applicationId);
        Task<Contact?> GetByIdAsync(int id);
        Task<Contact> AddAsync(Contact contact);
        Task UpdateAsync(Contact contact);
        Task DeleteAsync(int id);
    }
}

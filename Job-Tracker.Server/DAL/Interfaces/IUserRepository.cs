using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DAL.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<User> AddAsync(User user);
    }
}

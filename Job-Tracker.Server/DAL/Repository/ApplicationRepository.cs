using Microsoft.EntityFrameworkCore;
using Job_Tracker.Server.Data;
using Job_Tracker.Server.DAL.Interfaces;
using Job_Tracker.Server.DTOs;
using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DAL.Repository
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly AppDbContext _context;

        public ApplicationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Application>> GetByUserIdAsync(int userId, int page, int pageSize)
        {
            var query = _context.Applications.Where(a => a.UserId == userId);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(a => a.UpdatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Application>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<IEnumerable<Application>> GetAllByUserIdAsync(int userId)
        {
            return await _context.Applications
                .Where(a => a.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Application?> GetByIdAsync(int id)
        {
            return await _context.Applications.FindAsync(id);
        }

        public async Task<Application?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Applications
                .Include(a => a.Contacts)
                .Include(a => a.Tasks)
                .Include(a => a.TimelineEntries)
                .Include(a => a.Documents)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Application> AddAsync(Application application)
        {
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task UpdateAsync(Application application)
        {
            _context.Applications.Update(application);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application != null)
            {
                _context.Applications.Remove(application);
                await _context.SaveChangesAsync();
            }
        }
    }
}

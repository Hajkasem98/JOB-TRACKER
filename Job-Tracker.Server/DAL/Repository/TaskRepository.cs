using Microsoft.EntityFrameworkCore;
using Job_Tracker.Server.Data;
using Job_Tracker.Server.DAL.Interfaces;
using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DAL.Repository
{
    public class TaskRepository : ITaskRepository
    {
        private readonly AppDbContext _context;

        public TaskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<JobTask>> GetByApplicationIdAsync(int applicationId)
        {
            return await _context.Tasks
                .Where(t => t.ApplicationId == applicationId)
                .ToListAsync();
        }

        public async Task<IEnumerable<JobTask>> GetUpcomingByUserIdAsync(int userId, int withinDays)
        {
            var cutoff = DateTime.UtcNow.AddDays(withinDays);

            return await _context.Tasks
                .Include(t => t.Application)
                .Where(t => t.Application!.UserId == userId
                    && !t.IsCompleted
                    && t.DueDate != null
                    && t.DueDate <= cutoff)
                .OrderBy(t => t.DueDate)
                .ToListAsync();
        }

        public async Task<JobTask?> GetByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task<JobTask> AddAsync(JobTask task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task UpdateAsync(JobTask task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
        }
    }
}

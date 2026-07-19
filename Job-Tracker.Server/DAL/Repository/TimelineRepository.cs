using Microsoft.EntityFrameworkCore;
using Job_Tracker.Server.Data;
using Job_Tracker.Server.DAL.Interfaces;
using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.DAL.Repository
{
    public class TimelineRepository : ITimelineRepository
    {
        private readonly AppDbContext _context;

        public TimelineRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TimelineEntry>> GetByApplicationIdAsync(int applicationId)
        {
            return await _context.TimelineEntries
                .Where(t => t.ApplicationId == applicationId)
                .OrderByDescending(t => t.OccurredAt)
                .ToListAsync();
        }

        public async Task<TimelineEntry?> GetByIdAsync(int id)
        {
            return await _context.TimelineEntries.FindAsync(id);
        }

        public async Task<TimelineEntry> AddAsync(TimelineEntry entry)
        {
            _context.TimelineEntries.Add(entry);
            await _context.SaveChangesAsync();
            return entry;
        }

        public async Task DeleteAsync(int id)
        {
            var entry = await _context.TimelineEntries.FindAsync(id);
            if (entry != null)
            {
                _context.TimelineEntries.Remove(entry);
                await _context.SaveChangesAsync();
            }
        }
    }
}

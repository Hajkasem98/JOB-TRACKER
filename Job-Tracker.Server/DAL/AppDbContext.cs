using Microsoft.EntityFrameworkCore;
using Job_Tracker.Server.Models;

namespace Job_Tracker.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users => Set<User>();
        public DbSet<Application> Applications => Set<Application>();
        public DbSet<Contact> Contacts => Set<Contact>();
        public DbSet<JobTask> Tasks => Set<JobTask>();
        public DbSet<TimelineEntry> TimelineEntries => Set<TimelineEntry>();
        public DbSet<Document> Documents => Set<Document>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Application>()
                .Property(a => a.Stage)
                .HasConversion<string>();

            modelBuilder.Entity<Application>()
                .Property(a => a.SalaryMin)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Application>()
                .Property(a => a.SalaryMax)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Contact>()
                .HasOne(c => c.Application)
                .WithMany(a => a.Contacts)
                .HasForeignKey(c => c.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobTask>()
                .HasOne(t => t.Application)
                .WithMany(a => a.Tasks)
                .HasForeignKey(t => t.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.EventType)
                .HasConversion<string>();

            modelBuilder.Entity<TimelineEntry>()
                .HasOne(t => t.Application)
                .WithMany(a => a.TimelineEntries)
                .HasForeignKey(t => t.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Document>()
                .Property(d => d.FileType)
                .HasConversion<string>();

            modelBuilder.Entity<Document>()
                .HasOne(d => d.Application)
                .WithMany(a => a.Documents)
                .HasForeignKey(d => d.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

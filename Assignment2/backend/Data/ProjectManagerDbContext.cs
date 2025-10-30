using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Models;

namespace MiniProjectManager.Data
{
    public class ProjectManagerDbContext : DbContext
    {
        public ProjectManagerDbContext(DbContextOptions<ProjectManagerDbContext> options)
            : base(options)
        {
        }

        // Define the tables
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the User -> Project relationship
            modelBuilder.Entity<User>()
                .HasMany(u => u.Projects)      // A User has many Projects
                .WithOne(p => p.User)          // A Project has one User
                .HasForeignKey(p => p.UserId)  // The foreign key is Project.UserId
                .OnDelete(DeleteBehavior.Cascade); // If User is deleted, delete their Projects

            // Configure the Project -> TaskItem relationship
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Tasks)         // A Project has many Tasks
                .WithOne(t => t.Project)       // A Task has one Project
                .HasForeignKey(t => t.ProjectId) // The foreign key is Task.ProjectId
                .OnDelete(DeleteBehavior.Cascade); // If Project is deleted, delete its Tasks
        }
    }
}

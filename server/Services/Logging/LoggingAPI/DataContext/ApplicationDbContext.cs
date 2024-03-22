using LoggingAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ProductsAPI.Service.DataContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<LogEntry> LogEntries { get; set; }
    }
}

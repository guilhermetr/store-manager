using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsAPI.Service.DataContext;
using LoggingAPI.Models;

namespace LoggingService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogEntry>>> GetLogs()
        {
            return await _context.LogEntries.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<LogEntry>> LogMessage(LogEntry logEntry)
        {
            _context.LogEntries.Add(logEntry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLogs), new { id = logEntry.Id }, logEntry);
        }
    }
}

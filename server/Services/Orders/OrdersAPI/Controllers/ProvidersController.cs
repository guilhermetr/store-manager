using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrdersAPI.Service.Dtos;
using OrdersAPI.Service.DataContext;
using OrdersAPI.Service.Services;

namespace OrdersAPI.Service.Controllers
{
    [TypeFilter(typeof(TokenAuthorizationFilter))]
    [ApiController]
    [Route("[controller]")]
    public class ProvidersController
    {
        private readonly ApplicationDbContext _context;

        public ProvidersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProviderDto>>> GetProviders()
        {
            var providers = await _context.Providers
                .Select(p => p.ToDto())
                .ToListAsync();

            return providers;
        }
    }
}

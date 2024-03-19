using OrdersAPI.Service.Models;
using ProductsAPI.Service.DataContext;

namespace OrdersAPI.Service
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _context;

        public DatabaseSeeder(ApplicationDbContext context)
        {
            _context = context;
        }

        public void SeedProviders()
        {
            if (!_context.Providers.Any())
            {
                _context.Providers.AddRange(
                    new Provider { Name = "Fornecedor 1" },
                    new Provider { Name = "Fornecedor 2" },
                    new Provider { Name = "Fornecedor 3" },
                    new Provider { Name = "Fornecedor 4" },
                    new Provider { Name = "Fornecedor 5" }
                );

                _context.SaveChanges();
            }
        }
    }

}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsAPI.Service.DataContext;
using ProductsAPI.Service.Dtos;
using ProductsAPI.Service.Models;
using Common.Services;


namespace ProductsAPI.Service.Controllers
{
    [TypeFilter(typeof(TokenAuthorizationFilter))]
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly LoggingService _loggingService;

        public ProductsController(ApplicationDbContext context, LoggingService loggingService)
        {
            _context = context;
            _loggingService = loggingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _context.Products
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    IsActive = p.IsActive,
                })
                .ToListAsync();

            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                IsActive = product.IsActive,
            };

            return productDto;
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> PostProduct(ProductDto productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price,
                IsActive = true,
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            productDto.Id = product.Id;

            await _loggingService.LogMessageAsync($"Produto criado com ID {product.Id}");

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDto productDto)
        {
            if (id != productDto.Id)
            {
                await _loggingService.LogMessageAsync($"Falha ao atualizar produto: ID inválido: {id}");
                return BadRequest();
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                await _loggingService.LogMessageAsync($"Falha ao atualizar produto: Produto com ID {id} não encontrado");
                return NotFound();
            }

            if (!product.IsActive && !productDto.IsActive)
            {
                await _loggingService.LogMessageAsync($"Falha ao atualizar produto: Produto com ID {id} está inativo e não pode ser atualizado");
                return BadRequest("O produto está inativo e não pode ser atualizado.");
            }

            product.Name = productDto.Name;
            product.Price = productDto.Price;
            product.IsActive = productDto.IsActive;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var productExists = _context.Products.Any(e => e.Id == id);
                if (!productExists)
                {
                    await _loggingService.LogMessageAsync($"Falha ao atualizar produto: Produto com ID {id} não encontrado");
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            await _loggingService.LogMessageAsync($"Produto com ID {product.Id} atualizado");

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                await _loggingService.LogMessageAsync($"Falha ao excluir produto: Produto com ID {id} não encontrado");
                return NotFound();
            }

            product.IsActive = false;
            
            await _context.SaveChangesAsync();

            await _loggingService.LogMessageAsync($"Produto com ID {id} excluido");

            return NoContent();
        }
        
    }

}

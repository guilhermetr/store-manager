using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsAPI.Service.DataContext;
using ProductsAPI.Service.Dtos;
using ProductsAPI.Service.Models;
using ProductsAPI.Service.Services;

namespace ProductsAPI.Service.Controllers
{
    [TypeFilter(typeof(TokenAuthorizationFilter))]
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .Select(o => o.ToDto())
                .ToListAsync();

            return orders;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order.ToDto();
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> PostOrder(OrderDto orderDto)
        {
            if (orderDto.OrderItems == null || orderDto.OrderItems.Count == 0)
            {
                return BadRequest("O pedido deve ter pelo menos 1 produto.");
            }

            var order = orderDto.ToOrder();

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            orderDto.Id = order.Id;

            var orderItemIds = order.OrderItems.Select(item => item.Id).ToList();            
            for (int i = 0; i < orderDto.OrderItems.Count; i++)
            {
                orderDto.OrderItems[i].Id = orderItemIds[i];
            }

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderDto orderDto)
        {
            if (id != orderDto.Id)
            {
                return BadRequest();
            }

            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
            {
                return NotFound();
            }

            if (order.Status == OrderStatus.Finished && orderDto.Status == OrderStatus.Finished)
            {
                return BadRequest("O pedido está finalizado e não pode ser atualizado.");
            }

            if (orderDto.OrderItems == null || orderDto.OrderItems.Count == 0)
            {
                return BadRequest("O pedido deve ter pelo menos 1 produto.");
            }

            order.Id = orderDto.Id;
            order.ProviderId = orderDto.ProviderId;
            order.OrderItems = orderDto.OrderItems.Select(item => new OrderItem
            {
                Id = item.Id,
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
            }).ToList();
            order.Comments = orderDto.Comments;
            order.Status = orderDto.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var orderExists = _context.Orders.Any(e => e.Id == id);
                if (!orderExists)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
    }

}

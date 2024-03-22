using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OrdersAPI.Service.Dtos;
using OrdersAPI.Service.Models;
using System.Net.Http.Headers;
using OrdersAPI.Service.DataContext;
using Common.Services;

namespace OrdersAPI.Service.Controllers
{
    [TypeFilter(typeof(TokenAuthorizationFilter))]
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly LoggingService _loggingService;
        private readonly HttpClient _httpClient;

        public OrdersController(ApplicationDbContext context, LoggingService loggingService, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _loggingService = loggingService;
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri("https://localhost:7046/");
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

        [HttpGet("finished-orders")]
        public async Task<ActionResult<IEnumerable<FinishedOrderDto>>> GetFinishedOrders()
        {
            var finishedOrders = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.Status == OrderStatus.Finished)
                .ToListAsync();

            var orderDtos = new List<FinishedOrderDto>();

            foreach (var order in finishedOrders)
            {
                var provider = _context.Providers.Find(order.ProviderId);
                var orderDto = order.ToFinishedOrderDto(provider.Name);
                orderDto.OrderItems = await GetOrderItemsAsync(order.OrderItems);
                orderDtos.Add(orderDto);
            }

            return orderDtos;
        }

        private async Task<List<FinishedOrderItemDto>> GetOrderItemsAsync(List<OrderItem> orderItems)
        {
            var orderItemDtos = new List<FinishedOrderItemDto>();

            var bearerToken = Request.Headers["Authorization"].FirstOrDefault();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);

            foreach (var orderItem in orderItems)
            {
                var productDto = await GetProductAsync(orderItem.ProductId);
                if (productDto != null)
                {
                    var orderItemDto = new FinishedOrderItemDto
                    {
                        Id = orderItem.Id,
                        ProductId = orderItem.ProductId,
                        ProductName = productDto.Name,
                        ProductPrice = productDto.Price,
                        Quantity = orderItem.Quantity
                    };
                    orderItemDtos.Add(orderItemDto);
                }
                else
                {
                    BadRequest($"Erro ao obter informações do item de pedido com ID {orderItem.Id}");
                }
            }

            return orderItemDtos;
        }

        private async Task<ProductDto> GetProductAsync(int productId)
        {
            var productResponse = await _httpClient.GetAsync($"products/{productId}");
            if (productResponse.IsSuccessStatusCode)
            {
                var productContent = await productResponse.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<ProductDto>(productContent)!;
            }
            return null;
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
                await _loggingService.LogMessageAsync("Falha ao criar pedido: O pedido deve ter pelo menos 1 produto.");
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

            await _loggingService.LogMessageAsync($"Pedido criado com ID {order.Id}");

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderDto orderDto)
        {
            if (id != orderDto.Id)
            {
                await _loggingService.LogMessageAsync($"Falha ao atualizar pedido: ID inválido: {id}");
                return BadRequest();
            }

            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
            {
                await _loggingService.LogMessageAsync($"Falha ao atualizar pedido: Pedido com ID {id} não encontrado");
                return NotFound();
            }

            if (order.Status == OrderStatus.Finished && orderDto.Status == OrderStatus.Finished)
            {
                await _loggingService.LogMessageAsync($"Falha ao atualizar pedido: Pedido com ID {id} está finalizado e não pode ser atualizado");
                return BadRequest("O pedido está finalizado e não pode ser atualizado.");
            }

            if (orderDto.OrderItems == null || orderDto.OrderItems.Count == 0)
            {
                await _loggingService.LogMessageAsync($"Falha ao atualizar pedido: O pedido deve ter pelo menos 1 produto.");
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
                    await _loggingService.LogMessageAsync($"Falha ao atualizar pedido: Pedido com ID {id} não encontrado");
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            await _loggingService.LogMessageAsync($"Pedido com ID {order.Id} atualizado");

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                await _loggingService.LogMessageAsync($"Falha ao excluir pedido: Pedido com ID {id} não encontrado");
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            await _loggingService.LogMessageAsync($"Pedido com ID {id} excluido");

            return NoContent();
        }
        
    }

}

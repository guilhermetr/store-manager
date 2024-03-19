using ProductsAPI.Service.Models;

namespace ProductsAPI.Service.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public List<OrderItemDto> OrderItems { get; set; }
        public string Comments { get; set; }
        public OrderStatus Status { get; set; }

        public Order ToOrder()
        {
            return new Order
            {
                Id = this.Id,
                ProviderId = this.ProviderId,
                OrderItems = this.OrderItems.Select(item => item.ToOrderItem()).ToList(),
                Comments = this.Comments,
                Status = this.Status
            };
        }
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public OrderItem ToOrderItem()
        {
            return new OrderItem
            {
                Id = this.Id,
                OrderId = this.OrderId,
                ProductId = this.ProductId,
                Quantity = this.Quantity,
            };
        }
    }
}

using ProductsAPI.Service.Dtos;

namespace ProductsAPI.Service.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public string Comments { get; set; }
        public OrderStatus Status { get; set; }

        public OrderDto ToDto()
        {
            return new OrderDto
            {
                Id = this.Id,
                ProviderId = this.ProviderId,
                OrderItems = this.OrderItems != null
                    ? this.OrderItems.Select(item => item.ToDto()).ToList()
                    : new List<OrderItemDto>(), 
                Comments = this.Comments,
                Status = this.Status
            };
        }
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public OrderItemDto ToDto()
        {
            return new OrderItemDto
            {
                Id = this.Id,
                OrderId = this.OrderId,
                ProductId = this.ProductId,
                Quantity = this.Quantity,
            };
        }
    }

    public enum OrderStatus {
        Active = 0,
        Finished = 1,
    }

}

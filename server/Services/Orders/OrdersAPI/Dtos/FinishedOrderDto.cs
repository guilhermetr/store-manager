namespace OrdersAPI.Service.Dtos
{
    public class FinishedOrderDto
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public List<FinishedOrderItemDto> OrderItems { get; set; }
        public string Comments { get; set; }
        public string CreatedBy { get; set; }
    }

    public class FinishedOrderItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }        
        public decimal TotalPrice => Quantity * ProductPrice;        
    }
}

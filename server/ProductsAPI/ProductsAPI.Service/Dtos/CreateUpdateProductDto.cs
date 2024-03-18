namespace ProductsAPI.Service.Dtos
{
    public class CreateUpdateProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }

    }
}

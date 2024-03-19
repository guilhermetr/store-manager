using OrdersAPI.Service.Dtos;

namespace OrdersAPI.Service.Models
{
    public class Provider
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ProviderDto ToDto()
        {
            return new ProviderDto
            {
                Id = this.Id,
                Name = this.Name,
            };
        }
    }
}

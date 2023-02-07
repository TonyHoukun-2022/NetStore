using API.Models.OrderAgrregate;

namespace API.DataTransferObjects
{
  public class CreateOrderDto
    {
        public bool SaveAddress { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        
    }
}
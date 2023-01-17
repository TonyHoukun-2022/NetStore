using System.Collections.Generic;

//DTO
namespace API.DataTransferObjects
{
  public class BasketDto
    {
      public int Id { get; set; }
      public string BuyerId { get; set; }
      public List<BasketItemDto> Items { get; set; }
    }
}
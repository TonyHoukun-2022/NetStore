using System.ComponentModel.DataAnnotations.Schema;
using API.Entities;

namespace API.Models
{
  //define table name
  [Table("BasketItems")]
  public class BasketItem
  {
    public int Id { get; set; }
    public int Quantity { get; set; }
    //navigation property
    //basketItem : product = 1:1
    public int ProductId { get; set; }
  
    public Product Product { get; set; }

    //fully defined relationship with Basket
    public int BasketId { get; set; }
    public Basket Basket { get; set; }
  }
}
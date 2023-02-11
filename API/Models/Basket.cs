using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using API.Entities;

namespace API.Models
{
  public class Basket
    {
        [Key]
        public int Id { get; set; }
        public string BuyerId { get; set; }
        //Basket : BasketItem = 1:many
        //navigation prop
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        //2 props for incoprate stripe
        public string PaymentIntentId { get; set; }

        public string ClientSecret { get; set; }

        public void AddItem(Product product, int quantity) 
        {
          // if product to be added is not in the basket items list,
          // push item to items 
          if (Items.All(item => item.ProductId != product.Id))
          {
            Items.Add(new BasketItem{
              //don't need to add Id and productId fields of BasketItem,
              //because Id is auto incremented, productId is auto known from product field
              Product = product,
              Quantity = quantity
            });
          }

          //product is already existed
          var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);

          if(existingItem != null) existingItem.Quantity += quantity;
        }

        public void RemoveItem(int productId, int quantity)
        {
          var item = Items.FirstOrDefault(item => item.ProductId == productId);
          if(item == null) return;
          //if item.quantity != 0
          item.Quantity -= quantity;
          if(item.Quantity == 0) Items.Remove(item);
        }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Models.OrderAgrregate
{
  public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        [Required]
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public List<OrderItem> OrderItems { get; set; }
        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        [Required]
        //prop for stripe
        public string PaymentIntentId { get; set; }
        public long GetTotal()
        {
          return Subtotal + DeliveryFee;
        }
    }
}
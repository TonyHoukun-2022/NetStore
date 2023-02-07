using System.Linq;
using API.DataTransferObjects;
using API.Models.OrderAgrregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
  public static class OrderExtensions
    {
        public static IQueryable<OrderDto> MapOrderToOrderDto(this IQueryable<Order> query)
        {
          return query
            .Select(order => new OrderDto
            {
              Id = order.Id,
              BuyerId = order.BuyerId,
              ShippingAddress = order.ShippingAddress,
              OrderDate = order.OrderDate,
              Subtotal = order.Subtotal,
              DeliveryFee = order.DeliveryFee,
              OrderStatus = order.OrderStatus.ToString(),
              Total = order.GetTotal(),
              OrderItems = order.OrderItems.Select(item => new OrderItemDto
              {
                ProductId = item.ItemOrdered.ProductId,
                Name = item.ItemOrdered.Name,
                PictureUrl = item.ItemOrdered.PictureUrl,
                Price = item.Price,
                Quantity = item.Quantity
              }).ToList()
            }).AsNoTracking();
        }
    }
}
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DataTransferObjects;
using API.Extensions;
using API.Models;
using API.Models.OrderAgrregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [Authorize]
    public class OrdersController : BaseApiController
    {
      private readonly StoreContext _context;
      public OrdersController(StoreContext context)
      {
        _context = context;
      }

      [HttpGet]
      public async Task<ActionResult<List<OrderDto>>> GetOrders()
      {
        return await _context.Orders
          // .Include(o => o.OrderItems)
          .MapOrderToOrderDto()
          .Where(o => o.BuyerId == User.Identity.Name)
          .ToListAsync();
      } 

      [HttpGet("{id}", Name = "GetOrder")]
      public async Task<ActionResult<OrderDto>> GetOrder(int id)
      {
        return await _context.Orders
          // .Include(o => o.OrderItems)
          .MapOrderToOrderDto()
          .Where(o => o.BuyerId == User.Identity.Name && o.Id == id)
          .FirstOrDefaultAsync();
      }

      [HttpPost]
      public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
      {
        var basket = await _context.Baskets
          .RetreiveBasketWithItems(User.Identity.Name)
          .FirstOrDefaultAsync();

        if (basket == null) return BadRequest(new ProblemDetails{
            Title = "Could not find the basket"
        });

        var orderItems = new List<OrderItem>();

        //loop for the basketitems in a basket
        foreach  (var basketItem in basket.Items)
        {
          var product = await _context.Products.FindAsync(basketItem.ProductId);

          var OrderedProduct = new ProductItemOrdered
          {
            ProductId = product.Id,
            Name = product.Name,
            PictureUrl = product.PictureUrl
          };

          var orderItem = new OrderItem
          {
            ItemOrdered = OrderedProduct,
            Price = product.Price,
            Quantity = basketItem.Quantity
          };

          orderItems.Add(orderItem);
          product.QuantityInStock -= basketItem.Quantity;
        }

        var subtotal = orderItems.Sum(item => item.Price * item.Quantity);

        var deliveryFee =subtotal > 10000 ? 0 : 500;

        var order = new Order
        {
          OrderItems = orderItems,
          BuyerId = User.Identity.Name,
          Subtotal = subtotal,
          DeliveryFee = deliveryFee,
          ShippingAddress = orderDto.ShippingAddress,
          PaymentIntentId = basket.PaymentIntentId,
        };

        //add order to Orders table
        _context.Orders.Add(order);
        //remove that basket
        _context.Baskets.Remove(basket);

        //if user choose to save address
        if(orderDto.SaveAddress)
        {
          var user = _context.Users
            .Include(user => user.Address)
            .FirstOrDefault(user => user.UserName == User.Identity.Name);

          var address = new UserAddress
          {
            FullName = orderDto.ShippingAddress.FullName,
            Address1 = orderDto.ShippingAddress.Address1,
            Address2 = orderDto.ShippingAddress.Address2,
            City = orderDto.ShippingAddress.City,
            State = orderDto.ShippingAddress.State,
            Postcode = orderDto.ShippingAddress.Postcode,
            Country = orderDto.ShippingAddress.Country,
          };
          user.Address = address;
          _context.Update(user);
        }

        var result = await _context.SaveChangesAsync() > 0;

        //1st arg => route name of the GET method to this resource (GetOrder)
        //2nd arg => route val e.g. order/id
        //3rd arg => return val
        if (result) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

        return BadRequest("Problem creating order");
      }
    }
}
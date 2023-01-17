using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DataTransferObjects;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class BasketController: BaseApiController
    {
      private readonly StoreContext _context;
      public BasketController(StoreContext context)
      {
        _context = context;
      }

      //use the buyerId stored in Cookies to find out relavant basket, and return basket with its basketItems
      //FirstofDefault method return found first one or null if not found. 
      private async Task<Basket> RetrieveBasket()
      {
        return await _context.Baskets
          .Include(basket => basket.Items)
          .ThenInclude(basketItem => basketItem.Product)
          .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
      }

       private Basket CreateBasket()
      {
        //generate unique buyerId
        var buyerId = Guid.NewGuid().ToString();
        var cookieOpts = new CookieOptions{
          IsEssential = true,
          Expires = DateTime.Now.AddDays(30)
        };

        //add buyerId Cookie
        Response.Cookies.Append("buyerId",buyerId, cookieOpts);

        //except buyerId, all other fields of basket are predefined by EF
        var basket = new Basket{BuyerId = buyerId};

        //save to db
        _context.Baskets.Add(basket);
        return basket;
      }

      private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }

    //END POINTS

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
      //applied RetrieveBasket method
      var basket = await RetrieveBasket();

      if (basket == null) return NotFound();

      //return BasketDto type to avoid object cycle error caused by data relationship
      return MapBasketToDto(basket);
    }
    
    [HttpPost] // api/basket?productId=3&quantity=2
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
      //get basket || create basket
      var basket = await RetrieveBasket();

      if(basket == null) basket = CreateBasket();

      //get product
      var product = await _context.Products.FindAsync(productId);
      
      if(product == null) return NotFound();

      //add product into Items field of a basket
      basket.AddItem(product, quantity);

      //if sth have changed, saechangesasync will return int > 0
      //when returned int > 0, result is true
      var result = await _context.SaveChangesAsync() > 0;
    
      //save changes
      //createdAtRoute(location header (the uri), res body)
      if(result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

      //if result is false, nothing change saved, return bad request
      return BadRequest(
        new ProblemDetails{
          Title = "Problem saving item to basket"
        }
      );
    }

   
    [HttpDelete]  // api/basket?productId=3&quantity=2
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
      //get basket
      var basket = await RetrieveBasket();

      if (basket == null) return NotFound();

      // remove item or reduce quantity
      basket.RemoveItem(productId, quantity);

      //save changes()
      var result = await _context.SaveChangesAsync() > 0;

      if(result) return Ok();

      return BadRequest(new ProblemDetails
      {
        Title="Problem removing item from the basket"
      });
     
    }
    }
}
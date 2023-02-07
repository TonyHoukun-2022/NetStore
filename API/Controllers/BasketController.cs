using System;
using System.Threading.Tasks;
using API.Data;
using API.DataTransferObjects;
using API.Extensions;
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
      private async Task<Basket> RetrieveBasket(string buyerId)
      {
        //if no buyerId passed in, delete cookie and return null as Basket
        if(string.IsNullOrEmpty(buyerId))
        {
          Response.Cookies.Delete("buyerId");
          return null;
        }

        //return basket associated with passed in buyerId
        return await _context.Baskets
          .Include(basket => basket.Items)
          .ThenInclude(basketItem => basketItem.Product)
          //where the buyerId in basket == buyerid
          .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
      }

      private string GetBuyerId()
      {
        //if user is logged in, has token, then use username from claims for buyerid
        //if not logged in, claim is null, return buyerId
        //if both are null, return null
        //return username, buyerId or null
        return User.Identity.Name ?? Request.Cookies["buyerId"];
      }

      /** 
         if user is logged in, has usename as Name prop in user obj, which is provide with useAuthentication service,
         then return the basket associated with that user
         if no logged in, use guid as buyerid, and create a annonymous basket 
      */
       private Basket CreateBasket()
      {
        //set buyerId as usename from user obj
        var buyerId = User.Identity?.Name;

        //if buyerId is null, set it to unique id, and set cookie
        if(string.IsNullOrEmpty(buyerId))
        {
          buyerId = Guid.NewGuid().ToString();
          var cookieOpts = new CookieOptions{
            IsEssential = true,
            Expires = DateTime.Now.AddDays(30)
          };
          //set buyerId into Cookie
          Response.Cookies.Append("buyerId",buyerId, cookieOpts);
        }
      
        //except buyerId, all other fields of basket are predefined by EF
        var basket = new Basket{BuyerId = buyerId};

        //save to db
        _context.Baskets.Add(basket);

        return basket;
      }

    //END POINTS

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
      //applied RetrieveBasket method
      var basket = await RetrieveBasket(GetBuyerId());

      if (basket == null) return NotFound();

      //return BasketDto type to avoid object cycle error caused by data relationship
      return basket.MapBasketToDto();
    }
    
    [HttpPost] // api/basket?productId=3&quantity=2
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
      //get basket || create basket
      var basket = await RetrieveBasket(GetBuyerId());

      if(basket == null) basket = CreateBasket();

      //get product
      var product = await _context.Products.FindAsync(productId);
      
      if(product == null) return BadRequest(new ProblemDetails{Title="Product Not Found"});

      //add product into Items field of a basket
      basket.AddItem(product, quantity);

      //if sth have changed, saechangesasync will return int > 0
      //when returned int > 0, result is true
      var result = await _context.SaveChangesAsync() > 0;
    
      //save changes
      //createdAtRoute(location header (the uri), res body)
      if(result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

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
      var basket = await RetrieveBasket(GetBuyerId());

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
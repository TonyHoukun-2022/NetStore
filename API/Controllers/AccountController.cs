using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DataTransferObjects;
using API.Extensions;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class AccountController : BaseApiController
    {
      private readonly UserManager<User> _useManager;
      private readonly TokenService _tokenService;
      private readonly StoreContext _context;

      public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
      {
        _tokenService = tokenService;
        _useManager = userManager;
        _context = context;
      }

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
          .FirstOrDefaultAsync(x => x.BuyerId.ToLower() == buyerId.ToLower());
      }

      [HttpPost("login")]
      public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
      { 
        //find user with username
        var user = await _useManager.FindByNameAsync(loginDto.Username);
        //if that user is not existed or the provided psd doesnt match the one for that user
        if(user == null || !await _useManager.CheckPasswordAsync(user, loginDto.Password))
        {
          return Unauthorized();
        }

        //basket associated with user
        var userBasket = await RetrieveBasket(loginDto.Username);
        //annonymous basket
        var annonyBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

        /**
          if annonyBasket is existed, delete the userBasket, and transfer annoy to the user basket
          if annonyBasket is null, return the userBasket
        */
        if(annonyBasket != null)
        {
          if(userBasket != null) _context.Baskets.Remove(userBasket);
          annonyBasket.BuyerId = user.UserName;
          Response.Cookies.Delete("buyerId");
          await _context.SaveChangesAsync();
        }

        return new UserDto
        {
          Email = user.Email,
          Token = await _tokenService.GenerateToken(user),
          Basket = annonyBasket!= null ? annonyBasket?.MapBasketToDto() : userBasket?.MapBasketToDto()
        };
      }

      [HttpPost("register")]
      public async Task<ActionResult> Register(RegisterDto registerDto)
      {
        var user = new User
        {
          UserName = registerDto.Username,
          Email = registerDto.Email,
        };

        //create user in db
        var result = await _useManager.CreateAsync(user, registerDto.Password);

        //return 400 with array of errors
        if(!result.Succeeded)
        {
          foreach (var error in result.Errors)
          {
            ModelState.AddModelError(error.Code, error.Description);
          }

          return ValidationProblem();
        }

        //succeed add user in db
        await _useManager.AddToRoleAsync(user, "Member");

        return StatusCode(201);
      }

      //protected route
      [Authorize]
      [HttpGet("currentUser")]
      public async Task<ActionResult<UserDto>> GetCurrentUser()
      {
        //User.Identity comes from jwt claims in payload, from token sent with request
        var user = await _useManager.FindByNameAsync(User.Identity.Name);

        var userBasket = await RetrieveBasket(User.Identity.Name);

        return new UserDto
        {
          Email = user.Email,
          Token = await _tokenService.GenerateToken(user),
          Basket = userBasket?.MapBasketToDto()
        };
      }

      [Authorize]
      [HttpGet("savedAddress")]
      public async Task<ActionResult<UserAddress>> GetSavedAddress()
      {
        return await _useManager.Users
          .Where(user => user.UserName == User.Identity.Name)
          .Select(user => user.Address)
          .FirstOrDefaultAsync();
      }
    }
}
using System.IO;
using System.Threading.Tasks;
using API.Data;
using API.DataTransferObjects;
using API.Extensions;
using API.Models.OrderAgrregate;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace API.Controllers
{
  public class PaymentController : BaseApiController
    {
      private readonly PaymentService _paymentService;
      private readonly StoreContext _context;
      private readonly IConfiguration _config;
      public PaymentController(PaymentService paymentService, StoreContext context, IConfiguration config)
      {
        _config = config;
        _paymentService = paymentService;
        _context = context;
      }
      
      // /payment
      [Authorize]
      [HttpPost]
      public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
      {
        var basket = await _context.Baskets
          .RetreiveBasketWithItems(User.Identity.Name)
          .FirstOrDefaultAsync();

        if (basket == null) return NotFound();

        //payment intent is created or updated when user click checkout button
        var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null) 
          return BadRequest(new ProblemDetails
          {
            Title = "Problem creating payment intent"
          });

        basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;

        basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

        _context.Update(basket);

        var result = await _context.SaveChangesAsync() > 0;

        if(!result) return BadRequest(new ProblemDetails
          {
            Title = "Problem updating basket with intent"
          });
        
        return basket.MapBasketToDto();
      }

      // /payment/webhook
      [HttpPost("webhook")]
      public async Task<ActionResult> StripeWebhook()
      {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        var stripeEvent = EventUtility.ConstructEvent(
          json, Request.Headers["Stripe-Signature"],
          _config["StripeSettings:WebhookSecret"]
        );

        var charge = (Charge)stripeEvent.Data.Object;

        var order = await _context.Orders.FirstOrDefaultAsync(o => o.PaymentIntentId == charge.PaymentIntentId);

        if (charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

        await _context.SaveChangesAsync();

        return new EmptyResult();
      }
    }
}
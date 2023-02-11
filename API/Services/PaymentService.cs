using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace API.Services
{
  public class PaymentService
    {
        private readonly IConfiguration _config;      
        public PaymentService(IConfiguration config)
        {
          _config = config;
        }

        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
          StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

          var service = new PaymentIntentService();
          
          var intent = new PaymentIntent();

          var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);

          var deliveryFee = subtotal > 10000 ? 0 : 500;

          //create paymentIntent
          if (string.IsNullOrEmpty(basket.PaymentIntentId))
          {
            var options = new PaymentIntentCreateOptions
            {
              Amount = subtotal + deliveryFee,
              Currency = "aud",
              PaymentMethodTypes = new List<string> {"card"}
            };
            
            //use opts to create paymentIntent
            intent = await service.CreateAsync(options);
          }
          //update existing paymentIntent
          else
          {
            var options = new PaymentIntentUpdateOptions
            {
              //just update the amount
              Amount = subtotal + deliveryFee
            };

            await service.UpdateAsync(basket.PaymentIntentId, options);
          }

          return intent;
        }
    }
}
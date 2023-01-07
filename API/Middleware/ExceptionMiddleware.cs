using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
  //Middleware for 500 server error
  public class ExceptionMiddleware
    {
      private readonly RequestDelegate _next;
      private readonly ILogger<ExceptionMiddleware> _logger;
      private readonly IHostEnvironment _env;

      //constructor
      public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
      {
        _env = env;
        _logger = logger;
        _next = next;
        
      }

      public async Task InvokeAsync(HttpContext context)
      {
        try
        {
          //call next middleware/delegate in the pipeline (highest lvl middleware)
          await _next(context);
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, ex.Message);
          context.Response.ContentType = "application/json";
          context.Response.StatusCode = 500;

          var response = new ProblemDetails{
            Status = 500,
            Detail = _env.IsDevelopment() ? ex.StackTrace.ToString() : null,
            Title = ex.Message
          };

          // To use camel case for all JSON property names, 
          var serializerOptions = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
          //convert response obj to json
          var jsonString = JsonSerializer.Serialize(response, serializerOptions);

          await context.Response.WriteAsync(jsonString);
        }
      }
    }
}
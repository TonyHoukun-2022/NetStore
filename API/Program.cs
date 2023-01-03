using System;
using API.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
  public class Program
    {
        public static void Main(string[] args)
        {
          //create server for runing api
            var host = CreateHostBuilder(args).Build();
            //create a scope
            using var scope = host.Services.CreateScope();
            //assign two services to scope
            var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            try
            {
              //create database
              context.Database.Migrate();
              //seeding data
              DbInitializer.Initialize(context);
            }
            catch (Exception ex)
            {
              logger.LogError(ex,"Problem of migrating data");
            }
           
           host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}

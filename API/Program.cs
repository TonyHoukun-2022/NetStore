using System;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
  public class Program
    {
        public static async Task Main(string[] args)
        {
          //create server for runing api
            var host = CreateHostBuilder(args).Build();

            //create a scope
            using var scope = host.Services.CreateScope();

            //assign services to scope
            var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            try
            {
              //create database
              await context.Database.MigrateAsync();
              //seeding data
              await  DbInitializer.Initialize(context, userManager);

            }
            catch (Exception ex)
            {
              logger.LogError(ex,"Problem of migrating data");
            }
           
           await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}

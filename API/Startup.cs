using API.Data;
using API.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace API
{
  public class Startup
    {
        //constructor
        //injecting configuration setting (defined in appsettings.json)
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        //ADD SERVICES
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            //swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });
            //use sqlite as db
            //connecting string for dev env stored in appsettubgs.development.json
            services.AddDbContext<StoreContext>(opt => {
              opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            //cors
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // Middlewares
        //Middleware ordering
        //exception handler -> Routing -> CORS -> authenticate -> authorize -> custom middlewares -> endpoint
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //use customise exception middleware
            app.UseMiddleware<ExceptionMiddleware>();
            
            if (env.IsDevelopment())
            {
                //exception handler
                // app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            //useCors middleware should put just after useRouting
            app.UseCors(opt => 
            {
              opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
            });

            app.UseAuthorization();

            //place to put custom middlewares

            //middleware for mapping endpoints to different controllers
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

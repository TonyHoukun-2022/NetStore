using System;
using System.Collections.Generic;
using System.Text;
using API.Data;
using API.Middleware;
using API.Models;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
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
            //automapper
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            //swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
                //allow swagger to work with jwt
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme{
                  Description = "Jwt auth header",
                  Name = "Authorization",
                  In = ParameterLocation.Header,
                  Type = SecuritySchemeType.ApiKey,
                  Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement{
                  {
                    new OpenApiSecurityScheme
                    {
                      Reference = new OpenApiReference
                      {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                      },
                      Scheme = "oauth2",
                      Name = "Bearer",
                      In = ParameterLocation.Header
                    },
                    new List<string> ()
                  }
                });
            });

            /**
            //use sqlite as db
            //connecting string for dev env stored in appsettubgs.development.json
            services.AddDbContext<StoreContext>(opt => {
              //use sqlite when development
              // opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
              //use postgreSql when production
              opt.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
            });
            */
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            string connString;
            if (env == "Development") {
              connString = Configuration.GetConnectionString("DefaultConnection");
            }   
            else 
            {
              // Use connection string provided at runtime by Flyio.
              var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
              // Parse connection URL to connection string for Npgsql
              connUrl = connUrl.Replace("postgres://", string.Empty);
              var pgUserPass = connUrl.Split("@")[0];
              var pgHostPortDb = connUrl.Split("@")[1];
              var pgHostPort = pgHostPortDb.Split("/")[0];
              var pgDb = pgHostPortDb.Split("/")[1];
              var pgUser = pgUserPass.Split(":")[0];
              var pgPass = pgUserPass.Split(":")[1];
              var pgHost = pgHostPort.Split(":")[0];
              var pgPort = pgHostPort.Split(":")[1];

              connString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
            }

            services.AddDbContext<StoreContext>(opt =>
            {
                opt.UseNpgsql(connString);
            });

            //cors
            services.AddCors();

            //identity  config as following order
            services.AddIdentityCore<User>(opt =>{
              opt.User.RequireUniqueEmail = true;
            })
              .AddRoles<Role>()
              .AddEntityFrameworkStores<StoreContext>();

            //after setup this service, we can have access to the User obj in the controller if the req is authenticated
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
              .AddJwtBearer(opt => {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                  //api
                  ValidateIssuer = false,
                  //client
                  ValidateAudience = false,
                  //expiry day
                  ValidateLifetime = true,
                  //check key
                  ValidateIssuerSigningKey = true,
                  IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWTSettings:TokenKey"]))
                };
              });
            services.AddAuthorization();

            //apply token service
            services.AddScoped<TokenService>();

            //apply stripe payment service
            services.AddScoped<PaymentService>();

            //cloudinary image service
            services.AddScoped<ImageService>();
        }

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

            //serve production build static react file wwwroot generated by react build
            app.UseDefaultFiles();
            app.UseStaticFiles();

            //useCors middleware should put just after useRouting
            app.UseCors(opt => 
            {
              //allowCredentials method accepts user post cookies from other domains
              opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
            });

            app.UseAuthentication();

            app.UseAuthorization();

            //place to put custom middlewares

            //middleware for mapping endpoints to different controllers
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                //mapping index.html to Fallbackcontroller
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}

using API.Entities;
using API.Models;
using API.Models.OrderAgrregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  // create context derived from Dbcontext 
  //<User, Role, int> => both entities will use int as Id
  public class StoreContext : IdentityDbContext<User, Role, int>
  {
    //constructor
    //pass options when create the StoreContext to base class (DbContext)
    public StoreContext(DbContextOptions options) : base(options)
    {
    }

    //DbSet<Entity/model>
    // Products is the table name
    public DbSet<Product> Products { get; set; }
    public DbSet<Basket> Baskets {get; set;}
    public DbSet<Order> Orders {get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);


      //alernative approach to configure relationships in EF
      // User has one address<type UserAddress>
      // one address with one user
      //1:1 relationship
      builder.Entity<User>()
        .HasOne(a => a.Address)
        .WithOne()
        //use Id from userAddress as FK
        .HasForeignKey<UserAddress>(a => a.Id)
        //userAddress to be deleted if delete a user
        .OnDelete(DeleteBehavior.Cascade);

      //seeding two roles into identityrole model
      builder.Entity<Role>()
                .HasData(
                    new Role { Id = 1, Name = "Member", NormalizedName = "MEMBER" },
                    new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
                );
    }
  }
}
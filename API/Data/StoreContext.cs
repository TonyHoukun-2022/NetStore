using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  // create context derived from Dbcontext 
  public class StoreContext : DbContext
  {
    //constructor
    //pass options when create the StoreContext to base class (DbContext)
    public StoreContext(DbContextOptions options) : base(options)
    {
    }

    //DbSet<Entity/model>
    // Products is the table name
    public DbSet<Product> Products { get; set; }
  }
}
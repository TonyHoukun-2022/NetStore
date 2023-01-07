using System.Collections.Generic;
using API.Data;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // [ApiController]
    // [Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {
        
    private readonly StoreContext _context;
        
        public ProductsController(StoreContext context)
        {
             _context = context;
        }

        [HttpGet]
        //specify return type as list of Product
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
          var products = await _context.Products.ToListAsync();

          return Ok(products);
        }

        [HttpGet("{id}")]  // api/products/3
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
          var product = await _context.Products.FindAsync(id);
          
          if(product == null) {
            return NotFound();
          }

          return product;
        }
    }
}
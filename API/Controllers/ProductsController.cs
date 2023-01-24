using System.Collections.Generic;
using API.Data;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using API.Extensions;
using API.RequestHelpers;
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
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
          //deferred query =>  build up query for sorting 
          var query = _context.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();
         
          //execute expression tree against db
          // return await query.ToListAsync();

          var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

          Response.AddPaginationHeader(products.MetaData);

          return products;
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

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
          var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
          var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

          return Ok(new {brands, types});
        }
    }
}
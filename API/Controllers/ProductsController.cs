using System.Collections.Generic;
using API.Data;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.DataTransferObjects;
using AutoMapper;
using API.Services;

namespace API.Controllers
{
  // [ApiController]
  // [Route("api/[controller]")]
  public class ProductsController : BaseApiController
    {
        
    private readonly StoreContext _context;
    private readonly IMapper _mapper;
    private readonly ImageService _imageService;

    public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
    {
      _mapper = mapper;
      _imageService = imageService;
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

    [HttpGet("{id}", Name ="GetProduct")]  // api/products/3
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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm]CreateProductDto productDto)
    {
      var product = _mapper.Map<Product>(productDto);

      if(productDto.PictureFile != null)
      {
        var imageResult = await _imageService.AddImageAsync(productDto.PictureFile);

        if(imageResult.Error != null) 
          return BadRequest(new ProblemDetails{Title = imageResult.Error.Message});

        //save image url to product.PictureUrl field
        product.PictureUrl = imageResult.SecureUrl.ToString();

        product.PublicId = imageResult.PublicId;
      }

      _context.Products.Add(product);

      var result = await _context.SaveChangesAsync() > 0;
      
      //Header location: /api/Products/19 
      //return product
      if(result) return CreatedAtRoute("GetProduct", new { Id = product.Id}, product);

      return BadRequest(new ProblemDetails {Title = "Problem creating new product"});
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult> UpdateProduct([FromForm]UpdateProductDto productDto)
    {
      var product = await _context.Products.FindAsync(productDto.Id);

      if(product == null) return NotFound(); 

      _mapper.Map(productDto, product);

      //if have image to upload
      if(productDto.PictureFile != null)
      {
        var imgResult = await _imageService.AddImageAsync(productDto.PictureFile);

        if(imgResult.Error != null) 
          return BadRequest(new ProblemDetails{Title = imgResult.Error.Message});

        //if there is an image for this product saved in cloudinary, delete it in cloudinary
        if(!string.IsNullOrEmpty(product.PublicId))
        {
          await _imageService.DeleteImageAsync(product.PublicId);
        }

        //save image url to product.PictureUrl field
        product.PictureUrl = imgResult.SecureUrl.ToString();

        product.PublicId = imgResult.PublicId;
      }

      var result = await _context.SaveChangesAsync() > 0;

      //200
      if(result) return Ok(product);

      return BadRequest(new ProblemDetails{Title="Problem updating product"});
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{productId}")]
    public async Task<ActionResult> DeleteProduct(int productId)
    {
      var product = await _context.Products.FindAsync(productId);

      if(product == null) return NotFound();

      if(!string.IsNullOrEmpty(product.PublicId))
      {
        await _imageService.DeleteImageAsync(product.PublicId);
      }

      _context.Products.Remove(product);

      var result = await _context.SaveChangesAsync() > 0;

      //200
      if(result) return Ok();

      return BadRequest(new ProblemDetails{Title="Problem deleting product"});
    }
  }
}
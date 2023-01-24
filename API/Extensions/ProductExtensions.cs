using System.Collections.Generic;
using System.Linq;
using API.Entities;

namespace API.Extensions
{
  static public class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
          if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p=>p.Name);
           //expression tree
          query = orderBy switch
          {
            "price" => query.OrderBy(p => p.Price),
            "priceDescend" => query.OrderByDescending(p => p.Price),
            //default case (when case is any other)
            _ => query.OrderBy(p=>p.Name)
          };

          return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
          if(string.IsNullOrEmpty(searchTerm)) return query;

          var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

          return query.Where(p=>p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        //brands and types are a long string with diff elements separated by comma
        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
          var brandList = new List<string>();
          var typeList = new List<string>();

          if(!string.IsNullOrEmpty(brands))
            brandList.AddRange(brands.ToLower().Split(',').ToList());

          if(!string.IsNullOrEmpty(types))
            typeList.AddRange(types.ToLower().Split(',').ToList());

          //if brandList.count == 0, do noting, or look for all matches
          query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
          query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

          return query;
        }
    }
}
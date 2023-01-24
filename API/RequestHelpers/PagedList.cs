using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{   //PageList has all props of List
  public class PagedList<T> : List<T>
    {
      //constructor
      public PagedList(List<T> items, int count, int pageNumber, int pageSize)
      {
        MetaData = new MetaData
        {
          TotalCount = count,
          PageSize = pageSize, 
          CurrentPage = pageNumber,
          TotalPages = (int)Math.Ceiling(count /(double)pageSize)
        };
        AddRange(items);
      }

      public MetaData MetaData { get; set; }
      public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
      {
        var count = await query.CountAsync();
        //when pageNum is 2, and pageSize is 10
        //means skip the first 10 products, and take the next 10 from db
        var items = await query.Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();

        return new PagedList<T>(items, count, pageNumber, pageSize);
      }
    }
}
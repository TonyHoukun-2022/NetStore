using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Models.OrderAgrregate
{   
  //owned by orderItem table
    [Owned]
    public class ProductItemOrdered
    {
      public int ProductId { get; set; }
      public string Name { get; set; }
      public string PictureUrl { get; set; }
    }
}
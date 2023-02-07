using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.OrderAgrregate
{
    public class OrderItem
    {
        public int Id { get; set; }
        //OrderItem table own ProductItemOrdered, so orderItem table will show this property
        public ProductItemOrdered ItemOrdered { get; set; }
        public long Price { get; set; }
        public int Quantity { get; set; }
    }
}
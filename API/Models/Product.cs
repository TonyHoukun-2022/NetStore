using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
  //entityFW modelling

  public class Product
    {
        //Properties
        //public properties accessible across app
        //getter setter means we can get and set properties across app
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        //long => long integer
        public long Price { get; set; }
        public string PictureUrl { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
    }
}
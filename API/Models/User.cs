using Microsoft.AspNetCore.Identity;

namespace API.Models
{
  //specify using int type as PK in IdentityUser  
  public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; }
    }
}
using API.DataTransferObjects;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers
{
  //use AutoMapper 
  public class MappingProfiles : Profile
    {
      public MappingProfiles()
      {
        //map from productDto to product
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
      }
    }
}
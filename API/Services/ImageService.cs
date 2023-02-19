using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
  public class ImageService
    {
      private readonly Cloudinary _cloudinary;
      public ImageService(IConfiguration config)
      {
        var account = new Account
        (
          config["Cloudinary:CloudName"],
          config["Cloudinary:ApiKey"],
          config["Cloudinary:ApiSecret"]
        );

        _cloudinary = new Cloudinary(account);
      }

      public async Task<ImageUploadResult> AddImageAsync(IFormFile imageFile)
      {
        var uploadResult = new ImageUploadResult();

        if(imageFile.Length > 0)
        {
          using var stream = imageFile.OpenReadStream();

          var uploadParams = new ImageUploadParams
          {
            File = new FileDescription(imageFile.FileName, stream)
          };
          
          uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
      }

      public async Task<DeletionResult> DeleteImageAsync(string publicId)
      {
        var deleteParams = new DeletionParams(publicId);

        var result = await _cloudinary.DestroyAsync(deleteParams);

        return result;
      }
    }
}
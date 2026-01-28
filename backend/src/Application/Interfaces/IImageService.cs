using Microsoft.AspNetCore.Http;

namespace MarangozEcommerce.Application.Interfaces;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile file, string folder);
    Task DeleteImageAsync(string imageUrl);
}

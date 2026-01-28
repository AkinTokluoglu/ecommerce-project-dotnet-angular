using MarangozEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace MarangozEcommerce.Infrastructure.Services;

public class LocalImageService : IImageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LocalImageService(IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor)
    {
        _environment = environment;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folder)
    {
        // Ana dizin: wwwroot/images
        string webRootPath = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }
        
        var uploadsFolder = Path.Combine(webRootPath, "images", folder);

        // Klasör yoksa oluştur
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Benzersiz dosya adı
        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        // Dosyayı kaydet
        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        // URL oluştur (Örn: http://localhost:5076/images/products/resim.jpg)
        var request = _httpContextAccessor.HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        
        return $"{baseUrl}/images/{folder}/{uniqueFileName}";
    }

    public async Task DeleteImageAsync(string imageUrl)
    {
        // URL'den dosya yolunu bul ve sil (Şimdilik pas geçiyoruz, MVP)
        await Task.CompletedTask;
    }
}

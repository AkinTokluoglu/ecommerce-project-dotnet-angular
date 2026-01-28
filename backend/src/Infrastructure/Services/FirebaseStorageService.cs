using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using MarangozEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting; // IWebHostEnvironment için

namespace MarangozEcommerce.Infrastructure.Services;

public class FirebaseStorageService : IImageService
{
    private readonly StorageClient _storageClient;
    private readonly string _bucketName;

    public FirebaseStorageService(IConfiguration configuration, IWebHostEnvironment env)
    {
        _bucketName = configuration["Firebase:StorageBucket"] 
                      ?? throw new ArgumentNullException("Firebase:StorageBucket configuration is missing");

        var credentialPath = configuration["Firebase:CredentialPath"] ?? "firebase-service-account.json";
        var fullPath = Path.Combine(env.ContentRootPath, credentialPath);

        var credential = GoogleCredential.FromFile(fullPath);
        _storageClient = StorageClient.Create(credential);
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folder)
    {
        var fileName = $"{folder}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        
        using var stream = file.OpenReadStream();
        var objectName = await _storageClient.UploadObjectAsync(_bucketName, fileName, file.ContentType, stream);

        // Public URL oluştur (Firebase Storage için)
        // Not: Object'in public olması gerekebilir veya signed URL kullanılabilir.
        // Basitlik için public URL formatı:
        return $"https://firebasestorage.googleapis.com/v0/b/{_bucketName}/o/{Uri.EscapeDataString(fileName)}?alt=media";
    }

    public async Task DeleteImageAsync(string imageUrl)
    {
        // URL'den dosya adını çıkarma mantığı eklenecek
        // Şimdilik placeholder
        await Task.CompletedTask;
    }
}

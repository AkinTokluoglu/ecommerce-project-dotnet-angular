using System.Text.Json;
using MarangozEcommerce.Application.DTOs.Products;
using MarangozEcommerce.Application.Interfaces;
using MarangozEcommerce.Domain.Entities;
using MarangozEcommerce.Domain.Interfaces;

namespace MarangozEcommerce.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _unitOfWork.Products.GetAllAsync();
        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetProductByIdAsync(Guid id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        return product == null ? null : MapToDto(product);
    }

    public async Task<ProductDto?> GetProductBySlugAsync(string slug)
    {
        var product = await _unitOfWork.Products.FirstOrDefaultAsync(p => p.Slug == slug);
        return product == null ? null : MapToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(Guid categoryId)
    {
        var products = await _unitOfWork.Products.FindAsync(p => p.CategoryId == categoryId);
        return products.Select(MapToDto);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductRequest request)
    {
        var slug = await GenerateUniqueSlugAsync(request.Name);
        
        var product = new Product
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            CategoryId = request.CategoryId,
            MainImageUrl = request.MainImageUrl,
            IsActive = true
        };

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveAsync();

        return MapToDto(product);
    }

    public async Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductRequest request)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null) return null;

        product.Name = request.Name;
        product.Slug = await GenerateUniqueSlugAsync(request.Name, id);
        product.Description = request.Description;
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.IsActive = request.IsActive;
        product.MainImageUrl = request.MainImageUrl;
        product.CategoryId = request.CategoryId;

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveAsync();

        return MapToDto(product);
    }

    public async Task<bool> DeleteProductAsync(Guid id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null) return false;

        _unitOfWork.Products.Remove(product);
        await _unitOfWork.SaveAsync();

        return true;
    }

    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            IsActive = product.IsActive,
            CategoryId = product.CategoryId,
            MainImageUrl = product.MainImageUrl,
            CreatedAt = product.CreatedAt,
            Images = product.Images?.Select(i => new ProductImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                ThumbnailUrl = i.ThumbnailUrl,
                DisplayOrder = i.DisplayOrder,
                IsMain = i.IsMain
            }).ToList() ?? new List<ProductImageDto>(),
            Customizations = product.Customizations?.Select(c => new ProductCustomizationDto
            {
                Id = c.Id,
                OptionName = c.OptionName,
                OptionValues = JsonSerializer.Deserialize<List<string>>(c.OptionValues) ?? new List<string>(),
                PriceModifier = c.PriceModifier
            }).ToList() ?? new List<ProductCustomizationDto>()
        };
    }

    private async Task<string> GenerateUniqueSlugAsync(string name, Guid? ignoreId = null)
    {
        var baseSlug = GenerateSlug(name);
        var slug = baseSlug;
        var counter = 1;

        while (true)
        {
            var existing = await _unitOfWork.Products.FirstOrDefaultAsync(p => p.Slug == slug && (ignoreId == null || p.Id != ignoreId));
            if (existing == null) break;

            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }

    private string GenerateSlug(string name)
    {
        return name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("ş", "s")
            .Replace("ğ", "g")
            .Replace("ü", "u")
            .Replace("ö", "o")
            .Replace("ç", "c")
            .Replace("ı", "i")
            .Replace("İ", "i");
    }
}

namespace MarangozEcommerce.Application.DTOs.Products;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
    public Guid CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? MainImageUrl { get; set; }
    public List<ProductImageDto> Images { get; set; } = new();
    public List<ProductCustomizationDto> Customizations { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class ProductImageDto
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsMain { get; set; }
}

public class ProductCustomizationDto
{
    public Guid Id { get; set; }
    public string OptionName { get; set; } = string.Empty;
    public List<string> OptionValues { get; set; } = new();
    public decimal PriceModifier { get; set; }
}

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public Guid CategoryId { get; set; }
    public string? MainImageUrl { get; set; }
}

public class UpdateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
    public Guid CategoryId { get; set; }
    public string? MainImageUrl { get; set; }
}

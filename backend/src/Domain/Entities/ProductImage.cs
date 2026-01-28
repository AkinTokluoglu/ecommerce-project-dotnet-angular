namespace MarangozEcommerce.Domain.Entities;

public class ProductImage : BaseEntity
{
    public Guid ProductId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsMain { get; set; } = false;
    
    // Navigation properties
    public Product Product { get; set; } = null!;
}

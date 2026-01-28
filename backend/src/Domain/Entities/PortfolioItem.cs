namespace MarangozEcommerce.Domain.Entities;

public class PortfolioItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Images { get; set; } = string.Empty; // JSON array of image URLs
    public string? Category { get; set; }
    public DateTime CompletedDate { get; set; }
    public int DisplayOrder { get; set; } = 0;
}

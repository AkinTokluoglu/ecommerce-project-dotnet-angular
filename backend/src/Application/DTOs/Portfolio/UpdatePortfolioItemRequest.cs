namespace MarangozEcommerce.Application.DTOs.Portfolio;

public class UpdatePortfolioItemRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
    public DateTime CompletedDate { get; set; }
}

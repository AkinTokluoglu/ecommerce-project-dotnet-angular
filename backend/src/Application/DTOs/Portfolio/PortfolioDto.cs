namespace MarangozEcommerce.Application.DTOs.Portfolio;

public class PortfolioDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
    public DateTime CompletedDate { get; set; }
}

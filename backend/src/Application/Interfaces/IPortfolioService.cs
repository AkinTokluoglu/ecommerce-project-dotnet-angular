using MarangozEcommerce.Application.DTOs.Portfolio;

namespace MarangozEcommerce.Application.Interfaces;

public interface IPortfolioService
{
    Task<List<PortfolioDto>> GetAllPortfolioItemsAsync();
    Task<PortfolioDto?> GetPortfolioItemByIdAsync(Guid id);
    Task<PortfolioDto> CreatePortfolioItemAsync(CreatePortfolioItemRequest request);
    Task<PortfolioDto?> UpdatePortfolioItemAsync(Guid id, UpdatePortfolioItemRequest request);
    Task DeletePortfolioItemAsync(Guid id);
}

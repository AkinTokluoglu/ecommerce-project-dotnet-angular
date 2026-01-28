using MarangozEcommerce.Application.DTOs.Orders;

namespace MarangozEcommerce.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderRequest request);
    Task<List<OrderDto>> GetUserOrdersAsync(Guid userId);
    Task<OrderDto?> GetOrderByIdAsync(Guid orderId, Guid userId); // Kendi siparişi mi kontrolü için userId
    
    // Admin Methods
    Task<List<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, MarangozEcommerce.Domain.Enums.OrderStatus status);
}

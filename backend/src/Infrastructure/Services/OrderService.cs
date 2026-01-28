using System.Text.Json;
using MarangozEcommerce.Application.DTOs.Orders;
using MarangozEcommerce.Application.Interfaces;
using MarangozEcommerce.Domain.Entities;
using MarangozEcommerce.Domain.Enums;
using MarangozEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MarangozEcommerce.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderRequest request)
    {
        // Transaction başlat
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                OrderNumber = GenerateOrderNumber(),
                CreatedAt = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                ShippingAddress = request.ShippingAddress,
                Notes = request.Notes,
                PaymentMethod = request.PaymentMethod,
                ContactName = request.ContactName,
                ContactPhone = request.ContactPhone,
                ContactEmail = request.ContactEmail
            };

            decimal totalAmount = 0;

            foreach (var itemRequest in request.Items)
            {
                var product = await _context.Products.FindAsync(itemRequest.ProductId);
                if (product == null)
                {
                    throw new Exception($"Product not found: {itemRequest.ProductId}");
                }

                if (product.StockQuantity < itemRequest.Quantity)
                {
                    throw new Exception($"Insufficient stock for product: {product.Name}");
                }

                // Customization fiyat farklarını hesapla (Basit versiyon: Sadece ana ürün fiyatı + modifierlar)
                // Bu örnekte detaylı customization logic için product.Customizations'a bakmak gerekir.
                // Şimdilik sadece ana ürün fiyatını baz alıyoruz ve customization'ları kaydediyoruz.
                // TODO: Customization fiyatlarını da ekle.
                
                decimal unitPrice = product.Price; // İleride + customization modifier

                var orderItem = new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = product.Id,
                    Quantity = itemRequest.Quantity,
                    UnitPrice = unitPrice,
                    Customizations = itemRequest.Customizations != null 
                        ? JsonSerializer.Serialize(itemRequest.Customizations) 
                        : null
                };

                order.Items.Add(orderItem);
                totalAmount += unitPrice * itemRequest.Quantity;

                // Stok düş
                product.StockQuantity -= itemRequest.Quantity;
            }

            order.TotalAmount = totalAmount;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return MapToDto(order);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<OrderDto>> GetUserOrdersAsync(Guid userId)
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }
    
    public async Task<OrderDto?> GetOrderByIdAsync(Guid orderId, Guid userId)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);
            
        return order == null ? null : MapToDto(order);
    }

    public async Task<List<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, OrderStatus status)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return null;

        order.Status = status;
        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    private string GenerateOrderNumber()
    {
        // Örn: ORD-20231027-XYZ123
        var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
        var randomPart = Path.GetRandomFileName().Replace(".", "").Substring(0, 6).ToUpper();
        return $"ORD-{datePart}-{randomPart}";
    }

    private OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CreatedAt = order.CreatedAt,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            PaymentMethod = order.PaymentMethod.ToString(),
            ContactName = order.ContactName,
            ContactPhone = order.ContactPhone,
            ContactEmail = order.ContactEmail,
            ShippingAddress = order.ShippingAddress,
            Items = order.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                ProductImage = i.Product.MainImageUrl,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Customizations = i.Customizations != null 
                    ? JsonSerializer.Deserialize<Dictionary<string, string>>(i.Customizations) 
                    : null
            }).ToList()
        };
    }
}

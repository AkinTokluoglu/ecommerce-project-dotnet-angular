using MarangozEcommerce.Domain.Enums;

namespace MarangozEcommerce.Application.DTOs.Orders;

public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty; // New
    public string ContactPhone { get; set; } = string.Empty; // New
    public string ContactEmail { get; set; } = string.Empty; // New
    public string? ShippingAddress { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public Dictionary<string, string>? Customizations { get; set; }
}

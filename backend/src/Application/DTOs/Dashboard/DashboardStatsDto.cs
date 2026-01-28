using MarangozEcommerce.Application.DTOs.Orders;
using MarangozEcommerce.Application.DTOs.Products;

namespace MarangozEcommerce.Application.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalProducts { get; set; }
    public int TotalCategories { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<OrderDto> RecentOrders { get; set; } = new();
    public List<ProductDto> RecentProducts { get; set; } = new();
}

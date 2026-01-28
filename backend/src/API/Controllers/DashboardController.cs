using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarangozEcommerce.Application.DTOs.Dashboard;
using MarangozEcommerce.Application.DTOs.Orders;
using MarangozEcommerce.Application.DTOs.Products;
using MarangozEcommerce.Infrastructure.Data;
using System.Text.Json;

namespace MarangozEcommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        // 1. İstatistikleri Hesapla
        var totalProducts = await _context.Products.CountAsync();
        var totalCategories = await _context.Categories.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.Orders
            .Where(o => o.Status != MarangozEcommerce.Domain.Enums.OrderStatus.Cancelled)
            .SumAsync(o => o.TotalAmount);

        // 2. Son Siparişleri Çek
        var recentOrdersEntity = await _context.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .ToListAsync();

        var recentOrdersDto = recentOrdersEntity.Select(o => new OrderDto
        {
            Id = o.Id,
            OrderNumber = o.OrderNumber,
            CreatedAt = o.CreatedAt,
            Status = o.Status,
            TotalAmount = o.TotalAmount,
            PaymentMethod = o.PaymentMethod.ToString(),
            ContactName = o.ContactName,
            ContactPhone = o.ContactPhone,
            ContactEmail = o.ContactEmail,
            ShippingAddress = o.ShippingAddress,
            Items = o.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? "Silinmiş Ürün",
                ProductImage = i.Product?.MainImageUrl ?? "",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        }).ToList();

        // 3. Son Ürünleri Çek
        var recentProductsEntity = await _context.Products
            .Include(p => p.Category)
            .OrderByDescending(p => p.CreatedAt)
            .Take(5)
            .ToListAsync();

        var recentProductsDto = recentProductsEntity.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            Description = p.Description,
            MainImageUrl = p.MainImageUrl,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? "",
            StockQuantity = p.StockQuantity
        }).ToList();

        // 4. DTO Döndür
        var stats = new DashboardStatsDto
        {
            TotalProducts = totalProducts,
            TotalCategories = totalCategories,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            RecentOrders = recentOrdersDto,
            RecentProducts = recentProductsDto
        };

        return Ok(stats);
    }
}

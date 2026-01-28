using System.Text.Json;
using MarangozEcommerce.Application.DTOs.Portfolio;
using MarangozEcommerce.Application.Interfaces;
using MarangozEcommerce.Domain.Entities;
using MarangozEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MarangozEcommerce.Infrastructure.Services;

public class PortfolioService : IPortfolioService
{
    private readonly ApplicationDbContext _context;

    public PortfolioService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PortfolioDto>> GetAllPortfolioItemsAsync()
    {
        var items = await _context.PortfolioItems
            .OrderByDescending(x => x.CompletedDate)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<PortfolioDto?> GetPortfolioItemByIdAsync(Guid id)
    {
        var item = await _context.PortfolioItems.FindAsync(id);
        return item == null ? null : MapToDto(item);
    }

    public async Task<PortfolioDto> CreatePortfolioItemAsync(CreatePortfolioItemRequest request)
    {
        var item = new PortfolioItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Images = JsonSerializer.Serialize(request.Images),
            CompletedDate = request.CompletedDate != default ? request.CompletedDate : DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _context.PortfolioItems.Add(item);
        await _context.SaveChangesAsync();

        return MapToDto(item);
    }

    public async Task<PortfolioDto?> UpdatePortfolioItemAsync(Guid id, UpdatePortfolioItemRequest request)
    {
        var item = await _context.PortfolioItems.FindAsync(id);
        if (item == null) return null;

        item.Title = request.Title;
        item.Description = request.Description;
        item.Category = request.Category;
        item.Images = JsonSerializer.Serialize(request.Images);
        item.CompletedDate = request.CompletedDate != default ? request.CompletedDate : DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(item);
    }

    public async Task DeletePortfolioItemAsync(Guid id)
    {
        var item = await _context.PortfolioItems.FindAsync(id);
        if (item != null)
        {
            _context.PortfolioItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    private PortfolioDto MapToDto(PortfolioItem item)
    {
        List<string> images = new();
        try
        {
            if (!string.IsNullOrEmpty(item.Images))
            {
                images = JsonSerializer.Deserialize<List<string>>(item.Images) ?? new();
            }
        }
        catch
        {
            // Fallback for legacy data or single string
            if (!string.IsNullOrEmpty(item.Images)) images.Add(item.Images);
        }

        return new PortfolioDto
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Description,
            Category = item.Category ?? "",
            Images = images,
            CompletedDate = item.CompletedDate
        };
    }
}

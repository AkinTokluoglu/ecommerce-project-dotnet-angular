using System.Text.RegularExpressions;
using MarangozEcommerce.Application.DTOs.Categories;
using MarangozEcommerce.Application.Interfaces;
using MarangozEcommerce.Domain.Entities;
using MarangozEcommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MarangozEcommerce.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        var categoryList = categories.ToList();
        
        return categoryList.Select(c => MapToDto(c, categoryList)).ToList();
    }

    public async Task<IEnumerable<CategoryDto>> GetRootCategoriesAsync()
    {
        var categories = await _unitOfWork.Categories.FindAsync(c => c.ParentCategoryId == null);
        var allCategories = (await _unitOfWork.Categories.GetAllAsync()).ToList();
        
        return categories.OrderBy(c => c.DisplayOrder).Select(c => MapToDto(c, allCategories)).ToList();
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null) return null;

        var allCategories = (await _unitOfWork.Categories.GetAllAsync()).ToList();
        return MapToDto(category, allCategories);
    }

    public async Task<CategoryDto?> GetCategoryBySlugAsync(string slug)
    {
        var categories = await _unitOfWork.Categories.FindAsync(c => c.Slug == slug);
        var category = categories.FirstOrDefault();
        if (category == null) return null;

        var allCategories = (await _unitOfWork.Categories.GetAllAsync()).ToList();
        return MapToDto(category, allCategories);
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Slug = GenerateSlug(request.Name),
            Description = request.Description,
            DisplayOrder = request.DisplayOrder,
            ParentCategoryId = request.ParentCategoryId
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            DisplayOrder = category.DisplayOrder,
            ParentCategoryId = category.ParentCategoryId
        };
    }

    public async Task<CategoryDto?> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null) return null;

        category.Name = request.Name;
        category.Slug = GenerateSlug(request.Name);
        category.Description = request.Description;
        category.DisplayOrder = request.DisplayOrder;
        category.ParentCategoryId = request.ParentCategoryId;
        category.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Categories.Update(category);
        await _unitOfWork.SaveAsync();

        var allCategories = (await _unitOfWork.Categories.GetAllAsync()).ToList();
        return MapToDto(category, allCategories);
    }

    public async Task<bool> DeleteCategoryAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null) return false;

        _unitOfWork.Categories.Remove(category);
        await _unitOfWork.SaveAsync();

        return true;
    }

    private CategoryDto MapToDto(Category category, List<Category> allCategories)
    {
        var parent = category.ParentCategoryId.HasValue 
            ? allCategories.FirstOrDefault(c => c.Id == category.ParentCategoryId.Value) 
            : null;

        var subCategories = allCategories
            .Where(c => c.ParentCategoryId == category.Id)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                DisplayOrder = c.DisplayOrder,
                ParentCategoryId = c.ParentCategoryId
            })
            .ToList();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            DisplayOrder = category.DisplayOrder,
            ParentCategoryId = category.ParentCategoryId,
            ParentCategoryName = parent?.Name,
            SubCategories = subCategories
        };
    }

    private string GenerateSlug(string name)
    {
        var slug = name.ToLowerInvariant();
        
        // Turkish character replacements
        slug = slug.Replace('ğ', 'g').Replace('ü', 'u').Replace('ş', 's')
                   .Replace('ı', 'i').Replace('ö', 'o').Replace('ç', 'c')
                   .Replace('Ğ', 'g').Replace('Ü', 'u').Replace('Ş', 's')
                   .Replace('İ', 'i').Replace('Ö', 'o').Replace('Ç', 'c');
        
        // Replace spaces with hyphens
        slug = Regex.Replace(slug, @"\s+", "-");
        
        // Remove invalid characters
        slug = Regex.Replace(slug, @"[^a-z0-9\-]", "");
        
        // Remove consecutive hyphens
        slug = Regex.Replace(slug, @"-+", "-");
        
        return slug.Trim('-');
    }
}

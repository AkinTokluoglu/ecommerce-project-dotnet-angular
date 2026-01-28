using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarangozEcommerce.Application.DTOs.Portfolio;
using MarangozEcommerce.Application.Interfaces;

namespace MarangozEcommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PortfolioController : ControllerBase
{
    private readonly IPortfolioService _portfolioService;

    public PortfolioController(IPortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet]
    public async Task<ActionResult<List<PortfolioDto>>> GetAll()
    {
        var items = await _portfolioService.GetAllPortfolioItemsAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PortfolioDto>> GetById(Guid id)
    {
        var item = await _portfolioService.GetPortfolioItemByIdAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<PortfolioDto>> Create([FromBody] CreatePortfolioItemRequest request)
    {
        var item = await _portfolioService.CreatePortfolioItemAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<PortfolioDto>> Update(Guid id, [FromBody] UpdatePortfolioItemRequest request)
    {
        var item = await _portfolioService.UpdatePortfolioItemAsync(id, request);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _portfolioService.DeletePortfolioItemAsync(id);
        return NoContent();
    }
}

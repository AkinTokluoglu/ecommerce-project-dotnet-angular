using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using MarangozEcommerce.Application.DTOs.Messages;
using MarangozEcommerce.Application.Interfaces;

namespace MarangozEcommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IMemoryCache _cache;

    public MessagesController(IMessageService messageService, IMemoryCache cache)
    {
        _messageService = messageService;
        _cache = cache;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<List<MessageDto>>> GetAll()
    {
        var messages = await _messageService.GetAllMessagesAsync();
        return Ok(messages);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<MessageDto>> GetById(Guid id)
    {
        var message = await _messageService.GetMessageByIdAsync(id);
        if (message == null) return NotFound();
        return Ok(message);
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> Create([FromBody] CreateMessageRequest request)
    {
        // Simple Rate Limiting (IP Based)
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var cacheKey = $"Message_RateLimit_{ipAddress}";

        if (_cache.TryGetValue(cacheKey, out int count))
        {
            if (count >= 5) // Max 5 messages per hour per IP
            {
                return StatusCode(429, "Çok fazla mesaj gönderdiniz. Lütfen bir süre bekleyin.");
            }
            _cache.Set(cacheKey, count + 1, TimeSpan.FromHours(1));
        }
        else
        {
            _cache.Set(cacheKey, 1, TimeSpan.FromHours(1));
        }

        var message = await _messageService.CreateMessageAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = message.Id }, message);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _messageService.DeleteMessageAsync(id);
        return NoContent();
    }
}

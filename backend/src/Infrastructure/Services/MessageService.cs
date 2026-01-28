using MarangozEcommerce.Application.DTOs.Messages;
using MarangozEcommerce.Application.Interfaces;
using MarangozEcommerce.Domain.Entities;
using MarangozEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MarangozEcommerce.Infrastructure.Services;

public class MessageService : IMessageService
{
    private readonly ApplicationDbContext _context;

    public MessageService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<MessageDto>> GetAllMessagesAsync()
    {
        var messages = await _context.Messages
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return messages.Select(MapToDto).ToList();
    }

    public async Task<MessageDto?> GetMessageByIdAsync(Guid id)
    {
        var message = await _context.Messages.FindAsync(id);
        if (message != null && !message.IsRead)
        {
            message.IsRead = true;
            await _context.SaveChangesAsync();
        }
        return message == null ? null : MapToDto(message);
    }

    public async Task<MessageDto> CreateMessageAsync(CreateMessageRequest request)
    {
        var message = new Message
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone?.Trim() ?? string.Empty,
            Subject = request.Subject.Trim(),
            Content = request.Content.Trim(),
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return MapToDto(message);
    }

    public async Task DeleteMessageAsync(Guid id)
    {
        var message = await _context.Messages.FindAsync(id);
        if (message != null)
        {
            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();
        }
    }

    public async Task MarkAsReadAsync(Guid id)
    {
        var message = await _context.Messages.FindAsync(id);
        if (message != null)
        {
            message.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    private MessageDto MapToDto(Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            Name = message.Name,
            Email = message.Email,
            Phone = message.Phone,
            Subject = message.Subject,
            Content = message.Content,
            IsRead = message.IsRead,
            CreatedAt = message.CreatedAt
        };
    }
}

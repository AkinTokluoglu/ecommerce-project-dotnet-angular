using MarangozEcommerce.Application.DTOs.Messages;

namespace MarangozEcommerce.Application.Interfaces;

public interface IMessageService
{
    Task<List<MessageDto>> GetAllMessagesAsync();
    Task<MessageDto?> GetMessageByIdAsync(Guid id);
    Task<MessageDto> CreateMessageAsync(CreateMessageRequest request);
    Task DeleteMessageAsync(Guid id);
    Task MarkAsReadAsync(Guid id);
}

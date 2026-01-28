namespace MarangozEcommerce.Domain.Entities;

public class Message : BaseEntity
{
    public Guid? SenderId { get; set; }
    public Guid? ReceiverId { get; set; }
    public Guid? OrderId { get; set; }
    
    public string Name { get; set; } = string.Empty; // For anonymous users
    public string Email { get; set; } = string.Empty; // For anonymous users
    public string Phone { get; set; } = string.Empty; // Optional contact number
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    
    public bool IsRead { get; set; } = false;
    
    // Navigation properties
    public User? Sender { get; set; }
    public User? Receiver { get; set; }
    public Order? Order { get; set; }
}

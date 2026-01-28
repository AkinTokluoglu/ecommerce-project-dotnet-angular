using MarangozEcommerce.Domain.Enums;

namespace MarangozEcommerce.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid OrderId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? TransactionId { get; set; }
    public decimal Amount { get; set; }
    public string? PaymentDetails { get; set; } // JSON format - iyzico response vb.
    
    // Navigation properties
    public Order Order { get; set; } = null!;
}

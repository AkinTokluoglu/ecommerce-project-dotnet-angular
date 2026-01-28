using System.ComponentModel.DataAnnotations;

namespace MarangozEcommerce.Application.DTOs.Messages;

public class CreateMessageRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)] // Limit message length to prevents DDoS/Storage attack
    public string Content { get; set; } = string.Empty;
}

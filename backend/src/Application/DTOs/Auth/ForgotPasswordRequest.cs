using System.ComponentModel.DataAnnotations;

namespace MarangozEcommerce.Application.DTOs.Auth;

public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "E-posta adresi zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
    public string Email { get; set; } = string.Empty;
}

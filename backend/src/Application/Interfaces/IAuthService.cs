using MarangozEcommerce.Application.DTOs.Auth;

namespace MarangozEcommerce.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
    string GenerateJwtToken(Guid userId, string email, string role);
}

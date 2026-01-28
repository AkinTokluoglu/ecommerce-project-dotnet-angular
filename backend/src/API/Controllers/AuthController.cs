using MarangozEcommerce.Application.DTOs.Auth;
using MarangozEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MarangozEcommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly MarangozEcommerce.Infrastructure.Data.ApplicationDbContext _context;

    public AuthController(IAuthService authService, MarangozEcommerce.Infrastructure.Data.ApplicationDbContext context)
    {
        _authService = authService;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        
        if (result == null)
        {
            return BadRequest(new { message = "Kullanıcı zaten mevcut" });
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        
        if (result == null)
        {
            return Unauthorized(new { message = "Email veya şifre hatalı" });
        }

        return Ok(result);
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPost("promote-me")]
    public async Task<IActionResult> PromoteMe()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim.Value);
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null) return NotFound();

        user.Role = MarangozEcommerce.Domain.Enums.UserRole.Admin;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Kullanıcı Admin yapıldı. Lütfen çıkış yapıp tekrar girin." });
    }
}

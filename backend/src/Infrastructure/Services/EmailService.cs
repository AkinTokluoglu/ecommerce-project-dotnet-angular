using MarangozEcommerce.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace MarangozEcommerce.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
    {
        // TODO: Entegrasyon yapıldığında gerçek bir e-posta gönderimi yapılacak.
        // Şimdilik sadece logluyoruz.
        _logger.LogInformation("==================================================================");
        _logger.LogInformation($"PASSWORD RESET EMAIL TO: {toEmail}");
        _logger.LogInformation($"RESET LINK: {resetLink}");
        _logger.LogInformation("==================================================================");
        
        return Task.CompletedTask;
    }
}

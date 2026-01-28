namespace MarangozEcommerce.Domain.Enums;

public enum OrderStatus
{
    Pending = 0,        // Beklemede
    Confirmed = 1,      // Onaylandı
    Processing = 2,     // İşleniyor
    Shipped = 3,        // Kargoya verildi
    Delivered = 4,      // Teslim edildi
    Cancelled = 5,      // İptal edildi
    Refunded = 6        // İade edildi
}

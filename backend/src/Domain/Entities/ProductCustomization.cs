namespace MarangozEcommerce.Domain.Entities;

public class ProductCustomization : BaseEntity
{
    public Guid ProductId { get; set; }
    public string OptionName { get; set; } = string.Empty; // Örnek: "Ahşap Türü", "Boyut", "Renk"
    public string OptionValues { get; set; } = string.Empty; // JSON format: ["Meşe", "Ceviz", "Kayın"]
    public decimal PriceModifier { get; set; } = 0; // Fiyat değişikliği (+/-)
    
    // Navigation properties
    public Product Product { get; set; } = null!;
}

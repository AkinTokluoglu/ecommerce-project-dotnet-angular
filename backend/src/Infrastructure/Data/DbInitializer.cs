using MarangozEcommerce.Domain.Entities;

namespace MarangozEcommerce.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // 0. Default Admin Kullanıcısı (Kullanıcı isteği üzerine)
        var adminEmail = "admin";
        if (!context.Users.Any(u => u.Email == adminEmail))
        {
            var adminUser = new User
            {
                Email = adminEmail,
                FullName = "System Admin",
                Role = MarangozEcommerce.Domain.Enums.UserRole.Admin,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Phone = "5555555555",
                Address = "Sistem Merkezi"
            };
            
            // Eğer veritabanında hiç sepet yoksa hata almamak için User oluşturulurken sepete de bakalım
            // AuthService normalde sepet oluşturuyor ama burada manuel ekliyoruz so sepet de ekleyelim
            var cart = new Cart { UserId = adminUser.Id }; // ID EF Core tarafından atanacak ama Add işleminden sonra ID belli olur
            
            // EF Core fix: Önce user ekle, save, sonra cart
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
            
            cart.UserId = adminUser.Id;
            await context.Carts.AddAsync(cart);
            await context.SaveChangesAsync();
        }

        // Veritabanı boşsa örnek verileri ekle
        if (context.Categories.Any()) return;

        // 1. Kategoriler
        var mutfak = new Category { Name = "Mutfak Dolapları", Slug = "mutfak-dolaplari", Description = "Modern ve klasik mutfak dolapları", DisplayOrder = 1 };
        var banyo = new Category { Name = "Banyo Dolapları", Slug = "banyo-dolaplari", Description = "Suya dayanıklı banyo mobilyaları", DisplayOrder = 2 };
        var salon = new Category { Name = "Salon Mobilyaları", Slug = "salon-mobilyalari", Description = "TV üniteleri, konsollar ve kitaplıklar", DisplayOrder = 3 };
        var yatakOdasi = new Category { Name = "Yatak Odası", Slug = "yatak-odasi", Description = "Gardırop, şifonyer ve komidinler", DisplayOrder = 4 };
        var kapi = new Category { Name = "Kapılar", Slug = "kapilar", Description = "Amerikan ve lake kapı modelleri", DisplayOrder = 5 };

        await context.Categories.AddRangeAsync(mutfak, banyo, salon, yatakOdasi, kapi);
        await context.SaveChangesAsync();

        // 2. Örnek Ürünler
        var urunler = new List<Product>
        {
            new Product
            {
                Name = "Modern Lake Mutfak Dolabı",
                Slug = "modern-lake-mutfak",
                Description = "Yüksek parlaklıkta lake kapaklar, frenli çekmeceler ve özel tasarım tezgah.",
                Price = 150000,
                StockQuantity = 10,
                CategoryId = mutfak.Id,
                IsActive = true,
                MainImageUrl = "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
                Images = new List<ProductImage>
                {
                    new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80", IsMain = true },
                    new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80", IsMain = false }
                }
            },
            new Product
            {
                Name = "Doğal Ahşap TV Ünitesi",
                Slug = "dogal-ahsap-tv-unitesi",
                Description = "Ceviz ağacından el yapımı, modern tasarımlı TV ünitesi.",
                Price = 25000,
                StockQuantity = 5,
                CategoryId = salon.Id,
                IsActive = true,
                MainImageUrl = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
                Images = new List<ProductImage>
                {
                    new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80", IsMain = true }
                }
            },
            new Product
            {
                Name = "Özel Tasarım Gömme Dolap",
                Slug = "ozel-tasarim-gomme-dolap",
                Description = "Odanızın ölçülerine tam uyumlu, ayna kapaklı raylı dolap.",
                Price = 45000,
                StockQuantity = 20,
                CategoryId = yatakOdasi.Id,
                IsActive = true,
                MainImageUrl = "https://images.unsplash.com/photo-1595515106969-1ce29569ff53?w=800&q=80",
                Images = new List<ProductImage>
                {
                    new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1595515106969-1ce29569ff53?w=800&q=80", IsMain = true }
                }
            }
        };

        await context.Products.AddRangeAsync(urunler);
        await context.SaveChangesAsync();
    }
}

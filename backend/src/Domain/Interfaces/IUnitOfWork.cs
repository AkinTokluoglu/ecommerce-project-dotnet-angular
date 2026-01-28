using MarangozEcommerce.Domain.Entities;

namespace MarangozEcommerce.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Product> Products { get; }
    IRepository<Category> Categories { get; }
    IRepository<ProductImage> ProductImages { get; }
    IRepository<ProductCustomization> ProductCustomizations { get; }
    IRepository<Cart> Carts { get; }
    IRepository<CartItem> CartItems { get; }
    IRepository<Order> Orders { get; }
    IRepository<OrderItem> OrderItems { get; }
    IRepository<Payment> Payments { get; }
    IRepository<Message> Messages { get; }
    IRepository<PortfolioItem> PortfolioItems { get; }
    IRepository<Review> Reviews { get; }
    
    Task<int> SaveAsync();
}

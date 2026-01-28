using MarangozEcommerce.Domain.Entities;
using MarangozEcommerce.Domain.Interfaces;
using MarangozEcommerce.Infrastructure.Data;

namespace MarangozEcommerce.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    
    public IRepository<User> Users { get; }
    public IRepository<Product> Products { get; }
    public IRepository<Category> Categories { get; }
    public IRepository<ProductImage> ProductImages { get; }
    public IRepository<ProductCustomization> ProductCustomizations { get; }
    public IRepository<Cart> Carts { get; }
    public IRepository<CartItem> CartItems { get; }
    public IRepository<Order> Orders { get; }
    public IRepository<OrderItem> OrderItems { get; }
    public IRepository<Payment> Payments { get; }
    public IRepository<Message> Messages { get; }
    public IRepository<PortfolioItem> PortfolioItems { get; }
    public IRepository<Review> Reviews { get; }

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        
        Users = new Repository<User>(context);
        Products = new Repository<Product>(context);
        Categories = new Repository<Category>(context);
        ProductImages = new Repository<ProductImage>(context);
        ProductCustomizations = new Repository<ProductCustomization>(context);
        Carts = new Repository<Cart>(context);
        CartItems = new Repository<CartItem>(context);
        Orders = new Repository<Order>(context);
        OrderItems = new Repository<OrderItem>(context);
        Payments = new Repository<Payment>(context);
        Messages = new Repository<Message>(context);
        PortfolioItems = new Repository<PortfolioItem>(context);
        Reviews = new Repository<Review>(context);
    }

    public async Task<int> SaveAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}

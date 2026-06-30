using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<AdminUser> AdminUsers { get; set; } = null!;
        public DbSet<AdminImage> AdminImages { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Collection> Collections { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<ProductImage> ProductImages { get; set; } = null!;
        public DbSet<Offer> Offers { get; set; } = null!;
        public DbSet<OfferProduct> OfferProducts { get; set; } = null!;
        public DbSet<Banner> Banners { get; set; } = null!;
        public DbSet<Inquiry> Inquiries { get; set; } = null!;
        public DbSet<GalleryItem> GalleryItems { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AdminUser>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
            });
        }
    }
}

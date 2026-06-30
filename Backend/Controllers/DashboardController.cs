using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        public class DashboardStatsResponse
        {
            public int TotalProducts { get; set; }
            public int TotalCategories { get; set; }
            public int ActiveOffersCount { get; set; }
            public int TotalCollections { get; set; }
            public object FeaturedProducts { get; set; } = null!;
            public object LatestInquiries { get; set; } = null!;
            public object MostViewedProducts { get; set; } = null!;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var now = DateTime.UtcNow;

            var totalProducts = await _context.Products.CountAsync();
            var totalCategories = await _context.Categories.CountAsync();
            var totalCollections = await _context.Collections.CountAsync();
            var activeOffersCount = await _context.Offers.CountAsync(o => now >= o.StartDate && now <= o.EndDate);

            var categories = await _context.Categories.ToDictionaryAsync(c => c.Id, c => c.Name);
            var collections = await _context.Collections.ToDictionaryAsync(col => col.Id, col => col.Name);
            var productImages = await _context.ProductImages.ToListAsync();

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            // 1. Featured Products
            var featuredProductsRaw = await _context.Products
                .Where(p => p.IsFeatured)
                .OrderByDescending(p => p.CreatedAt)
                .Take(5)
                .ToListAsync();

            var featuredProducts = featuredProductsRaw.Select(p => {
                var linkedImages = productImages.Where(pi => pi.ProductId == p.Id).Select(pi => pi.ImageId).ToList();
                return new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Discount,
                    CategoryName = categories.TryGetValue(p.CategoryId, out var catName) ? catName : "Unknown",
                    ViewsCount = p.ViewsCount,
                    ImageUrl = linkedImages.Any() ? $"{baseUrl}/api/admin/images/{linkedImages.First()}" : null
                };
            }).ToList();

            // 2. Most Viewed Products
            var mostViewedProductsRaw = await _context.Products
                .OrderByDescending(p => p.ViewsCount)
                .Take(5)
                .ToListAsync();

            var mostViewedProducts = mostViewedProductsRaw.Select(p => {
                var linkedImages = productImages.Where(pi => pi.ProductId == p.Id).Select(pi => pi.ImageId).ToList();
                return new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Discount,
                    CategoryName = categories.TryGetValue(p.CategoryId, out var catName) ? catName : "Unknown",
                    ViewsCount = p.ViewsCount,
                    ImageUrl = linkedImages.Any() ? $"{baseUrl}/api/admin/images/{linkedImages.First()}" : null
                };
            }).ToList();

            // 3. Latest Inquiries
            var latestInquiries = await _context.Inquiries
                .OrderByDescending(i => i.CreatedAt)
                .Take(5)
                .Select(i => new
                {
                    i.Id,
                    i.CustomerName,
                    i.Email,
                    i.Phone,
                    i.Message,
                    i.CreatedAt
                })
                .ToListAsync();

            var stats = new DashboardStatsResponse
            {
                TotalProducts = totalProducts,
                TotalCategories = totalCategories,
                TotalCollections = totalCollections,
                ActiveOffersCount = activeOffersCount,
                FeaturedProducts = featuredProducts,
                LatestInquiries = latestInquiries,
                MostViewedProducts = mostViewedProducts
            };

            return Ok(stats);
        }
    }
}

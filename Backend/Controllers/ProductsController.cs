using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        public class ProductUpsertRequest
        {
            public string Name { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public decimal Price { get; set; }
            public decimal Discount { get; set; }
            public int CategoryId { get; set; }
            public int? CollectionId { get; set; }
            public bool IsFeatured { get; set; }
            public bool IsNewArrival { get; set; }
            public string CustomBadge { get; set; } = string.Empty;
            public List<int> ImageIds { get; set; } = new();
        }

        public class ProductResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public decimal Price { get; set; }
            public decimal Discount { get; set; }
            public int CategoryId { get; set; }
            public string CategoryName { get; set; } = string.Empty;
            public int? CollectionId { get; set; }
            public string CollectionName { get; set; } = string.Empty;
            public bool IsFeatured { get; set; }
            public bool IsNewArrival { get; set; }
            public string CustomBadge { get; set; } = string.Empty;
            public int ViewsCount { get; set; }
            public List<int> ImageIds { get; set; } = new();
            public List<string> ImageUrls { get; set; } = new();
            public DateTime CreatedAt { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products.ToListAsync();
            var categories = await _context.Categories.ToDictionaryAsync(c => c.Id, c => c.Name);
            var collections = await _context.Collections.ToDictionaryAsync(col => col.Id, col => col.Name);
            var productImages = await _context.ProductImages.ToListAsync();

            var request = HttpContext.Request;
            var baseUrl = "https://mm.galletrix.com";

            var response = products.Select(p => {
                var linkedImages = productImages.Where(pi => pi.ProductId == p.Id).Select(pi => pi.ImageId).ToList();
                return new ProductResponse
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Discount = p.Discount,
                    CategoryId = p.CategoryId,
                    CategoryName = categories.TryGetValue(p.CategoryId, out var catName) ? catName : "Unknown",
                    CollectionId = p.CollectionId,
                    CollectionName = p.CollectionId.HasValue && collections.TryGetValue(p.CollectionId.Value, out var colName) ? colName : "None",
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    CustomBadge = p.CustomBadge,
                    ViewsCount = p.ViewsCount,
                    ImageIds = linkedImages,
                    ImageUrls = linkedImages.Select(id => $"{baseUrl}/api/admin/images/{id}").ToList(),
                    CreatedAt = p.CreatedAt
                };
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Product not found." });

            // Increment views count for analytics
            product.ViewsCount += 1;
            await _context.SaveChangesAsync();

            var category = await _context.Categories.FindAsync(product.CategoryId);
            var collection = product.CollectionId.HasValue ? await _context.Collections.FindAsync(product.CollectionId.Value) : null;
            var linkedImageIds = await _context.ProductImages
                .Where(pi => pi.ProductId == product.Id)
                .Select(pi => pi.ImageId)
                .ToListAsync();

            var request = HttpContext.Request;
            var baseUrl = "https://mm.galletrix.com";

            var response = new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Discount = product.Discount,
                CategoryId = product.CategoryId,
                CategoryName = category?.Name ?? "Unknown",
                CollectionId = product.CollectionId,
                CollectionName = collection?.Name ?? "None",
                IsFeatured = product.IsFeatured,
                IsNewArrival = product.IsNewArrival,
                CustomBadge = product.CustomBadge,
                ViewsCount = product.ViewsCount,
                ImageIds = linkedImageIds,
                ImageUrls = linkedImageIds.Select(imgId => $"{baseUrl}/api/admin/images/{imgId}").ToList(),
                CreatedAt = product.CreatedAt
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductUpsertRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Product Name is required." });
            }

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Discount = request.Discount,
                CategoryId = request.CategoryId,
                CollectionId = request.CollectionId,
                IsFeatured = request.IsFeatured,
                IsNewArrival = request.IsNewArrival,
                CustomBadge = request.CustomBadge ?? string.Empty,
                ViewsCount = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Link images
            if (request.ImageIds != null && request.ImageIds.Any())
            {
                foreach (var imgId in request.ImageIds)
                {
                    _context.ProductImages.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        ImageId = imgId
                    });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpsertRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Product Name is required." });
            }

            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Product not found." });

            existing.Name = request.Name;
            existing.Description = request.Description;
            existing.Price = request.Price;
            existing.Discount = request.Discount;
            existing.CategoryId = request.CategoryId;
            existing.CollectionId = request.CollectionId;
            existing.IsFeatured = request.IsFeatured;
            existing.IsNewArrival = request.IsNewArrival;
            existing.CustomBadge = request.CustomBadge ?? string.Empty;

            // Remove existing image links
            var existingLinks = await _context.ProductImages.Where(pi => pi.ProductId == id).ToListAsync();
            _context.ProductImages.RemoveRange(existingLinks);

            // Add new image links
            if (request.ImageIds != null && request.ImageIds.Any())
            {
                foreach (var imgId in request.ImageIds)
                {
                    _context.ProductImages.Add(new ProductImage
                    {
                        ProductId = id,
                        ImageId = imgId
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Product not found." });

            // Remove associated links
            var imageLinks = await _context.ProductImages.Where(pi => pi.ProductId == id).ToListAsync();
            _context.ProductImages.RemoveRange(imageLinks);

            var offerLinks = await _context.OfferProducts.Where(op => op.ProductId == id).ToListAsync();
            _context.OfferProducts.RemoveRange(offerLinks);

            _context.Products.Remove(existing);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Product deleted successfully." });
        }
    }
}

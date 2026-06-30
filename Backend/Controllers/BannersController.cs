using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BannersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BannersController(AppDbContext context)
        {
            _context = context;
        }

        public class BannerResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public int ImageId { get; set; }
            public string ImageUrl { get; set; } = string.Empty;
            public string BannerType { get; set; } = string.Empty;
            public string LinkUrl { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var banners = await _context.Banners.OrderByDescending(b => b.CreatedAt).ToListAsync();
            var request = HttpContext.Request;
            var baseUrl = "https://mm.galletrix.com";

            var response = banners.Select(b => new BannerResponse
            {
                Id = b.Id,
                Name = b.Name,
                ImageId = b.ImageId,
                ImageUrl = $"{baseUrl}/api/admin/images/{b.ImageId}",
                BannerType = b.BannerType,
                LinkUrl = b.LinkUrl,
                CreatedAt = b.CreatedAt
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound(new { message = "Banner not found." });

            var request = HttpContext.Request;
            var baseUrl = "https://mm.galletrix.com";

            var response = new BannerResponse
            {
                Id = banner.Id,
                Name = banner.Name,
                ImageId = banner.ImageId,
                ImageUrl = $"{baseUrl}/api/admin/images/{banner.ImageId}",
                BannerType = banner.BannerType,
                LinkUrl = banner.LinkUrl,
                CreatedAt = banner.CreatedAt
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Banner banner)
        {
            if (banner == null || string.IsNullOrWhiteSpace(banner.Name))
            {
                return BadRequest(new { message = "Banner Name is required." });
            }

            // Verify image exists
            var imgExists = await _context.AdminImages.AnyAsync(img => img.Id == banner.ImageId);
            if (!imgExists)
            {
                return BadRequest(new { message = "Associated Image Id does not exist." });
            }

            banner.CreatedAt = DateTime.UtcNow;
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = banner.Id }, banner);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Banner banner)
        {
            if (banner == null || string.IsNullOrWhiteSpace(banner.Name))
            {
                return BadRequest(new { message = "Banner Name is required." });
            }

            var existing = await _context.Banners.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Banner not found." });

            // Verify image exists
            var imgExists = await _context.AdminImages.AnyAsync(img => img.Id == banner.ImageId);
            if (!imgExists)
            {
                return BadRequest(new { message = "Associated Image Id does not exist." });
            }

            existing.Name = banner.Name;
            existing.ImageId = banner.ImageId;
            existing.BannerType = banner.BannerType;
            existing.LinkUrl = banner.LinkUrl;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Banners.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Banner not found." });

            _context.Banners.Remove(existing);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Banner deleted successfully." });
        }
    }
}

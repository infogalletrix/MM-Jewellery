using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GalleryItemsController(AppDbContext context)
        {
            _context = context;
        }

        public class GalleryItemResponse
        {
            public int Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public int ImageId { get; set; }
            public string ImageUrl { get; set; } = string.Empty;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _context.GalleryItems.ToListAsync();
            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            var response = items.Select(i => new GalleryItemResponse
            {
                Id = i.Id,
                Title = i.Title,
                Category = i.Category,
                ImageId = i.ImageId,
                ImageUrl = $"{baseUrl}/api/admin/images/{i.ImageId}"
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.GalleryItems.FindAsync(id);
            if (item == null) return NotFound(new { message = "Gallery item not found." });

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            var response = new GalleryItemResponse
            {
                Id = item.Id,
                Title = item.Title,
                Category = item.Category,
                ImageId = item.ImageId,
                ImageUrl = $"{baseUrl}/api/admin/images/{item.ImageId}"
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GalleryItem item)
        {
            if (item == null || string.IsNullOrWhiteSpace(item.Title))
            {
                return BadRequest(new { message = "Title is required." });
            }
            if (string.IsNullOrWhiteSpace(item.Category))
            {
                return BadRequest(new { message = "Category is required." });
            }

            // Verify image exists
            var imgExists = await _context.AdminImages.AnyAsync(img => img.Id == item.ImageId);
            if (!imgExists)
            {
                return BadRequest(new { message = "Associated Image Id does not exist." });
            }

            _context.GalleryItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GalleryItem item)
        {
            if (item == null || string.IsNullOrWhiteSpace(item.Title))
            {
                return BadRequest(new { message = "Title is required." });
            }
            if (string.IsNullOrWhiteSpace(item.Category))
            {
                return BadRequest(new { message = "Category is required." });
            }

            var existing = await _context.GalleryItems.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Gallery item not found." });

            // Verify image exists
            var imgExists = await _context.AdminImages.AnyAsync(img => img.Id == item.ImageId);
            if (!imgExists)
            {
                return BadRequest(new { message = "Associated Image Id does not exist." });
            }

            existing.Title = item.Title;
            existing.Category = item.Category;
            existing.ImageId = item.ImageId;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.GalleryItems.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Gallery item not found." });

            _context.GalleryItems.Remove(existing);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Gallery item deleted successfully." });
        }
    }
}

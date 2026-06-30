using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CollectionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CollectionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var collections = await _context.Collections.ToListAsync();
            return Ok(collections);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var collection = await _context.Collections.FindAsync(id);
            if (collection == null) return NotFound(new { message = "Collection not found." });
            return Ok(collection);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Collection collection)
        {
            if (collection == null || string.IsNullOrWhiteSpace(collection.Name))
            {
                return BadRequest(new { message = "Collection Name is required." });
            }

            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = collection.Id }, collection);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Collection collection)
        {
            if (collection == null || string.IsNullOrWhiteSpace(collection.Name))
            {
                return BadRequest(new { message = "Collection Name is required." });
            }

            var existing = await _context.Collections.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Collection not found." });

            existing.Name = collection.Name;
            existing.Description = collection.Description;
            existing.ImageId = collection.ImageId;
            existing.Badge = collection.Badge;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Collections.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Collection not found." });

            // Nullify collection association in products rather than blocking delete
            var products = await _context.Products.Where(p => p.CollectionId == id).ToListAsync();
            foreach (var product in products)
            {
                product.CollectionId = null;
            }

            _context.Collections.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Collection deleted successfully." });
        }
    }
}

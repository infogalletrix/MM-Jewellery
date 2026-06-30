using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { message = "Category not found." });
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.Name))
            {
                return BadRequest(new { message = "Category Name is required." });
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.Name))
            {
                return BadRequest(new { message = "Category Name is required." });
            }

            var existing = await _context.Categories.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Category not found." });

            existing.Name = category.Name;
            existing.Description = category.Description;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Categories.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Category not found." });

            // Check if any products are associated with this category
            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts)
            {
                return BadRequest(new { message = "Cannot delete category as it is currently associated with products." });
            }

            _context.Categories.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Category deleted successfully." });
        }
    }
}

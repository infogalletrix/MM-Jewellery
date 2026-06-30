using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InquiriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const int TrashRetentionDays = 7;

        public InquiriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/inquiries — active (non-deleted) inquiries
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var inquiries = await _context.Inquiries
                .Where(i => i.DeletedAt == null)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
            return Ok(inquiries);
        }

        // GET /api/inquiries/trash — soft-deleted within 7 days
        [HttpGet("trash")]
        public async Task<IActionResult> GetTrashed()
        {
            var cutoff = DateTime.UtcNow.AddDays(-TrashRetentionDays);
            var trashed = await _context.Inquiries
                .Where(i => i.DeletedAt != null && i.DeletedAt >= cutoff)
                .OrderByDescending(i => i.DeletedAt)
                .ToListAsync();
            return Ok(trashed);
        }

        // POST /api/inquiries — create new inquiry (public form)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Inquiry inquiry)
        {
            if (inquiry == null || string.IsNullOrWhiteSpace(inquiry.CustomerName) ||
                string.IsNullOrWhiteSpace(inquiry.Email) || string.IsNullOrWhiteSpace(inquiry.Message))
            {
                return BadRequest(new { message = "Customer Name, Email, and Message are required." });
            }

            inquiry.CreatedAt = DateTime.UtcNow;
            inquiry.DeletedAt = null;
            _context.Inquiries.Add(inquiry);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Inquiry submitted successfully.", id = inquiry.Id });
        }

        // DELETE /api/inquiries/{id} — soft-delete (move to recycle bin)
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var existing = await _context.Inquiries.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Inquiry not found." });

            existing.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Inquiry moved to recycle bin. It will be permanently deleted in 7 days." });
        }

        // POST /api/inquiries/{id}/restore — restore from recycle bin
        [HttpPost("{id}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            var existing = await _context.Inquiries.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Inquiry not found." });

            existing.DeletedAt = null;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Inquiry restored successfully." });
        }

        // DELETE /api/inquiries/{id}/permanent — permanently delete from recycle bin
        [HttpDelete("{id}/permanent")]
        public async Task<IActionResult> PermanentDelete(int id)
        {
            var existing = await _context.Inquiries.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Inquiry not found." });

            _context.Inquiries.Remove(existing);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Inquiry permanently deleted." });
        }

        // DELETE /api/inquiries/trash/purge — permanently delete all expired (>7 days) trash
        [HttpDelete("trash/purge")]
        public async Task<IActionResult> PurgeExpired()
        {
            var cutoff = DateTime.UtcNow.AddDays(-TrashRetentionDays);
            var expired = await _context.Inquiries
                .Where(i => i.DeletedAt != null && i.DeletedAt < cutoff)
                .ToListAsync();

            _context.Inquiries.RemoveRange(expired);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = $"Purged {expired.Count} expired inquiries." });
        }
    }
}

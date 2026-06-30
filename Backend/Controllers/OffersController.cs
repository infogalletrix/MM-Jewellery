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
    public class OffersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OffersController(AppDbContext context)
        {
            _context = context;
        }

        public class OfferUpsertRequest
        {
            public string Name { get; set; } = string.Empty;
            public decimal DiscountPercent { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public List<int> ApplicableProductIds { get; set; } = new();
        }

        public class OfferResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public decimal DiscountPercent { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public List<int> ApplicableProductIds { get; set; } = new();
            public bool IsActive { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var offers = await _context.Offers.ToListAsync();
            var offerProducts = await _context.OfferProducts.ToListAsync();
            var now = DateTime.UtcNow;

            var response = offers.Select(o => {
                var linkedProductIds = offerProducts.Where(op => op.OfferId == o.Id).Select(op => op.ProductId).ToList();
                return new OfferResponse
                {
                    Id = o.Id,
                    Name = o.Name,
                    DiscountPercent = o.DiscountPercent,
                    StartDate = o.StartDate,
                    EndDate = o.EndDate,
                    ApplicableProductIds = linkedProductIds,
                    IsActive = now >= o.StartDate && now <= o.EndDate
                };
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null) return NotFound(new { message = "Offer not found." });

            var linkedProductIds = await _context.OfferProducts
                .Where(op => op.OfferId == id)
                .Select(op => op.ProductId)
                .ToListAsync();

            var now = DateTime.UtcNow;
            var response = new OfferResponse
            {
                Id = offer.Id,
                Name = offer.Name,
                DiscountPercent = offer.DiscountPercent,
                StartDate = offer.StartDate,
                EndDate = offer.EndDate,
                ApplicableProductIds = linkedProductIds,
                IsActive = now >= offer.StartDate && now <= offer.EndDate
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OfferUpsertRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Offer Name is required." });
            }

            var offer = new Offer
            {
                Name = request.Name,
                DiscountPercent = request.DiscountPercent,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            _context.Offers.Add(offer);
            await _context.SaveChangesAsync();

            // Link applicable products
            if (request.ApplicableProductIds != null && request.ApplicableProductIds.Any())
            {
                foreach (var prodId in request.ApplicableProductIds)
                {
                    _context.OfferProducts.Add(new OfferProduct
                    {
                        OfferId = offer.Id,
                        ProductId = prodId
                    });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetById), new { id = offer.Id }, offer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OfferUpsertRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Offer Name is required." });
            }

            var existing = await _context.Offers.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Offer not found." });

            existing.Name = request.Name;
            existing.DiscountPercent = request.DiscountPercent;
            existing.StartDate = request.StartDate;
            existing.EndDate = request.EndDate;

            // Remove existing links
            var existingLinks = await _context.OfferProducts.Where(op => op.OfferId == id).ToListAsync();
            _context.OfferProducts.RemoveRange(existingLinks);

            // Add new links
            if (request.ApplicableProductIds != null && request.ApplicableProductIds.Any())
            {
                foreach (var prodId in request.ApplicableProductIds)
                {
                    _context.OfferProducts.Add(new OfferProduct
                    {
                        OfferId = id,
                        ProductId = prodId
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Offers.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Offer not found." });

            var links = await _context.OfferProducts.Where(op => op.OfferId == id).ToListAsync();
            _context.OfferProducts.RemoveRange(links);

            _context.Offers.Remove(existing);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Offer deleted successfully." });
        }
    }
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public decimal Discount { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public int? CollectionId { get; set; }

        public bool IsFeatured { get; set; } = false;

        public bool IsNewArrival { get; set; } = false;

        public string CustomBadge { get; set; } = string.Empty;

        public int ViewsCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

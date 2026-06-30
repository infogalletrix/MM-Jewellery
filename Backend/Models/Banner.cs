using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Banners")]
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int ImageId { get; set; }

        [Required]
        [MaxLength(50)]
        public string BannerType { get; set; } = string.Empty; // "Homepage Banner", "Collection Banner", "Promotional Banner"

        [MaxLength(500)]
        public string LinkUrl { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

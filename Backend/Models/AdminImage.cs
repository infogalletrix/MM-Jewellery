using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("AdminImages")]
    public class AdminImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string ContentType { get; set; } = string.Empty;

        [Required]
        public byte[] ImageData { get; set; } = Array.Empty<byte>();

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}

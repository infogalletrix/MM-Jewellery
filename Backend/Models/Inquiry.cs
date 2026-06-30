using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Inquiries")]
    public class Inquiry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Soft-delete: set when moved to recycle bin; null = active
        public DateTime? DeletedAt { get; set; }
    }
}

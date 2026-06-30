using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("AdminUsers")]
    public class AdminUser
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(10)]
        public string? ResetCode { get; set; }

        public DateTime? ResetCodeExpiry { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

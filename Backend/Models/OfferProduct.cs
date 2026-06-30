using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("OfferProducts")]
    public class OfferProduct
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OfferId { get; set; }

        [Required]
        public int ProductId { get; set; }
    }
}

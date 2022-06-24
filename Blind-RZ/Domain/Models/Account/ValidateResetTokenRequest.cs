using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Account
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}

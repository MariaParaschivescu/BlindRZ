using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Account
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}

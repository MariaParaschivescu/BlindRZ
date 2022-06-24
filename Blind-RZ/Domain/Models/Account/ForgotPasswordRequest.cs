using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Account
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}

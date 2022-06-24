using System.ComponentModel.DataAnnotations;
namespace Domain.Entities.Device
{
    public class Command
    {

        [Key]
        public Guid CommandId { get; set; }
        [Required]
        public string Direction { get; set; }
        [Required]
        public string OpeningPercent { get; set; }
        public DateTime? TimeStamp { get; set; }

        public bool Acknowledged { get; set; }

        public Guid AccountId { get; set; }
        public Account.Account Account { get; set; }


    }
}

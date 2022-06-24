namespace Domain.Models.Device
{
    public class GetLastCommandRequest
    {
        public string Direction { get; set; }
        public string OpeningPercent { get; set; }
        public DateTime? TimeStamp { get; set; }
        public bool Acknowledged { get; set; }

    }
}

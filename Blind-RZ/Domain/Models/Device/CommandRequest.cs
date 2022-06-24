using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Device
{
    public class CommandRequest
    {
        public string Direction { get; set; }
        public string OpeningPercent { get; set; }
        //public DateTime TimeStamp { get; set; }
        //public Guid AccountId { get; set; }
    }
}

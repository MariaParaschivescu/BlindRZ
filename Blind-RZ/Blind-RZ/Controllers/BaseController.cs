using Domain.Entities.Account;
using Microsoft.AspNetCore.Mvc;

namespace Blind_RZ.Controllers
{
    [Controller]
    public abstract class BaseController : ControllerBase
    {
        // returns the current authenticated account (null if not logged in)
        public Account Account => (Account)HttpContext.Items["Account"];
    }
}

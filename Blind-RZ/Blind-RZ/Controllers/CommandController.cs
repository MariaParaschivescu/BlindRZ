using Domain.Entities.Account;
using Domain.Helpers;
using Domain.Helpers.Authorization;
using Domain.Interfaces.Services;
using Domain.Models.Account;
using Domain.Models.Device;
using Microsoft.AspNetCore.Mvc;
namespace Blind_RZ.Controllers
{
    [Authorize]
    //[Authorize(Policy = "CustomerOnly")]
    [ApiController]
    [Route("[controller]")]
    public class CommandController : BaseController
    {
        private readonly ICommandService _commandService;
        private readonly IAccountService _accountService;

        public CommandController(ICommandService commandService, IAccountService accountService)
        {
            _commandService = commandService;
            _accountService = accountService;
        }

        [HttpPost("upload-command")]
        public IActionResult UploadCommand(CommandRequest request)
        {
            var userAccount = (Account)HttpContext.Items["Account"];

            if (userAccount == null)
            {
                return null;
            }
            _commandService.UploadCommand(request, userAccount);
            return Ok(new { message = "Your command was successfully registered" });
        }

        [AllowAnonymous]
        [HttpPost("get-last-command")]
        public ActionResult<GetLastCommandRequest> GetLastCommand(AuthenticateRequest authenticateRequest)
        {
            var userAccount = _accountService.GetAccountByEmail(authenticateRequest);
            if (userAccount == null || !BCrypt.Net.BCrypt.Verify(authenticateRequest.Password, userAccount.PasswordHash))
                throw new AppException("Email or password is incorrect");

            var command = _commandService.GetLastCommand(authenticateRequest, userAccount);
            return Ok(command);

        }

        [AllowAnonymous]
        [HttpGet("get-worked")]
        public IActionResult CheckItIsWorking()
        {
            Console.WriteLine("It works");
            return Ok(new { message = "It worked" });
        }

    }
}


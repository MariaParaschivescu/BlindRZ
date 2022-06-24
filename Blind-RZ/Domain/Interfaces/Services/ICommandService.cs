using Domain.Entities.Account;
using Domain.Entities.Device;
using Domain.Models.Account;
using Domain.Models.Device;

namespace Domain.Interfaces.Services
{
    public interface ICommandService
    {
        IQueryable<Command> GetCommandsForUserId(Guid userId);
        //Task UploadCommand(CommandRequest command, AccountResponse authenticateResponse);
        void UploadCommand(CommandRequest command, Account authenticateResponse);
        public GetLastCommandRequest GetLastCommand(AuthenticateRequest authenticateRequest, Account userAccount);
    }
}

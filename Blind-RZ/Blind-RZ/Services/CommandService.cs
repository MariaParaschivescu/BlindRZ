using AutoMapper;
using Domain.Entities.Account;
using Domain.Entities.Device;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Interfaces.UnitOfWork;
using Domain.Models.Account;
using Domain.Models.Device;

namespace Blind_RZ.Services
{
    public class CommandService : ICommandService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICommandRepository _commandRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CommandService(IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _commandRepository = unitOfWork.CommandRepository;
            _accountRepository = unitOfWork.AccountRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }
        public IQueryable<Command> GetCommandsForUserId(Guid userId)
        {
            var commands = _commandRepository.GetAllByFilter(command => command.Account.Id == userId);
            return commands;
        }

        public GetLastCommandRequest GetLastCommand(AuthenticateRequest authenticateRequest, Account userAccount)
        {
            Command lastCommand = null;
            var allCommands = userAccount.Commands;
            foreach (var command in allCommands)
            {
                lastCommand = allCommands.MaxBy(command => command.TimeStamp);
            }
            if (lastCommand.Acknowledged == false)
            {
                lastCommand.Acknowledged = true;
                _commandRepository.Update(lastCommand);
                _unitOfWork.SaveChanges();
                lastCommand.Acknowledged = false;
            }
            return _mapper.Map<GetLastCommandRequest>(lastCommand);
        }

        public void UploadCommand(CommandRequest command, Account currentAccount)
        {
            var uploadedCommand = _commandRepository.Create(_mapper.Map<Command>(command));
            uploadedCommand.TimeStamp = DateTime.UtcNow;
            uploadedCommand.AccountId = currentAccount.Id;
            currentAccount.Commands.Add(uploadedCommand);
            var account = _accountRepository.Update(currentAccount);
            _unitOfWork.SaveChanges();

        }
    }
}

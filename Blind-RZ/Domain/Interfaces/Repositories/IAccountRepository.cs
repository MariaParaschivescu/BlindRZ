using Domain.Entities.Account;

namespace Domain.Interfaces.Repositories
{
    public interface IAccountRepository: IRepository<Account>
    {
        Account GetAccountWithCommands(Guid accountId);
    }
}

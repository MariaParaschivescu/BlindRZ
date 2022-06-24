using DataAccess.Context;
using Domain.Entities.Account;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class AccountRepository : Repository<Account>, IAccountRepository
    {
        public AccountRepository(BlindsContext dbContext) : base(dbContext)
        {
        }

        public Account GetAccountWithCommands(Guid accountId) {
            return Db.Set<Account>().Include(e => e.Commands).First(e => e.Id == accountId);
        }
    }
}

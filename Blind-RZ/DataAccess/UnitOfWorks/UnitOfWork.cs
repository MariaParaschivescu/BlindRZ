using DataAccess.Context;
using DataAccess.Repositories;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.UnitOfWork;

namespace DataAccess.UnitOfWorks
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly BlindsContext _blindsContext;
        public IAccountRepository AccountRepository { get; set; }
        public ICommandRepository CommandRepository { get; set; }

        public UnitOfWork(BlindsContext blindsContext)
        {
            AccountRepository = new AccountRepository(blindsContext);
            CommandRepository = new CommandRepository(blindsContext);
            _blindsContext = blindsContext;
        }

        public void SaveChanges()
        {
            _blindsContext.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            await _blindsContext.SaveChangesAsync();
        }
    }
}

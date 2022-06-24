using DataAccess.Context;
using Domain.Entities.Device;
using Domain.Interfaces.Repositories;

namespace DataAccess.Repositories
{
    public class CommandRepository : Repository<Command>, ICommandRepository
    {
        public CommandRepository(BlindsContext dbContext) : base(dbContext)
        {
        }
    }
}

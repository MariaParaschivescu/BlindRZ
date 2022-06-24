using Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.UnitOfWork
{
    public interface IUnitOfWork
    {
        public IAccountRepository AccountRepository { get; set; }
        public ICommandRepository CommandRepository { get; set; }
        Task SaveChangesAsync();
        void SaveChanges();
    }
}

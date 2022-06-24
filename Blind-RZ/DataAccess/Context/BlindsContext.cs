using Domain.Entities.Account;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Context
{
    public class BlindsContext: DbContext
    {
        public BlindsContext(DbContextOptions<BlindsContext> options): base(options){ }
        public DbSet<Account> Accounts { get; set; }

        //private readonly IConfiguration Configuration;

        //public BlindsContext(IConfiguration configuration)
        //{
        //    Configuration = configuration;
        //}
    }
}

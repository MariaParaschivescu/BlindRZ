using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Repositories
{
    public interface IRepository<TEntity> : IDisposable where TEntity : class
    {
        IQueryable<TEntity> GetAllQuery();
        IQueryable<TEntity> GetAllByFilter(Expression<Func<TEntity, bool>> expression);
        IQueryable<TEntity> GetAll();
        Task<TEntity> GetById<TId>(TId id);
        TEntity SingleOrDefault(Func<TEntity, bool> predicate);
        TEntity Find(Guid id);
        bool Any(Func<TEntity, bool> predicate);

        int Count();

        Task<bool> ExistsAsync<TEntity>(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default);

        TEntity Create(TEntity entity);
        TEntity Update(TEntity entity);
        Task<bool> Delete(Guid id);
    }
}

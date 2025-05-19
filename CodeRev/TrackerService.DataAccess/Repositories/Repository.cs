using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using MongoDB.Driver;
using TrackerService.Contracts.Record;
using TrackerService.DataAccess.Infrastructure;

namespace TrackerService.DataAccess.Repositories;

public class Repository : IRepository
{
    public async Task<TaskRecordDto?> Get(Guid taskSolutionId)
    {
        return await Task.FromResult(new TaskRecordDto());
    }

    public async Task Save(TaskRecordDto request)
    {
        await Task.Delay(0);
    }

    private async Task Update(TaskRecordDto request)
    {
        await Task.Delay(0);
    }
}
using TrackerService.Contracts;
using TrackerService.Contracts.Record;
using TrackerService.DataAccess.Repositories;

namespace TrackerService.Services;

public class TrackerManager : ITrackerManager
{
    private readonly IRepository repository;

    public TrackerManager(IRepository repository)
    {
        this.repository = repository;
    }

    public async Task<RecordChunkDto[]?> Get(Guid taskSolutionId, decimal? saveTime)
    {
        // var recordsRequest = await repository.Get(taskSolutionId);
        // var result = recordsRequest?.RecordChunks.Where(x => x.SaveTime > (saveTime ?? 0m))
        //                            .OrderBy(x => x.SaveTime).ToArray();
        // return result;
        return await Task.FromResult<RecordChunkDto[]?>(Array.Empty<RecordChunkDto>());
    }

    public async Task<LastCodeDto?> GetLastCode(Guid taskSolutionId)
    {
        // var taskRecord = await repository.Get(taskSolutionId);
        // return new LastCodeDto {Code = taskRecord?.Code};
        return await Task.FromResult(new LastCodeDto());
    }

    public async Task Save(TaskRecordDto request)
    {
        await repository.Save(request);
    }
}
using System;
using System.Linq;
using UserService.DAL.Entities;
using UserService.DAL.Models.Enums;
using UserService.DAL.Models.Interfaces;
using UserService.Models.Tasks;
using Task = UserService.DAL.Entities.Task;

namespace UserService.Helpers.Tasks
{
    public interface ITaskCreator
    {
        Guid Create(TaskCreationDto taskCreation, out string errorString);
        Guid CreateSolution(Guid interviewSolutionGuid, Guid taskGuid);
    }
    
    public class TaskCreator : ITaskCreator
    {
        private readonly IDbRepository dbRepository;
        private readonly ITaskHandler taskHandler;

        public TaskCreator(IDbRepository dbRepository, ITaskHandler taskHandler)
        {
            this.dbRepository = dbRepository;
            this.taskHandler = taskHandler;
        }

        public Guid Create(TaskCreationDto taskCreation, out string errorString)
        {
            var task = MapTaskCreationToTaskEntity(taskCreation);
            task.Id = Guid.NewGuid();
            var checkIfExist = dbRepository.Get<Task>(x => x.Name == task.Name && !x.IsDeleted);
            if (checkIfExist.Count() > 0)
            {
                errorString = "Задача с таким именем уже есть";
                return task.Id;
            }
            dbRepository.Add(task).Wait();
            dbRepository.SaveChangesAsync().Wait();
            errorString = null;
            return task.Id;
        }

        public Guid CreateSolution(Guid interviewSolutionGuid, Guid taskGuid)
        {
            var taskSolutionGuid = Guid.NewGuid();
            var task = taskHandler.GetTask(taskGuid);
            
            dbRepository.Add(new TaskSolution
            {
                Id = taskSolutionGuid,
                InterviewSolutionId = interviewSolutionGuid,
                TaskId = task.Id,
                IsDone = false,
                Grade = Grade.Zero,
                RunAttemptsLeft = task.RunAttempts,
            }).Wait();
            
            dbRepository.SaveChangesAsync().Wait();
            
            return taskSolutionGuid;
        }

        private static Task MapTaskCreationToTaskEntity(TaskCreationDto taskCreation)
            => new()
            {
                IsDeleted = false,
                TaskText = taskCreation.TaskText,
                StartCode = taskCreation.StartCode,
                Name = taskCreation.Name,
                TestsCode = taskCreation.TestsCode,
                RunAttempts = taskCreation.RunAttempts >= 0 ? taskCreation.RunAttempts : 0,
                ProgrammingLanguage = taskCreation.ProgrammingLanguage,
            };
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using AutoMapper.Internal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using UserService.DAL.Entities;
using UserService.DAL.Models.Enums;
using UserService.Helpers;
using UserService.Helpers.Auth;
using UserService.Helpers.Interviews;
using UserService.Helpers.Tasks;
using UserService.Models.Interviews;
using UserService.Models.Review;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class InterviewsController : Controller
    {
        private const string Solution = "solution";
        
        private readonly IInterviewHelper interviewHelper;
        private readonly IDraftHelper draftHelper;
        private readonly IInterviewCreator interviewCreator;
        private readonly IUserHelper userHelper;
        private readonly ITaskHandler taskHandler;
        private readonly ITaskHelper taskHelper;
        
        public InterviewsController(IInterviewHelper interviewHelper, IDraftHelper draftHelper, IInterviewCreator interviewCreator, IUserHelper userHelper, ITaskHandler taskHandler, ITaskHelper taskHelper)
        {
            this.interviewHelper = interviewHelper;
            this.draftHelper = draftHelper;
            this.interviewCreator = interviewCreator;
            this.userHelper = userHelper;
            this.taskHandler = taskHandler;
            this.taskHelper = taskHelper;
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpGet]
        public IActionResult GetInterviews()
        {
            return Ok(interviewHelper.GetAllInterviews());
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpPost("delete-interview")]
        public IActionResult DeleteInterview([Required] [FromQuery(Name = "id")] Guid interviewId)
        {
            interviewHelper.DeleteInterview(interviewId);
            return Ok();
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpPost]
        public IActionResult PostInterview([Required] [FromHeader(Name = "Authorization")] string authorization,
            [Required] [FromBody] InterviewCreationDto interviewCreation)
        {
            //note накопипастил код ниже из ContestController - надо покрасивее сделать
            if (!TokenHelper.TakeUserIdFromAuthHeader(authorization, out var userId))
                return BadRequest($"Unexpected {nameof(authorization)} header value");
            
            var user = userHelper.Get(userId, out var errorString);
            if (errorString != null)
                return BadRequest(errorString);
            if (user == null)
                return Conflict($"no {nameof(user)} with such id");
            var interviewId = interviewCreator.Create(interviewCreation, user.Id, out var sameNameCheck);
            if (sameNameCheck != null)
                return BadRequest(sameNameCheck);
            return Ok(new
            {
                interviewId
            });
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpGet("vacancies")]
        public IActionResult GetVacancies()
        {
            return Ok(interviewHelper.GetAllVacancies());
        }
        
        [Authorize(Roles = "Interviewer,HrManager,Admin,Candidate")]
        [HttpGet($"{Solution}")]
        public IActionResult GetInterviewSolutionInfo([Required] [FromQuery(Name = "id")] string interviewSolutionId)
        {
            var interviewSolutionInfo = interviewHelper.GetInterviewSolutionInfo(interviewSolutionId, out var errorString);
            if (errorString != null)
                return BadRequest(errorString);
            if (interviewSolutionInfo == null)
                return Conflict("no interview solution with such id, interview or user doesn't exist");
            return Ok(interviewSolutionInfo);
        }
        
        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpGet("get-interview-tasks")]
        public IActionResult GetInterviewTasks([Required] [FromQuery(Name = "id")] Guid interviewId)
        {
            var tasksId = interviewCreator.GetTasksId(interviewId);
            var res = tasksId.Select(x => taskHandler.GetTask(x)).ToArray();
            return Ok(res);
        }
        
        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpGet("get-tasks-for-interview")]
        public IActionResult GetTasksForInterview([Required] [FromQuery(Name = "id")] Guid interviewId)
        {
            var tasksId = interviewCreator.GetTasksId(interviewId);
            var res = tasksId.Select(x => taskHandler.GetTask(x)).ToList();
            var res2 = taskHelper.GetAllTasks();
            var superRes = res.Concat(res2).DistinctBy(x => x.Id).ToList();
            return Ok(superRes);
        }
        
        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpGet("get-interview-tasksId")]
        public IActionResult GetInterviewTasksId([Required] [FromQuery(Name = "id")] Guid interviewId)
        {
            var tasksId = interviewCreator.GetTasksId(interviewId);
            return Ok(tasksId);
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpGet("get-interview-info")]
        public IActionResult GetInterviewInfo([Required] [FromQuery(Name = "id")] Guid interviewId)
        {
            return Ok(interviewHelper.GetInterview(interviewId));
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpPut($"{Solution}/grade")]
        public IActionResult PutInterviewSolutionGrade([Required] [FromQuery(Name = "id")] string interviewSolutionId, [Required] [FromQuery(Name = "grade")] int grade)
        {
            if (!Enum.IsDefined(typeof(Grade), grade))
                return BadRequest($"{nameof(grade)} is invalid");
            
            if (!interviewHelper.TryPutInterviewSolutionGrade(interviewSolutionId, (Grade)grade, out var errorString) || errorString != null)
                return BadRequest(errorString);
            return Ok();
        }

        [Authorize(Roles = "HrManager,Admin")]
        [HttpPut($"{Solution}/result")]
        public IActionResult PutInterviewSolutionResult([Required] [FromQuery(Name = "id")] string interviewSolutionId, [Required] [FromQuery(Name = "result")] int interviewResult)
        {
            if (!Enum.IsDefined(typeof(InterviewResult), interviewResult))
                return BadRequest($"{nameof(interviewResult)} is invalid");
            
            if (!interviewHelper.TryPutInterviewSolutionResult(interviewSolutionId, (InterviewResult)interviewResult, out var errorString) || errorString != null)
                return BadRequest(errorString);
            return Ok();
        }
        
        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpPut($"{Solution}/comment")]
        public IActionResult PutInterviewSolutionComment([Required] [FromQuery(Name = "id")] string interviewSolutionId, [Required] [FromBody] InterviewSolutionComment interviewSolutionComment)
        {
            if (!interviewHelper.TryPutInterviewSolutionComment(interviewSolutionId, interviewSolutionComment.ReviewerComment, out var errorString) || errorString != null)
                return BadRequest(errorString);
            return Ok();
        }
        
        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpPut($"{Solution}/review")]
        public IActionResult PutInterviewSolutionReview([Required] [FromBody] InterviewSolutionReview interviewSolutionReview)
        {
            if (!Enum.IsDefined(typeof(Grade), interviewSolutionReview.AverageGrade))
                return BadRequest($"{nameof(interviewSolutionReview.AverageGrade)} is invalid");
            if (!Enum.IsDefined(typeof(InterviewResult), interviewSolutionReview.InterviewResult))
                return BadRequest($"{nameof(interviewSolutionReview.InterviewResult)} is invalid");
            
            
            if (!interviewHelper.TryPutInterviewSolutionReview(interviewSolutionReview, out var errorString) || errorString != null)
                return BadRequest(errorString);
            return Ok();
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpGet($"{Solution}/draft")]
        public IActionResult GetDraft([Required] [FromQuery(Name = "id")] string interviewSolutionId)
        {
            var interviewSolution = interviewHelper.GetInterviewSolution(interviewSolutionId, out var errorString);
            if (errorString != null)
                return BadRequest(errorString);
            if (interviewSolution == null)
                return Conflict("no interview solution with such id, interview or user doesn't exist");

            var draft = draftHelper.GetDraft(interviewSolution.ReviewerDraftId);
            return Ok(draft);
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpPost($"{Solution}/draft")]
        public IActionResult PostDraft([Required] [FromBody] ReviewerDraftDto reviewerDraft)
        {
            var interviewSolution = interviewHelper.GetInterviewSolution(reviewerDraft.InterviewSolutionId, out var errorString);
            if (errorString != null)
                return BadRequest(errorString);
            if (interviewSolution == null)
                return Conflict("no interview solution with such id, interview or user doesn't exist");

            draftHelper.PutDraft(interviewSolution.ReviewerDraftId, reviewerDraft.Draft);
            return Ok();
        }
    }
}
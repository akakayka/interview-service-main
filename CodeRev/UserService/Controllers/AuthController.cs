using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using UserService.Helpers.Auth;
using UserService.Helpers.Auth.Invitations;
using UserService.Helpers.Interviews;
using UserService.Models.Auth;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IUserHelper userHelper;
        private readonly IInvitationValidator invitationValidator;
        private readonly IInterviewCreator interviewCreator;
        
        public AuthController(IUserHelper userHelper, IInvitationValidator invitationValidator, IInterviewCreator interviewCreator)
        {
            this.userHelper = userHelper;
            this.invitationValidator = invitationValidator;
            this.interviewCreator = interviewCreator;
        }

        [HttpPost("login-candidate")]
        public IActionResult CandidateLogin([Required][FromQuery(Name = "invite")] string invitationId, 
        [Required][FromBody] LoginRequest request ) 
        {
            var user = userHelper.Get(request);
            if (user == null)
                return Unauthorized();
            
            var invitation = invitationValidator.Validate(invitationId, out var errorString);
            if (errorString != null)
                return Unauthorized();
            
            if (!invitation.InterviewId.Equals(Guid.Empty))
                interviewCreator.CreateSolution(user.Id, invitation.InterviewId, invitation.CreatedBy, invitation.IsSynchronous);

            
            return Ok(new
            {
                accessToken = TokenHelper.GenerateTokenString(user), user.FullName
            }
            );
        }
        
        [Authorize(Roles = "Candidate")]
        [HttpPost("register-contest")]
        public IActionResult RegistrContest([Required][FromQuery(Name = "invite")] string invitationId, 
            [Required] [FromHeader(Name = "Authorization")] string authorization)
        {
            if (!TokenHelper.TakeUserIdFromAuthHeader(authorization, out var userId))
                return BadRequest($"Unexpected {nameof(authorization)} header value");
            var user = userHelper.Get(userId, out var userErrorString);
            if (userErrorString != null)
                return BadRequest(userErrorString);
            var invitation = invitationValidator.Validate(invitationId, out var errorString);
            if (errorString != null)
                return Unauthorized();

            if (!invitation.InterviewId.Equals(Guid.Empty))
            {
                interviewCreator.CreateSolution(user.Id, invitation.InterviewId, invitation.CreatedBy,
                    invitation.IsSynchronous);
            }

            return Ok();
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = userHelper.Get(request);
            
            if (user == null) 
                return Unauthorized();
            
            return Ok(new
            {
                accessToken = TokenHelper.GenerateTokenString(user), user.FullName
            });
        }
        
        [HttpPost("loginViaVk")]
        public IActionResult LoginViaVk([Required][FromQuery] string vkId, [FromBody] VkSession session)
        {
            if (!TokenHelper.IsValidVkSession(session))
                return Unauthorized();
            
            var user = userHelper.Get(new LoginRequest()
            {
                Email = vkId,
                PasswordHash = TokenHelper.VkMockPassHash
            });
            
            if (user == null) 
                return Unauthorized();

            
            return Ok(new
            {
                accessToken = TokenHelper.GenerateTokenString(user),
                user.FullName
            });
        }
        
        [HttpGet("validate-role")]
        public IActionResult ValidateRole([Required][FromQuery(Name = "token")] string token)
        {
            var role = TokenHelper.GetRole(token);
            if (role == null)
                return Unauthorized();
            
            return Ok(new
            {
                role = role.ToString()?.ToLower()
            });
        }
        
        [HttpGet("validate")]
        public IActionResult ValidateToken([Required][FromQuery(Name = "token")] string token)
            => TokenHelper.IsValidToken(token) ? Ok() : Unauthorized();
        
        [HttpGet("validateVk")]
        public IActionResult ValidateVkSession([Required][FromBody] VkSession vkSession)
            => TokenHelper.IsValidVkSession(vkSession) ? Ok() : Unauthorized();
    }
}
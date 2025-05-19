using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using UserService.Helpers.Auth;
using UserService.Helpers.Interviews;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class CardsController : Controller
    {
        private readonly ICardHelper cardHelper;

        public CardsController(ICardHelper cardHelper)
        {
            this.cardHelper = cardHelper;
        }

        [HttpGet("get-user-cards")]
        public IActionResult GetUserCards([Required][FromHeader(Name = "Authorization")] string authorization)
        {
            if(TokenHelper.TakeUserIdFromAuthHeader(authorization, out var userId))
                return Ok(cardHelper.GetUserCards(userId));
            return Unauthorized();
        }

        [Authorize(Roles = "Interviewer,HrManager,Admin")]
        [HttpGet]
        public IActionResult GetInterviewSolutions()
        {
            return Ok(cardHelper.GetCards());
        }
    }
}
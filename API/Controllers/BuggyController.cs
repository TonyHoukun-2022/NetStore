using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class BuggyController : BaseApiController
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
          //404
          return NotFound();
        }

        [HttpGet("bad-request")]
         public ActionResult GetBadRequest()
        {
          //400
          return BadRequest(new ProblemDetails{Title="this is a bad request"});
        }

        [HttpGet("unauthorize")]
         public ActionResult GetAuthorize()
        {
          //401
          return Unauthorized();
        }

         [HttpGet("validation-error")]
         public ActionResult GetValidationError()
        {
          //400
          ModelState.AddModelError("problem 1", "this is 1st authorize error");
          ModelState.AddModelError("problem 2", "this is 2nd authorize error");
          return ValidationProblem();
        }

         [HttpGet("server-error")]
         public ActionResult GetServerError()
        {
          //500
          //thow to higgest customise exception middleware
          throw new Exception("This is a server error");
        }
    }
}
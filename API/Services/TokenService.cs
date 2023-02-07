using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
  public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        public TokenService(UserManager<User> userManager, IConfiguration config)
        {
          _userManager = userManager;
          _config = config;
        }

        public async Task<string> GenerateToken(User user)
        {
          //user identities => jwt claims (payload)
          var claims = new List<Claim>
          {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName),
          };

          var roles = await _userManager.GetRolesAsync(user);
          foreach (var role in roles)
          {
            claims.Add(new Claim(ClaimTypes.Role, role));
          }

          //generate key for verification of token (tokenKey stored in appsetting.Development.json)
          var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));

          //set  algorithm
          var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

          var tokenOpts = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials
          );

          //return a token
          return new JwtSecurityTokenHandler().WriteToken(tokenOpts);
        }
    }
}
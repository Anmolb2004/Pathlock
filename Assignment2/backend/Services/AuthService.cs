using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiniProjectManager.Data;
using MiniProjectManager.Dtos;
using MiniProjectManager.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MiniProjectManager.Services
{
    public class AuthService : IAuthService
    {
        private readonly ProjectManagerDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ProjectManagerDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // 1. Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                throw new ApplicationException("Username already exists.");
            }

            // 2. Hash the password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // 3. Create new user
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                PasswordHash = passwordHash
            };

            // 4. Save to database
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // 5. Generate JWT and return response
            return GenerateAuthResponse(user);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            // 1. Find user by username
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            
            // 2. Check if user exists and password is correct
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new ApplicationException("Invalid username or password.");
            }

            // 3. Generate JWT and return response
            return GenerateAuthResponse(user);
        }

        private AuthResponse GenerateAuthResponse(User user)
        {
            var token = GenerateJwtToken(user);
            return new AuthResponse
            {
                UserId = user.Id.ToString(),
                Username = user.Username,
                Token = token
            };
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            // Get secret key from appsettings.Development.json
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] 
                ?? throw new InvalidOperationException("JWT Key is missing in configuration"));

            // "Claims" are pieces of info about the user.
            // This is how we'll know *who* is making requests later.
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // Subject (User ID)
                new Claim(JwtRegisteredClaimNames.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // JWT ID
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token lasts for 1 hour
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
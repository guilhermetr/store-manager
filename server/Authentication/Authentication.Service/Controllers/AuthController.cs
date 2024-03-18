using Authentication.Service.DataContext;
using Authentication.Service.Dtos;
using Authentication.Service.Models;
using AuthenticationService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        private readonly IpAddressLockService _ipAddressLockService;

        private readonly int MaxFailedAttempts;
        private readonly int BlockDurationMinutes;

        public AuthController(IConfiguration config, ApplicationDbContext context, IpAddressLockService ipAddressLockService)
        {
            _config = config;
            _context = context;
            _ipAddressLockService = ipAddressLockService;
            MaxFailedAttempts = _config.GetValue<int>("IpAddressLockSettings:MaxFailedAttempts");
            BlockDurationMinutes = _config.GetValue<int>("IpAddressLockSettings:BlockDurationMinutes");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequestDto model)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress;            
            if (_ipAddressLockService.IsIpAddressBlocked(ipAddress))
            {
                return BadRequest($"Endereço IP bloqueado por {BlockDurationMinutes} minutos. Por favor novamente tente mais tarde.");
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == model.Username);
            if (user == null)
            {
                _ipAddressLockService.AddFailedAttempt(ipAddress);
                return BadRequest($"Usuario ou senha inválidos. Seu endereço IP será bloqueado depois de {MaxFailedAttempts} erros.");
            }
            
            string hashedPassword = HashPassword(model.Password);
            if (user.PasswordHash != hashedPassword)
            {
                _ipAddressLockService.AddFailedAttempt(ipAddress);
                return BadRequest($"Usuario ou senha inválidos. Seu endereço IP será bloqueado depois de {MaxFailedAttempts} erros.");
            }

            _ipAddressLockService.ResetFailedAttempts(ipAddress);
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthRequestDto model)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == model.Username);
            if (existingUser != null)
            {
                return Conflict("Usuario já existe");
            }

            string passwordHash = HashPassword(model.Password);
            var newUser = new User { Username = model.Username, PasswordHash = passwordHash };
            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado com sucesso!");
        }

        [HttpPost("validate")]
        public IActionResult ValidateToken([FromBody] string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_config["Jwt:Secret"]);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return Ok("Token JWT válida");
            }
            catch (Exception ex)
            {                
                return BadRequest("Erros de validação de Token: " + ex.Message);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Secret"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            return hash;
        }
    }
}

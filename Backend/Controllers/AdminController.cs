using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using Backend.Data;
using Backend.Models;
using BCrypt.Net;
using System.IO;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Login Request Model
        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        // Change Password Request Model
        public class ChangePasswordRequest
        {
            public string Username { get; set; } = string.Empty;
            public string CurrentPassword { get; set; } = string.Empty;
            public string NewPassword { get; set; } = string.Empty;
        }

        // Forgot Password Request Model
        public class ForgotPasswordRequest
        {
            public string Username { get; set; } = string.Empty;
        }

        // Reset Password Request Model
        public class ResetPasswordRequest
        {
            public string Username { get; set; } = string.Empty;
            public string ResetCode { get; set; } = string.Empty;
            public string NewPassword { get; set; } = string.Empty;
        }

        // Image Metadata Response Model
        public class ImageMetadataResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string ContentType { get; set; } = string.Empty;
            public string Url { get; set; } = string.Empty;
            public DateTime UploadedAt { get; set; }
        }

        // Authenticate admin user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { success = false, message = "Username and password are required." });
            }

            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower());

            if (admin == null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
            {
                return Unauthorized(new { success = false, message = "Invalid username or password." });
            }

            return Ok(new { success = true, username = admin.Username, message = "Login successful." });
        }

        // Update administrator password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || 
                string.IsNullOrWhiteSpace(request.CurrentPassword) || 
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { success = false, message = "All password fields are required." });
            }

            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower());

            if (admin == null || !BCrypt.Net.BCrypt.Verify(request.CurrentPassword, admin.PasswordHash))
            {
                return Unauthorized(new { success = false, message = "Current password verification failed." });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { success = false, message = "New password must be at least 6 characters long." });
            }

            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Password updated successfully." });
        }

        // Upload new image to database
        [HttpPost("images")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { success = false, message = "Please select a valid image file." });
            }

            // Check content type to ensure it is an image
            if (!file.ContentType.StartsWith("image/"))
            {
                return BadRequest(new { success = false, message = "Uploaded file must be a valid image." });
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var newImage = new AdminImage
                {
                Name = Path.GetFileName(file.FileName),
                ContentType = file.ContentType,
                ImageData = memoryStream.ToArray(),
                UploadedAt = DateTime.UtcNow
            };

            _context.AdminImages.Add(newImage);
            await _context.SaveChangesAsync();

            return Ok(new { 
                success = true, 
                message = "Image uploaded and stored in database successfully.",
                imageId = newImage.Id 
            });
        }

        // List all stored images (excluding raw bytes for faster load times)
        [HttpGet("images")]
        public async Task<IActionResult> GetImages()
        {
            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            var images = await _context.AdminImages
                .OrderByDescending(img => img.UploadedAt)
                .Select(img => new ImageMetadataResponse
                {
                    Id = img.Id,
                    Name = img.Name,
                    ContentType = img.ContentType,
                    Url = $"{baseUrl}/api/admin/images/{img.Id}",
                    UploadedAt = img.UploadedAt
                })
                .ToListAsync();

            return Ok(images);
        }

        // Fetch binary image content
        [HttpGet("images/{id}")]
        public async Task<IActionResult> GetImageStream(int id)
        {
            var image = await _context.AdminImages.FindAsync(id);
            if (image == null)
            {
                return NotFound(new { success = false, message = "Image not found." });
            }

            return File(image.ImageData, image.ContentType);
        }

        // Delete image from database
        [HttpDelete("images/{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.AdminImages.FindAsync(id);
            if (image == null)
            {
                return NotFound(new { success = false, message = "Image not found." });
            }

            _context.AdminImages.Remove(image);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Image deleted from database successfully." });
        }

        // Request a reset code
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username))
            {
                return BadRequest(new { success = false, message = "Username is required." });
            }

            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower());

            if (admin == null)
            {
                return NotFound(new { success = false, message = "Administrator account not found." });
            }

            // Generate 6-digit verification code
            var random = new Random();
            var code = random.Next(100000, 999999).ToString();

            admin.ResetCode = code;
            admin.ResetCodeExpiry = DateTime.UtcNow.AddMinutes(15);
            await _context.SaveChangesAsync();

            // Send reset code email
            await SendResetCodeEmailAsync(admin.Email, code);

            return Ok(new { success = true, message = "Verification code has been sent to the registered email." });
        }

        // Reset password using verification code
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || 
                string.IsNullOrWhiteSpace(request.ResetCode) || 
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { success = false, message = "Username, reset code, and new password are required." });
            }

            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower());

            if (admin == null)
            {
                return NotFound(new { success = false, message = "Administrator account not found." });
            }

            if (string.IsNullOrEmpty(admin.ResetCode) || 
                admin.ResetCode != request.ResetCode || 
                !admin.ResetCodeExpiry.HasValue || 
                admin.ResetCodeExpiry.Value < DateTime.UtcNow)
            {
                return BadRequest(new { success = false, message = "Invalid or expired verification code." });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { success = false, message = "New password must be at least 6 characters long." });
            }

            // Update password
            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            admin.ResetCode = null;
            admin.ResetCodeExpiry = null;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Password has been reset successfully." });
        }

        private async Task SendResetCodeEmailAsync(string emailAddress, string code)
        {
            var subject = "MM Jewellery Portal - Password Reset Code";
            var body = $@"
<div style='font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;'>
  <h2 style='color: #aa7c11; text-align: center;'>MM Jewellery</h2>
  <h3 style='color: #333333;'>Password Reset Request</h3>
  <p style='color: #555555; line-height: 1.5;'>You requested to reset your password for the MM Jewellery Administration Portal.</p>
  <p style='color: #555555; line-height: 1.5;'>Please use the following 6-digit verification code to complete the process. This code is valid for 15 minutes.</p>
  <div style='background-color: #f9f9f9; border: 1px dashed #aa7c11; border-radius: 4px; padding: 15px; text-align: center; margin: 20px 0;'>
    <span style='font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #aa7c11;'>{code}</span>
  </div>
  <p style='color: #888888; font-size: 12px;'>If you did not make this request, please ignore this email.</p>
</div>";

            try
            {
                var smtpHost = _configuration["Smtp:Host"];
                var smtpPortStr = _configuration["Smtp:Port"];
                var smtpUser = _configuration["Smtp:Username"];
                var smtpPass = _configuration["Smtp:Password"];
                var fromAddress = _configuration["Smtp:FromAddress"] ?? "noreply@mmjewellery.com";

                if (!string.IsNullOrEmpty(smtpHost) && int.TryParse(smtpPortStr, out int smtpPort))
                {
                    using (var mailMessage = new MailMessage())
                    {
                        mailMessage.From = new MailAddress(fromAddress, "MM Jewellery Portal");
                        mailMessage.To.Add(emailAddress);
                        mailMessage.Subject = subject;
                        mailMessage.Body = body;
                        mailMessage.IsBodyHtml = true;

                        using (var smtpClient = new SmtpClient(smtpHost, smtpPort))
                        {
                            if (!string.IsNullOrEmpty(smtpUser))
                            {
                                smtpClient.Credentials = new NetworkCredential(smtpUser, smtpPass);
                            }
                            smtpClient.EnableSsl = true;
                            await smtpClient.SendMailAsync(mailMessage);
                        }
                    }
                    Console.WriteLine($"[EMAIL SENT] Reset code successfully sent to {emailAddress}");
                }
                else
                {
                    throw new Exception("SMTP settings not configured in appsettings.json.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("========================================================================");
                Console.WriteLine($"[EMAIL FALLBACK] Failed to send email to {emailAddress}. Error: {ex.Message}");
                Console.WriteLine($"Verification code for {emailAddress} is: {code}");
                Console.WriteLine("========================================================================");

                // Write to a local file inside current working directory of backend
                try
                {
                    var debugFilePath = Path.Combine(Directory.GetCurrentDirectory(), "debug_reset_code.txt");
                    await System.IO.File.WriteAllTextAsync(debugFilePath, $"Email: {emailAddress}\nCode: {code}\nGeneratedAt: {DateTime.UtcNow}\n");
                    Console.WriteLine($"[DEBUG] Reset code written to file: {debugFilePath}");
                }
                catch (Exception fileEx)
                {
                    Console.WriteLine($"[ERROR] Could not write debug reset code file: {fileEx.Message}");
                }
            }
        }
    }
}

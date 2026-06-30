using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Swagger/OpenAPI support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS to allow access from frontend local dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure EF Core database connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    );
});

var app = builder.Build();

// Enable CORS
app.UseCors("AllowFrontend");

// Swagger documentation
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Auto-verify and create database and tables on startup + seed default data
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        DbInitializer.Seed(dbContext);

        // Auto-purge soft-deleted inquiries older than 7 days
        var cutoff = DateTime.UtcNow.AddDays(-7);
        var expired = dbContext.Inquiries.Where(i => i.DeletedAt != null && i.DeletedAt < cutoff).ToList();
        if (expired.Count > 0)
        {
            dbContext.Inquiries.RemoveRange(expired);
            dbContext.SaveChanges();
            Console.WriteLine($"Auto-purged {expired.Count} expired inquiries from recycle bin.");
        }

        Console.WriteLine("MySQL database tables and seed data initialized successfully.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred while initializing the database: {ex.Message}");
}

app.UseAuthorization();

app.MapControllers();

// Launch on port 5005
app.Run("http://0.0.0.0:5005");

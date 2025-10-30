// We must import our new namespaces
using BasicTaskManager.Api;
using BasicTaskManager.Services;

// 1. Setup the web application
var builder = WebApplication.CreateBuilder(args);

// --- 2. Add Services (Dependency Injection) ---

// Add Swagger/OpenAPI for API documentation and testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS: This is CRITICAL. It allows your React frontend
// (on a different port) to call this backend.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.AllowAnyOrigin() // For assignment, allow all.
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add our in-memory task service as a "Singleton" service.
// This is the *only* place we reference the concrete class.
builder.Services.AddSingleton<ITaskService, InMemoryTaskService>();

// --- 3. Build the App ---
var app = builder.Build();

// --- 4. Configure HTTP Pipeline (Middleware) ---

// Use Swagger UI only when in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // This provides the /swagger test page
}

// Redirect HTTP to HTTPS (Good practice)
app.UseHttpsRedirection();

// Enable the CORS policy
app.UseCors("AllowReactApp");

// --- 5. Define API Endpoints ---
// This is the magic. We just call our new extension method.
// All the endpoint logic is clean in Api/TaskEndpoints.cs
app.MapTaskEndpoints();

// --- 6. Run the App ---
app.Run();

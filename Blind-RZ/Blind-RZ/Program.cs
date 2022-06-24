using Blind_RZ.Services;
using DataAccess.Context;
using DataAccess.UnitOfWorks;
using Domain.Helpers;
using Domain.Helpers.Authorization;
using Domain.Interfaces.Services;
using Domain.Interfaces.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// add services to DI container
{
    var services = builder.Services;
    var env = builder.Environment;
    //var connection = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=BlindRZNew;Integrated Security=SSPI;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
    var connection = "Data Source=(localdb)\\.\\MSSQLLocalDB_shared;Initial Catalog=BlindRZNew;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
    services.AddDbContext<BlindsContext>(options => options.UseSqlServer(connection));
    services.AddCors();
    services.AddControllers().AddJsonOptions(x =>
    {
        // serialize enums as strings in api responses (e.g. Role)
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
    services.AddHttpContextAccessor();
    services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    services.AddSwaggerGen();

    // configure strongly typed settings object
    services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

    //services.AddAuthentication(x =>
    //{
    //    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    //    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    //})
    //            .AddJwtBearer(x =>
    //            {
    //                x.RequireHttpsMetadata = false;
    //                x.SaveToken = true;
    //                x.TokenValidationParameters = new TokenValidationParameters
    //                {
    //                    ValidateIssuerSigningKey = false,
    //                };
    //            });
    //services.AddAuthorization(options =>
    //{
    //    options.AddPolicy("CustomerOnly", policy => policy.RequireClaim("id"));
    //});

    // configure DI for application services
    services.AddScoped<IUnitOfWork, UnitOfWork>();
    services.AddScoped<IJwtUtils, JwtUtilsService>();
    services.AddScoped<IAccountService, AccountService>();
    services.AddScoped<ICommandService, CommandService>();
    services.AddScoped<IEmailService, EmailService>();
}

var app = builder.Build();

// migrate any database changes on startup (includes initial db creation)
using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<BlindsContext>();
    dataContext.Database.Migrate();
}

// configure HTTP request pipeline
{
    // generated swagger json and swagger ui middleware
    app.UseSwagger();
    app.UseSwaggerUI(x => x.SwaggerEndpoint("/swagger/v1/swagger.json", ".NET Sign-up and Verification API"));

    // global cors policy
    app.UseCors(x => x
        .SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());

    // global error handler
    app.UseMiddleware<ErrorHandlerMiddleware>();

    // custom jwt auth middleware
    app.UseMiddleware<JwtMiddleware>();
    //app.UseAuthentication();
    //app.UseAuthorization();

    app.MapControllers();
}

//app.Run("http://localhost:4000");
app.Run();

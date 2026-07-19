using System.Globalization;
using System.Security.Claims;
using System.Text;
using Job_Tracker.Server.DAL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Job_Tracker.Server.Controllers
{
    [ApiController]
    [Route("api/export")]
    [Authorize]
    public class ExportController : ControllerBase
    {
        private readonly IApplicationRepository _applicationRepository;

        public ExportController(IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("applications/csv")]
        public async Task<IActionResult> ExportApplicationsCsv()
        {
            var applications = await _applicationRepository.GetAllByUserIdAsync(GetCurrentUserId());

            var csv = new StringBuilder();
            csv.AppendLine("Company,Job Title,Stage,Location,Salary Min,Salary Max,Applied On,Created At");

            foreach (var a in applications)
            {
                var fields = new[]
                {
                    EscapeCsvField(a.CompanyName),
                    EscapeCsvField(a.JobTitle),
                    EscapeCsvField(a.Stage.ToString()),
                    EscapeCsvField(a.Location),
                    a.SalaryMin?.ToString(CultureInfo.InvariantCulture) ?? string.Empty,
                    a.SalaryMax?.ToString(CultureInfo.InvariantCulture) ?? string.Empty,
                    a.AppliedOn?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                    a.CreatedAt.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)
                };
                csv.AppendLine(string.Join(",", fields));
            }

            return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", "applications-export.csv");
        }

        private static string EscapeCsvField(string? field)
        {
            if (string.IsNullOrEmpty(field))
            {
                return string.Empty;
            }

            if (field.Contains(',') || field.Contains('"') || field.Contains('\n'))
            {
                return $"\"{field.Replace("\"", "\"\"")}\"";
            }

            return field;
        }
    }
}

using System.Text;
using System.Text.Json;

namespace Common.Services
{
    public class LoggingService
    {
        private readonly HttpClient _httpClient;

        public LoggingService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> LogMessageAsync(string message)
        {
            try
            {
                var logEntry = new LogEntry { Message = message };
                var json = JsonSerializer.Serialize(logEntry);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("https://localhost:7226/logs", content);

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro criando log: {ex.Message}");
                return false;
            }
        }

        private class LogEntry
        {
            public string Message { get; set; }
        }
    }
}

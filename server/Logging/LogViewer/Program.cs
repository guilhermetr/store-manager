using Newtonsoft.Json;

namespace LogViewer
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var client = new HttpClient();
            var response = await client.GetAsync("https://localhost:7226/logs");
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var logs = JsonConvert.DeserializeObject<LogEntry[]>(content);
                Console.WriteLine("Logs:");
                foreach (var log in logs)
                {
                    Console.WriteLine($"{log.Timestamp} - {log.Message}");
                }
            }
            else
            {
                Console.WriteLine($"Erro ao obter logs: {response.ReasonPhrase}");
            }
        }
    }

    public class LogEntry
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}

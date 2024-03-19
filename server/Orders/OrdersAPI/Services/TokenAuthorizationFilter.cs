using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace ProductsAPI.Service.Services
{
    public class TokenAuthorizationFilter : IAsyncAuthorizationFilter
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public TokenAuthorizationFilter(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(token))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            if (!await ValidateToken(token))
            {
                context.Result = new UnauthorizedResult();
                return;
            }
        }

        private async Task<bool> ValidateToken(string token)
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var content = new StringContent(JsonConvert.SerializeObject(token), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("http://localhost:5098/auth/validate", content);

            return response.IsSuccessStatusCode;
        }

    }
}

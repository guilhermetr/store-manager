using System;
using System.Collections.Concurrent;
using System.Net;
using System.Threading.Tasks;

namespace AuthenticationService.Services
{
    public class IpAddressLockService
    {
        private static readonly ConcurrentDictionary<IPAddress, int> FailedAttempts = new ConcurrentDictionary<IPAddress, int>();
        private static readonly ConcurrentDictionary<IPAddress, DateTime> BlockedAddresses = new ConcurrentDictionary<IPAddress, DateTime>();

        private readonly IConfiguration _config;
        private readonly int MaxFailedAttempts;
        private readonly int BlockDurationMinutes;

        public IpAddressLockService(IConfiguration config)
        {
            _config = config;
            MaxFailedAttempts = _config.GetValue<int>("IpAddressLockSettings:MaxFailedAttempts");
            BlockDurationMinutes = _config.GetValue<int>("IpAddressLockSettings:BlockDurationMinutes");
        }

        public bool IsIpAddressBlocked(IPAddress ipAddress)
        {
            if (BlockedAddresses.TryGetValue(ipAddress, out DateTime blockEndTime))
            {
                if (blockEndTime > DateTime.UtcNow)
                {
                    return true;
                }
                else
                {
                    BlockedAddresses.TryRemove(ipAddress, out _);
                    FailedAttempts.TryRemove(ipAddress, out _);
                }
            }
            return false;
        }

        public bool AddFailedAttempt(IPAddress ipAddress)
        {
            if (!FailedAttempts.ContainsKey(ipAddress))
            {
                FailedAttempts[ipAddress] = 1;
            }
            else
            {
                FailedAttempts[ipAddress]++;
                if (FailedAttempts[ipAddress] >= MaxFailedAttempts)
                {
                    BlockedAddresses[ipAddress] = DateTime.UtcNow.AddMinutes(BlockDurationMinutes);
                    FailedAttempts.TryRemove(ipAddress, out _);
                    return true;
                }
            }
            return false;
        }

        public void ResetFailedAttempts(IPAddress ipAddress)
        {
            if (FailedAttempts.ContainsKey(ipAddress))
            {
                FailedAttempts.TryRemove(ipAddress, out _);
            }
        }
    }
}

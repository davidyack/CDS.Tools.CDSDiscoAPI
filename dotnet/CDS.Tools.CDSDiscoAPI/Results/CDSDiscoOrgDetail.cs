using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CDS.Tools.DiscoAPI.Results
{
    public class CDSDiscoOrgDetail
    {
        public Guid Id { get; set; }
        public string UniqueName { get; set; }
        public string UrlName { get; set; }
        public string FriendlyName { get; set; }
        public string State { get; set; }
        public string Version { get; set; }
        public string Url { get; set; }
        public string ApiUrl { get; set; }
        public DateTime LastUpdated { get; set; }
        public string EnvironmentId { get; set; }
        public bool IsUserSysAdmin { get; set; }
        public Guid TenantId { get; set; }

        public DateTime TrialExpirationDate { get; set; }

        public string Region { get; set; }

    }
}

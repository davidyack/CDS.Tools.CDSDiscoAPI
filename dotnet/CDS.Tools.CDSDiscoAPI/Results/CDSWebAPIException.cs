using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CDS.Tools.DiscoAPI.Results
{
    public class CDSWebAPIException : HttpRequestException
    {
        public CDSWebAPIException(string message) : base(message)
        {

        }
        public string JSON { get; set; }
    }
}

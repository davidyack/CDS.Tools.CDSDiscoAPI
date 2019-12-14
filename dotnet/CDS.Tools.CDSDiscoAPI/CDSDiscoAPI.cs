// =====================================================================
//  File:		CDSDiscoAPI
//  Summary:	Helper library for working with CRM Disco API
// =====================================================================
// 
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
// 
//  Any use or other rights related to this source code, resulting object code or 
//  related artifacts are controlled the prevailing EULA in effect. See the EULA
//  for detail rights. In the event no EULA was provided contact copyright holder
//  for a current copy.
//
// =====================================================================
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using CDS.Tools.DiscoAPI.Results;
using System.Diagnostics;

namespace CDS.Tools.DiscoAPI
{
    public class CDSDiscoAPI
    {
        private HttpClient _httpClient = null;
        private string _apiUrl = string.Empty;
        private string _AccessToken = string.Empty;
        private Func<string, Task<string>> _getAccessToken = null;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="apiUrl">CRM API base URL e.g. https://globaldisco.crm.dynamics.com/api/discovery/v1.0/ </param>
        /// <param name="accessToken">allows for hard coded access token for testing</param>
     
        /// <param name="getAccessToken">method to call to refresh access token, called before each use of token</param>
        public CDSDiscoAPI(string apiUrl, string accessToken, Func<string, Task<string>> getAccessToken = null)
        {
            _apiUrl = apiUrl;
            _httpClient = new HttpClient();
            _AccessToken = accessToken;
            _getAccessToken = getAccessToken;
            _httpClient.DefaultRequestHeaders.Authorization =
               new AuthenticationHeaderValue("Bearer", accessToken);
            SetHttpClientDefaults();
        }

        /// <summary>
        /// On-premise Active Directory with Credentials
        /// </summary>
        /// <param name="apiUrl"></param>
        /// <param name="networkCredential"></param>
        public CDSDiscoAPI(string apiUrl, NetworkCredential networkCredential = null)
        {
            _apiUrl = apiUrl;

            if (networkCredential != null)
                _httpClient = new HttpClient(new HttpClientHandler() { Credentials = networkCredential });
            else
                _httpClient = new HttpClient();

            SetHttpClientDefaults();
        }
        
        public async Task<CDSDiscoOrgDetailList> GetInstances()
        {
            await CheckAuthToken();

            string fullUrl = this._apiUrl + "Instances";
            HttpRequestMessage request = new HttpRequestMessage(new HttpMethod("GET"), fullUrl);

            var results = await _httpClient.SendAsync(request);
                        
            EnsureSuccessStatusCode(results);
            var data = await results.Content.ReadAsStringAsync();
            CDSDiscoOrgDetailList resultList = new CDSDiscoOrgDetailList();
            resultList.List = new List<CDSDiscoOrgDetail>();
            
            var values = JObject.Parse(data);
            var valueList = values["value"].ToList();
            foreach (var value in valueList)
            {
                try
                {
                    resultList.List.Add(value.ToObject<CDSDiscoOrgDetail>());
                }
                catch(Exception ex)
                {
                    
                }
            }
            var nextLink = values["@odata.nextLink"];
            var recordCount = values["@odata.count"];
            if (recordCount != null)
                resultList.Count = int.Parse(recordCount.ToString());
            while (nextLink != null)
            {
                var nextResults = await _httpClient.GetAsync(nextLink.ToString());
                EnsureSuccessStatusCode(nextResults);
                var nextData = await nextResults.Content.ReadAsStringAsync();

                var nextValues = JObject.Parse(nextData);
                var nextValueList = nextValues["value"].ToList();
                foreach (var nextvalue in nextValueList)
                    resultList.List.Add(nextvalue.ToObject<CDSDiscoOrgDetail>());                
                nextLink = nextValues["@odata.nextLink"];
            }

            return resultList;
        }
       
        
        public async Task<CDSDiscoOrgDetail> Get(Guid orgId)
        {
            await CheckAuthToken();

            string fullUrl = string.Empty;
           
            fullUrl = this._apiUrl + "Instances(" + orgId.ToString()+")";

            HttpRequestMessage request = new HttpRequestMessage(new HttpMethod("GET"), fullUrl);

            
            var results = await _httpClient.SendAsync(request);
            
            EnsureSuccessStatusCode(results);
            var data = await results.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<CDSDiscoOrgDetail>(data);
        }
        public async Task<CDSDiscoOrgDetail> Get(string uniqueName)
        {
            await CheckAuthToken();

            string fullUrl = string.Empty;
            
            fullUrl = this._apiUrl + "Instances(UniqueName='" + uniqueName + "')";
           
            HttpRequestMessage request = new HttpRequestMessage(new HttpMethod("GET"), fullUrl);


            var results = await _httpClient.SendAsync(request);

            EnsureSuccessStatusCode(results);
            var data = await results.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<CDSDiscoOrgDetail>(data);
        }

        /// <summary>
        /// helper function to make sure token refresh happens as needed if refresh method provided
        /// </summary>
        private async Task<string> CheckAuthToken()
        {
            if (_getAccessToken == null)
                return _AccessToken;
            var newToken = await _getAccessToken(_apiUrl);
            if (newToken != _AccessToken)
            {
                _httpClient.DefaultRequestHeaders.Remove("Authorization");
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", newToken);
                _AccessToken = newToken;
            }
            return _AccessToken;
        }
        /// <summary>
        /// helper method to setup the httpclient defaults
        /// </summary>
        /// <param name="callerID"></param>
        private void SetHttpClientDefaults()
        {
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            _httpClient.DefaultRequestHeaders.Add("OData-MaxVersion", "4.0");
            _httpClient.DefaultRequestHeaders.Add("OData-Version", "4.0");
            // _httpClient.DefaultRequestHeaders.Add("Prefer", "odata.maxpagesize=3");
          
            _httpClient.Timeout = new TimeSpan(0, 2, 0);
        }

        
        /// <summary>
        /// Helper method to check the response status and generate a well formatted error
        /// </summary>
        /// <param name="response"></param>
        private static void EnsureSuccessStatusCode(HttpResponseMessage response,string jsonData = null)
        {
            if (response.IsSuccessStatusCode)
                return;

            string message = String.Empty;            

            string errorData = response.Content.ReadAsStringAsync().Result;

            if (response.Content.Headers.ContentType.MediaType.Equals("text/plain"))
            {
                message = errorData;
            }
            else if (response.Content.Headers.ContentType.MediaType.Equals("application/json"))
            {
                JObject jcontent = (JObject)JsonConvert.DeserializeObject(errorData);
                IDictionary<string, JToken> d = jcontent;
                
                if (d.ContainsKey("error"))
                {
                    JObject error = (JObject)jcontent.Property("error").Value;
                    message = (String)error.Property("message").Value;
                }
                else if (d.ContainsKey("Message"))
                    message = (String)jcontent.Property("Message").Value;


            }
            else if (response.Content.Headers.ContentType.MediaType.Equals("text/html"))
            {
                message = "HTML Error Content:";
                message += "\n\n" + errorData;
            }
            else
            {
                message = String.Format("Error occurred and no handler is available for content in the {0} format.",
                    response.Content.Headers.ContentType.MediaType.ToString());
            }

            var exception = new CDS.Tools.DiscoAPI.Results.CDSWebAPIException(message);

            if (jsonData != null)
                exception.JSON = jsonData;
            
            throw exception;

        }

    }
}

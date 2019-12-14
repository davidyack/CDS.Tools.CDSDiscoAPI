using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;


namespace CDS.Tools.DiscoAPITest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void  TestMethod1()
        {
            Task.Run(async () =>
            {
                string token = "";

                CDS.Tools.DiscoAPI.CDSDiscoAPI api = new DiscoAPI.CDSDiscoAPI("https://globaldisco.crm.dynamics.com/api/discovery/v2.0/", token);
                var results = await api.GetInstances();
                foreach(var org in results.List)
                {
                   
                    var getByID = await api.Get( org.Id);
                    var getByName = await api.Get(org.UniqueName);
   
                }

            }).Wait();

        }
    }
}

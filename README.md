# CDS.Tools.CDSDiscoAPI
This is an API helper for working with CDS/Dynamics 365 Global Discovery API

Applications should use the Discovery Service to avoid hard coding and to allow working with multiple subscriptions

Usage:
```
    CDS.Tools.DiscoAPI.CDSDiscoAPI api = 
        new DiscoAPI.CDSDiscoAPI("https://globaldisco.crm.dynamics.com/api/discovery/v2.0/",token);
    var results = await api.GetInstances();
    foreach(var org in results.List)
    {                   
         var getByID = await api.Get( org.Id);
         var getByName = await api.Get(org.UniqueName);
    }
```

import * as cdsapi from '../../lib/cdsdiscoapi'

class CallDisco {
    public static main(): any {
        console.log('Starting ');

        var config = new cdsapi.cdsdiscoapiconfig();

        config.APIUrl = 'https://globaldisco.crm.dynamics.com/api/discovery/v2.0/';
        config.AccessToken = '';


        var api = new cdsapi.cdsdiscoapi(config);

        api.GetInstances().then(function(results){
                console.log(results)
                
        },function(error){ console.log(error)});
    
        api.Get(null,"org3c268c23").then(function(result){console.log(result)});

        api.Get('d5a9da56-2184-41aa-8bd7-df3b5394fd12',null).then(function(result){console.log(result)});
        
        return 0;
    }
}

CallDisco.main();
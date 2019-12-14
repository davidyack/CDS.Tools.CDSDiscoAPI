"use strict";
exports.__esModule = true;
var cdsapi = require("../../lib/cdsdiscoapi");
var CallDisco = /** @class */ (function () {
    function CallDisco() {
    }
    CallDisco.main = function () {
        console.log('Starting ');
        var config = new cdsapi.cdsdiscoapiconfig();
        config.APIUrl = 'https://globaldisco.crm.dynamics.com/api/discovery/v2.0/';
        config.AccessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiJodHRwczovL2Rpc2NvLmNybS5keW5hbWljcy5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvODA1MDhiOTctMDY0Mi00NTRhLWExNjAtZjA1YzdlYjFiNDVlLyIsImlhdCI6MTU3NjM0ODU1NywibmJmIjoxNTc2MzQ4NTU3LCJleHAiOjE1NzYzNTI0NTcsImFjciI6IjEiLCJhaW8iOiI0MlZnWUxqMy9ZT21nc2xNMGNlL2UrK1hkOVE3L3QwKzhWTzZaNWF3cTlGQ0crYmFWM3NCIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6ImVjMWFhN2FkLWRhZWMtNDhlZi04NTM4LWFkMjdmY2QzNzAyOCIsImFwcGlkYWNyIjoiMSIsImRldmljZWlkIjoiNGFiZDQwNWItODk0Zi00NGM2LTgzNzAtNGMwYWI2NjA5YjAzIiwiZmFtaWx5X25hbWUiOiJZYWNrIiwiZ2l2ZW5fbmFtZSI6IkRhdmlkIiwiaXBhZGRyIjoiNjcuMTY1LjIxMy4xNzMiLCJuYW1lIjoiRGF2aWQgWWFjayIsIm9pZCI6ImJlN2VmMDdjLThjMDItNDVhNy1hYTE4LWJlZmMyYjM2MTQyNiIsInB1aWQiOiIxMDAzQkZGRDgwOUJFMDk2Iiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiSUhEcHhlU0w5ME8wMVhGQUdoS1hkN3hubjNqeUVFV0UwRDZQTHJUaFNZNCIsInRpZCI6IjgwNTA4Yjk3LTA2NDItNDU0YS1hMTYwLWYwNWM3ZWIxYjQ1ZSIsInVuaXF1ZV9uYW1lIjoiZHlhY2tAY29sb3JhZG90Yy5jb20iLCJ1cG4iOiJkeWFja0Bjb2xvcmFkb3RjLmNvbSIsInV0aSI6InZPZnhVVVRqd1VXaklndVhodUlnQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCJdfQ.KUm2A-3nRX1iEcPizPjPdw_hV1SRAI4eS_93w-6AeG6_GrxC-kGBhuGS7cnRYVAOs49ipPMJAOC2iFR58ewhjAfe-70WDEU60eWYC1i_5qqV5CwNmlTVmO5stAnD07wRBgjx39CHm5Vi7nqPrcRmU40l3o_PXVdXkNvjQfZ-ahjvr8zaYLueb_yXs-7WjsjB83nvC0R8Nl0E3XaKFGSwVD9LMgrwDjo8f46sOmouqLopUyl2pNFA2dHTJfBWtirhzbVZoJ5cRshe0CkrSKuywxCDRiBFnCMZ_KsPGs-7yHGARD1ovTlz0Uz5HHBxjxnR7gJ30D1-fUOCt30zED0Bsw';
        var api = new cdsapi.cdsdiscoapi(config);
        api.GetInstances().then(function (results) {
            console.log(results);
        }, function (error) { console.log(error); });
        api.Get(null, "org3c268c23").then(function (result) { console.log(result); });
        api.Get('d5a9da56-2184-41aa-8bd7-df3b5394fd12', null).then(function (result) { console.log(result); });
        return 0;
    };
    return CallDisco;
}());
CallDisco.main();

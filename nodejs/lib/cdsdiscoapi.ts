
export class cdsdiscoapiconfig  {
    APIUrl: string;
    AccessToken?: string;
};

export class cdsdiscoorgdetaillist  {
   List:cdsdiscoorgdetail[];
   Count:number;
};
export class cdsdiscoorgdetail  {
    Id: string;
    UniqueName: string;
    UrlName:string;
    FriendlyName:string;
    State:string;
    Version:string;
    Url:string;
    ApiUrl:string;
    LastUpdated:string;
};

export class cdsdiscoapi {
    private config: cdsdiscoapiconfig;
    private node: boolean;
    private https: any;
    private urllib: any;
    private _GetHttpRequest: any;

    constructor(config: cdsdiscoapiconfig) {
        this.config = config;

        if (typeof module !== "undefined" && module.exports) {
            this.node = true;
            this.https = require("https");
            this.urllib = require("url");
            this._GetHttpRequest = this._GetHttpRequestHTTPS;
        } else {
            this.node = false;
            this._GetHttpRequest = this._GetHttpRequestXMLHTTPRequest;
        }
    }

    private _restParam(func: Function, startIndex: number): any {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function () {
            let length = Math.max(arguments.length - startIndex, 0);
            let rest = Array(length);
            for (let index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0:
                    return func.call(this, rest);
                case 1:
                    return func.call(this, arguments[0], rest);
            }
        };
    }

    private whilst(test: Function, iterator: any, callback: Function): any {
        if (test()) {
            const next = this._restParam(function (err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback.apply(null, [null].concat(args));
                }
            }, null);
            iterator(next);
        } else {
            callback(null);
        }
    }

    public GetInstances(): Promise<cdsdiscoorgdetaillist> {
        return new Promise((resolve, reject) => {
            const url = this.config.APIUrl + 'Instances';
            this._GetHttpRequest("GET", url, {
                "headers": this._BuildQueryHeaders()
            }, (err, res) => {
                if (err !== false) {
                    reject(res);
                } else {
                    let data = JSON.parse(res.response, this._DateReviver);
                    let nextLink = data["@odata.nextLink"];
                    let response = {
                        List: data.value,
                        Count: data.value.length
                    };
                    
                    if (nextLink === "undefined") {
                        resolve(response);
                    } else {
                        this.whilst(() => {
                            return (nextLink !== undefined);
                        }, callback => {
                            this._GetHttpRequest("GET", nextLink, {
                                "headers": this._BuildQueryHeaders()
                            }, function (err, res) {
                                if (err === false) {
                                    data = JSON.parse(res.response, this._DateReviver);
                                    nextLink = data["@odata.nextLink"];
                                    response.List = response.List.concat(data.value);
                                    response.Count = response.List.length;
                            
                                    callback(null, response.List.length);
                                } else {
                                    callback("err", 0);
                                }
                            });
                        }, function (err, n) {
                            resolve(response);
                        });
                    }
                }
            });
        });
    }

    public Get( orgID: string,orgName: string): Promise<cdsdiscoorgdetail> {
        return new Promise((resolve, reject) => {
            let url = null;
            if (orgID != null) {
                url = this.config.APIUrl + "Instances" + "(" + orgID.replace(/[{}]/g, "") + ")";
            } else {
                url = this.config.APIUrl + "Instances" + "(UniqueName='" + orgName + "')";
            }
            this._GetHttpRequest(
                "GET",
                url,
                {
                    "headers": this._BuildQueryHeaders()
                },
                (err, res) => {
                    if (err !== false) {
                        reject(res);
                    } else {
                        const data = JSON.parse(res.response, this._DateReviver);
                        resolve(data);
                    }
                }
            );
        });
    }

    
   
   
    private _BuildQueryHeaders(): any {
        let headers = {};
        //if (queryOptions != null) {
        //    if (queryOptions.FormattedValues === true) {
         //       headers["Prefer"] = "odata.include-annotations=*";
         //   }
       // }
        return headers;
    }

    private parseResponseHeaders(headerStr: string): any {
        let headers = {};
        if (!headerStr) {
            return headers;
        }
        const headerPairs = headerStr.split("\u000d\u000a");
        for (let i = 0; i < headerPairs.length; i++) {
            let headerPair = headerPairs[i];
            // Can't use split() here because it does the wrong thing
            // if the header value has the string ": " in it.
            let index = headerPair.indexOf("\u003a\u0020");
            if (index > 0) {
                let key = headerPair.substring(0, index);
                let val = headerPair.substring(index + 2);
                headers[key.toLowerCase()] = val;
            }
        }
        return headers;
    }

    private _GetHttpRequestXMLHTTPRequest(method: string, url: string, payload: any, callback: Function): void {
        let req = new XMLHttpRequest();
        req.open(method, url, true);
        if (this.config.AccessToken != null) {
            req.setRequestHeader("Authorization", "Bearer " + this.config.AccessToken);
        }
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
       
        if (["POST", "PUT", "PATCH"].indexOf(method) >= 0) {
            req.setRequestHeader("Content-Length", payload.data.length);
            req.setRequestHeader("Content-Type", "application/json");
        }
        if (payload.headers !== "undefined") {
            for (let name in payload.headers) {
                req.setRequestHeader(name, payload.headers[name]);
            }
        }
        req.onreadystatechange = () => {
            if (req.readyState === 4 /* complete */) {
                req.onreadystatechange = null;
                if ((req.status >= 200) && (req.status < 305)) {
                    callback(false, {
                        "response": req.response,
                        "headers": this.parseResponseHeaders(req.getAllResponseHeaders())
                    });
                } else {
                    callback(true, this);
                }
            }
        };
        if (["POST", "PUT", "PATCH"].indexOf(method) >= 0) {
            req.send(payload.data);
        } else {
            req.send();
        }
    }

    private _GetHttpRequestHTTPS(method: string, url: string, payload: any, callback: Function): void {
        const parsed_url = this.urllib.parse(url);
        let options = {
            hostname: parsed_url.hostname,
            port: 443,
            path: parsed_url.path,
            method: method,
            headers: {
                "Accept": "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
            }
        };
        if (["POST", "PUT", "PATCH"].indexOf(method) >= 0) {
            options.headers["Content-Length"] = payload.data.length;
            options.headers["Content-Type"] = "application/json";
        }
        

        if (this.config.AccessToken != null) {
            options.headers["Authorization"] = "Bearer " + this.config.AccessToken;
        }

        if (payload.headers !== undefined) {
            for (let name in payload.headers) {
                options.headers[name] = payload.headers[name];
            }
        }

        let req = this.https.request(options, res => {
            let body = "";
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                body += chunk;
            });
            res.on("end", () => {
                if ((res.statusCode >= 200) && (res.statusCode < 305)) {
                    callback(false, {
                        "response": body,
                        "headers": res.headers
                    });
                } else {
                    callback(true, {
                        "response": body,
                        "headers": res.headers
                    });
                }
            });
        });
        req.on("error", function (err) {
            callback(true, err);
        });
        if (["POST", "PUT", "PATCH"].indexOf(method) >= 0) {
            req.write(payload.data);
        }
        req.end();
    }

    private _DateReviver(key: string, value: any): Date {
        var a;
        if (typeof value === "string") {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    }


}
/// <reference path="../typings/index.d.ts" />
"use strict";
var crmdiscoapiconfig = (function () {
    function crmdiscoapiconfig() {
    }
    return crmdiscoapiconfig;
}());
exports.crmdiscoapiconfig = crmdiscoapiconfig;
;
var crmdiscoorgdetaillist = (function () {
    function crmdiscoorgdetaillist() {
    }
    return crmdiscoorgdetaillist;
}());
exports.crmdiscoorgdetaillist = crmdiscoorgdetaillist;
;
var crmdiscoorgdetail = (function () {
    function crmdiscoorgdetail() {
    }
    return crmdiscoorgdetail;
}());
exports.crmdiscoorgdetail = crmdiscoorgdetail;
;
var crmdiscoapi = (function () {
    function crmdiscoapi(config) {
        this.config = config;
        if (typeof module !== "undefined" && module.exports) {
            this.node = true;
            this.https = require("https");
            this.urllib = require("url");
            this._GetHttpRequest = this._GetHttpRequestHTTPS;
        }
        else {
            this.node = false;
            this._GetHttpRequest = this._GetHttpRequestXMLHTTPRequest;
        }
    }
    crmdiscoapi.prototype._restParam = function (func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function () {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0:
                    return func.call(this, rest);
                case 1:
                    return func.call(this, arguments[0], rest);
            }
        };
    };
    crmdiscoapi.prototype.whilst = function (test, iterator, callback) {
        if (test()) {
            var next_1 = this._restParam(function (err, args) {
                if (err) {
                    callback(err);
                }
                else if (test.apply(this, args)) {
                    iterator(next_1);
                }
                else {
                    callback.apply(null, [null].concat(args));
                }
            }, null);
            iterator(next_1);
        }
        else {
            callback(null);
        }
    };
    crmdiscoapi.prototype.GetInstances = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = _this.config.APIUrl + 'Instances';
            _this._GetHttpRequest("GET", url, {
                "headers": _this._BuildQueryHeaders()
            }, function (err, res) {
                if (err !== false) {
                    reject(res);
                }
                else {
                    var data_1 = JSON.parse(res.response, _this._DateReviver);
                    var nextLink_1 = data_1["@odata.nextLink"];
                    var response_1 = {
                        List: data_1.value,
                        Count: data_1.value.length
                    };
                    if (nextLink_1 === "undefined") {
                        resolve(response_1);
                    }
                    else {
                        _this.whilst(function () {
                            return (nextLink_1 !== undefined);
                        }, function (callback) {
                            _this._GetHttpRequest("GET", nextLink_1, {
                                "headers": _this._BuildQueryHeaders()
                            }, function (err, res) {
                                if (err === false) {
                                    data_1 = JSON.parse(res.response, this._DateReviver);
                                    nextLink_1 = data_1["@odata.nextLink"];
                                    response_1.List = response_1.List.concat(data_1.value);
                                    response_1.Count = response_1.List.length;
                                    callback(null, response_1.List.length);
                                }
                                else {
                                    callback("err", 0);
                                }
                            });
                        }, function (err, n) {
                            resolve(response_1);
                        });
                    }
                }
            });
        });
    };
    crmdiscoapi.prototype.Get = function (orgID, orgName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = null;
            if (orgID != null) {
                url = _this.config.APIUrl + "Instances" + "(" + orgID.replace(/[{}]/g, "") + ")";
            }
            else {
                url = _this.config.APIUrl + "Instances" + "(UniqueName='" + orgName + "')";
            }
            _this._GetHttpRequest("GET", url, {
                "headers": _this._BuildQueryHeaders()
            }, function (err, res) {
                if (err !== false) {
                    reject(res);
                }
                else {
                    var data = JSON.parse(res.response, _this._DateReviver);
                    resolve(data);
                }
            });
        });
    };
    crmdiscoapi.prototype._BuildQueryHeaders = function () {
        var headers = {};
        //if (queryOptions != null) {
        //    if (queryOptions.FormattedValues === true) {
        //       headers["Prefer"] = "odata.include-annotations=*";
        //   }
        // }
        return headers;
    };
    crmdiscoapi.prototype.parseResponseHeaders = function (headerStr) {
        var headers = {};
        if (!headerStr) {
            return headers;
        }
        var headerPairs = headerStr.split("\u000d\u000a");
        for (var i = 0; i < headerPairs.length; i++) {
            var headerPair = headerPairs[i];
            // Can't use split() here because it does the wrong thing
            // if the header value has the string ": " in it.
            var index = headerPair.indexOf("\u003a\u0020");
            if (index > 0) {
                var key = headerPair.substring(0, index);
                var val = headerPair.substring(index + 2);
                headers[key.toLowerCase()] = val;
            }
        }
        return headers;
    };
    crmdiscoapi.prototype._GetHttpRequestXMLHTTPRequest = function (method, url, payload, callback) {
        var _this = this;
        var req = new XMLHttpRequest();
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
            for (var name_1 in payload.headers) {
                req.setRequestHeader(name_1, payload.headers[name_1]);
            }
        }
        req.onreadystatechange = function () {
            if (req.readyState === 4 /* complete */) {
                req.onreadystatechange = null;
                if ((req.status >= 200) && (req.status < 305)) {
                    callback(false, {
                        "response": req.response,
                        "headers": _this.parseResponseHeaders(req.getAllResponseHeaders())
                    });
                }
                else {
                    callback(true, _this);
                }
            }
        };
        if (["POST", "PUT", "PATCH"].indexOf(method) >= 0) {
            req.send(payload.data);
        }
        else {
            req.send();
        }
    };
    crmdiscoapi.prototype._GetHttpRequestHTTPS = function (method, url, payload, callback) {
        var parsed_url = this.urllib.parse(url);
        var options = {
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
            for (var name_2 in payload.headers) {
                options.headers[name_2] = payload.headers[name_2];
            }
        }
        var req = this.https.request(options, function (res) {
            var body = "";
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                body += chunk;
            });
            res.on("end", function () {
                if ((res.statusCode >= 200) && (res.statusCode < 305)) {
                    callback(false, {
                        "response": body,
                        "headers": res.headers
                    });
                }
                else {
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
    };
    crmdiscoapi.prototype._DateReviver = function (key, value) {
        var a;
        if (typeof value === "string") {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    };
    return crmdiscoapi;
}());
exports.crmdiscoapi = crmdiscoapi;
//# sourceMappingURL=crmdiscoapi.js.map
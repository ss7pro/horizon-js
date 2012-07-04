/*
The MIT License

Copyright (c) 2012 Universidad Politecnica de Madrid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JSTACK API
// ----------

// JSTACK API is an implementation of OpenStack API in JavaScript
// that enables the use of its components (Keystone, Nova, ...) in
// web applications.

// It also provides command line access through a Node.js package.

var JSTACK = JSTACK || {};

// Current version is **0.1**.

JSTACK.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
JSTACK.AUTHORS = 'GING';
/*
The MIT License

Copyright (c) 2012 Universidad Politecnica de Madrid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JSTACK Communication Module
// ---------------------------

// This module provides functions to send GET, POST, PUT and DELETE HTTP requests
// to OpenStack components. It is compatible with the token-based authentication
// proposed by Keystone.

JSTACK.Comm = (function (JS, undefined) {
    "use strict";

    var send, get, post, put, del, ordinaryreq;

    // Private functions
    // -----------------

    // Function `_send` is internally used to make detailed low-level requests
    // to components.
    send = function (method, url, data, token, callBackOK, callBackError) {
        var xhr, body, result;

        // This function receives a `method` that can be "GET", "POST", "PUT", or
        // "DELETE". It also receives the `url` to which it has to send the request,
        // the `data` to be sent, that has to be a JSON object, the ´token´ to
        // authenticate the request, and success and error callbacks.
        xhr = new XMLHttpRequest();

        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {
                switch (xhr.status) {

                // In case of successful response it calls the `callbackOK` function.
                case 100:
                case 200:
                case 201:
                case 202:
                case 203:
                case 204:
                case 205:
                    result = undefined;
                    if (xhr.responseText !== undefined && xhr.responseText !== '') {
                            result = JSON.parse(xhr.responseText);
                    }
                    callBackOK(result, xhr.status, xhr);
                    break;

                // In case of error it sends an error message to `callbackError`.
                default:
                    result = undefined;
                    if (xhr.responseText !== undefined && xhr.responseText !== '') {
                            if (xhr.status == 404)
                                result = xhr.responseText;
                            else 
                                result = JSON.parse(xhr.responseText);
                    }
                    callBackError(result, xhr.status, xhr);
                    break;
                }
            }
        };

        if (token !== undefined) {
            xhr.setRequestHeader('X-Auth-Token', token);
        }

        if (data !== undefined) {
            body = JSON.stringify(data);
            xhr.send(body);
        } else {
            xhr.send();
        }
    };

    // Public functions
    // ----------------

    // * Function *get* receives the `url`, the authentication token
    // (which is optional), and callbacks. It sends a HTTP GET request,
    // so it does not send any data.
    get = function (url, token, callbackOK, callbackError) {
        send("GET", url, undefined, token, callbackOK, callbackError);
    };
    // * Function *post* receives the `url`, the authentication token
    // (which is optional), the data to be sent (a JSON Object), and
    // callbacks. It sends a HTTP POST request.
    post = function (url, data, token, callbackOK, callbackError) {
        send("POST", url, data, token, callbackOK, callbackError);
    };
    // * Function *put* receives the same parameters as post. It sends
    // a HTTP PUT request.
    put = function (url, data, token, callbackOK, callbackError) {
        send("PUT", url, data, token, callbackOK, callbackError);
    };
    // * Function *del* receives the same paramaters as get. It sends a
    // HTTP DELETE request.
    del = function (url, token, callbackOK, callbackError) {
        send("DELETE", url, undefined, token, callbackOK, callbackError);
    };
    // ordinaryreq
    ordinaryreq = function (type, url, data, callback) {
        var url, onOK, onError, reqData = {};

        if (callback !== undefined && callback.hasOwnProperty("reqId")) {
            reqData = {reqId: callback.reqId};
        }
        onOK = function (result, status, xhr) {
            if (callback !== undefined && callback.success !== undefined) {
                if (callback.hasOwnProperty("reqId"))
                    callback.success(result, status, xhr, reqData);
                else
                    callback.success(result, status, xhr);
            }
        };
        onError = function (result, status, xhr) {
            if (callback !== undefined && callback.error !== undefined) {
                if (callback.hasOwnProperty("reqId"))
                    callback.error(result, status, xhr, reqData);
                else
                    callback.error(result, status, xhr);
            }
        };

        switch (type) {
            case "get":
                JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
                break;
            case "del":
                JS.Comm.del(url, JS.Keystone.params.token, onOK, onError);
                break;
            case "post":
                JS.Comm.post(url, data, JS.Keystone.params.token, onOK,
                                onError);
                break;
            case "put":
                JS.Comm.put(url, data, JS.Keystone.params.token, onOK,
                                onError);
                break;
            case "default":
                throw new Error("Unknown oridinary request type");
                break;
        };
    };
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {

        // Functions:
        get : get,
        post : post,
        put : put,
        del : del,
        ordinaryreq : ordinaryreq
    };
}(JSTACK));
/*
 The MIT License

 Copyright (c) 2012 Universidad Politecnica de Madrid

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

JSTACK.Utils = (function(JS, undefined) {

    "use strict";

    var keyStr, utf8_encode, utf8_decode, encode, decode;

    // private property
    keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // private method for UTF-8 encoding
    utf8_encode = function (string) {
        var utftext = "", n, c;

        string = string.replace(/\r\n/g, "\n");

        for (n = 0; n < string.length; n = n + 1) {

            c = string.charCodeAt(n);

            if (c < 128) {
                utftext = utftext + String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext = utftext + String.fromCharCode((c >> 6) | 192);
                utftext = utftext + String.fromCharCode((c & 63) | 128);
            } else {
                utftext = utftext + String.fromCharCode((c >> 12) | 224);
                utftext = utftext + String.fromCharCode(((c >> 6) & 63) | 128);
                utftext = utftext + String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    // private method for UTF-8 decoding
    utf8_decode = function (utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0, c3 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string = string + String.fromCharCode(c);
                i = i + 1;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string = string + String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i = i + 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i = i + 3;
            }

        }
        return string;
    };

    // public method for encoding
    encode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i = i + 1);
            chr2 = input.charCodeAt(i = i + 1);
            chr3 = input.charCodeAt(i = i + 1);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + JS.Utils.keyStr.charAt(enc1) + Base64.keyStr.charAt(enc2) + JS.Utils.keyStr.charAt(enc3) + Base64.keyStr.charAt(enc4);

        }

        return output;
    };

    // public method for decoding
    decode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = JS.Utils.keyStr.indexOf(input.charAt(i = i + 1));
            enc2 = JS.Utils.keyStr.indexOf(input.charAt(i = i + 1));
            enc3 = JS.Utils.keyStr.indexOf(input.charAt(i = i + 1));
            enc4 = JS.Utils.keyStr.indexOf(input.charAt(i = i + 1));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = utf8_decode(output);

        return output;
    };

    return {
        encode : encode,
        decode : decode
    };
}(JSTACK));/*
The MIT License

Copyright (c) 2012 Universidad Politecnica de Madrid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Keystone API Module
// -------------------

// This file provides functions to access Keystone API's operations,
// such as authenticate and  gettenants.

JSTACK.Keystone = (function (JS, undefined) {

    "use strict";

    var params, STATES, init, authenticate, gettenants, getservicelist,
            getservice, getregionlist, getserviceendpoint;

    // `STATES` defines different authentication states. This
    // can be useful for applications to know when they can
    // access to authentication tokens.

    STATES = {
        DISCONNECTED : 0,
        AUTHENTICATING : 1,
        AUTHENTICATED : 2,
        AUTHENTICATION_ERROR : 3
    };

    // `params` stores info about Keystone service:
    params = {
        // * **url** points to Keystone location. Typically it could be http://host:5000/
        url : undefined,
        // * **currentstate** stores the state of this API based on options given by `STATES`
        currentstate : undefined,
        // * **access** stores the last information retreived during last successful authentication
        access : undefined,
        // * **token** gives the authentication info obtained during last successful authentication
        token : undefined,
        region : undefined
    };

    // We need to initialize this API by passing the Keystone's URL. This URL usually follows the next
    // pattern: http://host:5000/
    // This API will initialize parameters such as `currentstate`, `token` and `access`.
    init = function (keystoneUrl) {
        params.url = keystoneUrl;
        params.access = undefined;
        params.token = undefined;
        params.currentstate = STATES.DISCONNECTED;
    };
    // Authentication function
    // ------------------------
    // This API offers Keystone authentication.
    authenticate = function (username, password, token, tenant, callback, error) {
        var credentials = {}, onOK, onError;
        // This authentication needs a `username`, a `password`. Or a `token`.
        if (token !== undefined) {
            credentials = {
                "auth" : {
                    "token" : {
                        "id" : token
                    }
                }
            };
        } else {
            credentials = {
                "auth" : {
                    "passwordCredentials" : {
                        "username" : username,
                        "password" : password
                    }
                }
            };
        }

        // User also can provide a `tenant`.
        if (tenant !== undefined) {
            credentials.auth.tenantId = tenant;
        }

        // During authentication the state will be `AUTHENTICATION`.
        params.currentstate = STATES.AUTHENTICATING;

        // Once Keystone server sends a response to this API client it will call the function
        // `callback` with the result, if provided. It also updates the state to `AUTHENTICATED`
        // and stores result in `access`.
        onOK = function (result) {
            params.currentstate = JS.Keystone.STATES.AUTHENTICATED;
	    if (result !== undefined) {
                params.access = result.access;
                params.token = params.access.token.id;
	    } else {
		params.access = undefined;
                params.token = undefined;
	    }
            if (callback !== undefined) {
                callback(result);
            }
        };

        // In case of an error the state will be `AUTHENTICATION_ERROR` and it throws the corresponding
        // error with its description.
        onError = function (message) {
            params.currentstate = STATES.AUTHENTICATION_ERROR;
            error(message);
        };

        // A typical response would be:
        //
        //     {
        //        "token": {
        //            "expires": "2012-03-10T15:41:58.905480",
        //            "id": "d1eb612e-24fa-48b3-93d4-fc6c90379078",
        //            "tenant": {
        //                "id": "2",
        //                "name": "demo"
        //            }
        //        },
        //        "serviceCatalog": [
        //              {
        //                "endpoints": [
        //                    {
        //                        "adminURL": "http://host.name:8774/v1.1/2",
        //                        "region": "nova",
        //                        "internalURL": "http://host.name:8774/v1.1/2",
        //                        "publicURL": "http://host.name:80/v1.1/2"
        //                    }
        //                ],
        //                "type": "compute",
        //                "name": "nova"
        //            },
        //        ],
        //        "user": {
        //            "id": "1",
        //            "roles": [
        //                {
        //                    "tenantId": "2",
        //                    "id": "1",
        //                    "name": "Admin"
        //                },
        //                {
        //                    "id": "1",
        //                    "name": "Admin"
        //                },
        //            ],
        //            "name": "admin"
        //        }
        //       }
        JS.Comm.post(params.url + "tokens", credentials, undefined, onOK, onError);
    };

    // Retreiving service information
    // ------------------------------
    // The user can also obtain information about each service which is configured in Keystone.
    getservice = function (name) {
        var index, service;

        // Only if the client is currently authenticated.
        if (params.currentstate !== STATES.AUTHENTICATED) {
            return undefined;
        }

        for (index in params.access.serviceCatalog) {
            if (params.access.serviceCatalog[index] !== undefined) {
                service = params.access.serviceCatalog[index];
                if (name === service.type) {
                    // This function will return an object with the next structure:
                    //
                    //     service: {
                    //          endpoints: [
                    //               {
                    //               adminURL: "http://host.name:8774/v1.1/2",
                    //               internalURL: "http://host.name:8774/v1.1/2",
                    //               publicURL: "http://host.name:80/v1.1/2",
                    //               region: "nova"
                    //               },
                    //               name: "nova",
                    //               type: "compute"
                    //          ]
                    //     }
                    //
                    return service;
                }
            }
        }
        return undefined;
    };
    // Retreiving service information
    // ------------------------------
    // The user can also obtain information about each service which is configured in Keystone.
    getserviceendpoint = function (name) {
        var service = JS.Keystone.getservice(name);
        //if regions name is provided chose appropriate endpoint
        if (this.params.region !== undefined) {
            for (var eindex in service.endpoints) {
                if (service.endpoints[eindex].region == this.params.region) {
                    return service.endpoints[eindex];
                }
            }
        } else {
            return service.endpoints[0];
        }
        return undefined;
    };

    // The user can also obtain information about all services configured in Keystone.
    getservicelist = function () {
        // Only if the client is currently authenticated.
        if (params.currentstate !== STATES.AUTHENTICATED) {
            return undefined;
        }
        return params.access.serviceCatalog;
    };

    // The user can also obtain information about all regions in Keystone
    getregionlist = function () {
        // Only if the client is currently authenticated.
        if (params.currentstate !== STATES.AUTHENTICATED) {
            return undefined;
        }
        var regions = {};
        for (var sindex in params.access.serviceCatalog) {
            for (var eindex in params.access.serviceCatalog[sindex].endpoints) {
                var regionName = params.access.serviceCatalog[sindex].endpoints[eindex].region;
                regions[regionName] = 1;
                
            }
        }
        var list = [];
        for (var rindex in regions) {
            var region = {"name" : rindex};
            list.push(region);
        }
        return(list);
    };

    // Tenant information function
    // ---------------------------
    // User can obtain information about available tenants.
    gettenants = function (callback) {
        var onOK, onError;

        // Only when the user is already authenticated.
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            // This function will return tenant information following next pattern:
            //
            //         tenants: {
            //                links: [
            //                        {       href: "http://host.name:5000/tenants",
            //                                rel: "prev"
            //                        }
            //                ],
            //                values: [
            //                        {
            //                                description: "test",
            //                                enabled: true,
            //                                id: "3",
            //                                name: "test"
            //                        },
            //                        {
            //                                description: "None",
            //                                enabled: true,
            //                                id: "2",
            //                                name: "demo"
            //                        },
            //                        {
            //                                description: "None",
            //                                enabled: true,
            //                                id: "1",
            //                                name: "admin"
            //                        }
            //                ]
            //         }
            //
            onOK = function (result) {
                if (callback !== undefined) {
                    callback(result);
                }
            };

            onError = function (result) {
                // If error occurs it will send its description.
                throw new Error(result);
            };

            JS.Comm.get(params.url + "tenants", params.token, onOK, onError);
        }
    };

    // Public Functions and Variables
    // ---------------------------
    // This is the list of available public functions and variables
    return {
        // Variables:
        STATES : STATES,
        params : params,
        // Functions:
        init : init,
        authenticate : authenticate,
        gettenants : gettenants,
        getservice : getservice,
        getservicelist : getservicelist,
        getregionlist : getregionlist,
        getserviceendpoint: getserviceendpoint
    };
}(JSTACK));/*
The MIT License

Copyright (c) 2012 Universidad Politecnica de Madrid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JStack Nova Module
// ------------------

// This module provides Nova API functions.
JSTACK.Nova = (function (JS, undefined) {
    "use strict";

    var ordinaryreq, params, check, postAction, getserverlist, getserverdetail,
        getserverips, updateserver, createserver, deleteserver,
        changepasswordserver, rebootserverhard, rebootserversoft,
        resizeserver, confirmresizedserver, revertresizedserver, startserver,
        stopserver, pauseserver,
        unpauseserver, suspendserver, resumeserver, createimage,
        getflavorlist, getflavordetail, createflavor, deleteflavor,
        getimagelist, getimagedetail, deleteimage,
        getkeypairlist, createkeypair, deletekeypair, getsecgrouplist,
        delsecgroup, createsecgroup, addsecgrouprule, delsecgrouprule,
        getvncconsole, getconsoleoutput, getattachedvolumes, attachvolume,
        detachvolume, getattachedvolume, updatemetadata;

    // This modules stores the `url`to which it will send every
    // request.
    params = {
        url : undefined,
        state : undefined
    };

    // Private functions
    // -----------------

    // Function `_check` internally confirms that Keystone module is
    // authenticated and it has the URL of the Nova service.
    check = function () {
        if (JS.Keystone !== undefined &&
                JS.Keystone.params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            params.url = JS.Keystone.getserviceendpoint("compute").adminURL;
            return true;
        }
        return false;
    };
    ordinaryreq = function (type, url, data, callback) {
        if (!check()) {
            return;
        }
        url = params.url + url;
        JS.Comm.ordinaryreq(type, url, data, callback);
    };
    // This function is used internally to send Actions to server identified
    // with `id`. In `data` we pass the corresponding information about the
    // action.
    postAction = function (id, data, callback) {
        ordinaryreq("post", "/servers/" + id + "/action", data, callback);
    };


    // Public functions
    // ----------------
    //
    // **Server Operations**

    //
    // This operation provides a list of servers associated with the account. In
    // [Create Server List](http://docs.openstack.org/api/openstack-compute/2/content/List_Servers-d1e2078.html)
    // there is more information about the JSON object that is returned.
    getserverlist = function (detailed, allTenants, callback) {
        var url = "/servers";
        if (detailed !== undefined && detailed) {
            url += '/detail';
        }
        if (allTenants !== undefined) {
            url += '?all_tenants=' + allTenants;
        }
        ordinaryreq("get", url, undefined, callback);
    };
    // This operation returns the details of a specific server by its `id`. In
    // [Get Server Details](http://docs.openstack.org/api/openstack-compute/2/content/Get_Server_Details-d1e2623.html)
    // there is more information about the JSON object that is returned.
    getserverdetail = function (id, callback) {
        var url = "/servers/" + id;
        ordinaryreq("get", url, undefined, callback);
    };
    // This operation returns the ip address of a specific server by its `id`.
    // In
    // [List Addresses](http://docs.openstack.org/api/openstack-compute/2/content/List_Addresses-d1e3014.html)
    // and in
    // [List Addresses by Network](http://docs.openstack.org/api/openstack-compute/2/content/List_Addresses_by_Network-d1e3118.html)
    // there is more information about the JSON object that is returned.
    getserverips = function (id, networkID, callback) {
        var url = '/servers/' + id + '/ips';

        if (networkID !== undefined) {
            url += '/' + networkID;
        }
        ordinaryreq("get", url, undefined, callback);
    };
    // This operation updates the the `name` of the server given by its `id`. In
    // [Server Update](http://docs.openstack.org/api/openstack-compute/2/content/ServerUpdate.html)
    // there is more information about the JSON object that is returned.
    updateserver = function (id, name, callback) {
        var url = '/servers/' + id;

        if (name === undefined) {
            return;
        }

        var data = {
            "server" : {
                "name" : name
            }
        };
        ordinaryreq("put", url, data, callback);
    };
    // This operation asynchronously provisions a new server. The progress of
    // this operation depends on several factors including location of the
    // requested image, network i/o, host load, and the selected flavor. The
    // progress of the request can be checked by performing a `getserverdetail`,
    // which will return a progress attribute (0-100% completion).
    //
    // Arguments in this function are:
    //
    // a. Mandatory
    //
    // * The `name` we want to put to the new server
    //
    // * The `imageRef`, that is the id of the image we will
    // instantiate
    //
    // * The `flavorReg`, that is the id of the flavor we will use
    //
    // b. Optional
    //
    // * The `key_name` that corresponds to the name of the key we will
    // later use to access the instance by SSH (default is None)
    //
    // * Some raw data as `user_data` (default is None)
    //
    // * An array with names of the `security_groups` in which we want to
    // put our instance (default is none)
    //
    // * The minimum number of instances to be started as `min_count` (
    // default is 1)
    //
    // * The maximum number of instances as `max_count` (default is 1)
    //
    // * And the `availability_zone` (default is None)
    //
    // In [Create Servers](http://docs.openstack.org/api/openstack-compute/2/content/CreateServers.html)
    // there is more information about the JSON object that is returned.
    createserver = function (name, imageRef, flavorRef, key_name, user_data, security_groups, min_count, max_count, availability_zone, callback) {
        var data, groups = [], i, group;

        data = {
            "server" : {
                "name" : name,
                "imageRef" : imageRef,
                "flavorRef" : flavorRef
            }
        };

        if (key_name !== undefined) {
            data.server.key_name = key_name;
        }

        if (user_data !== undefined) {
            data.server.user_data = JS.Utils.encode(user_data);
        }

        if (security_groups !== undefined) {
            for (i in security_groups) {
                if (security_groups[i] !== undefined) {
                    group = {
                        "name" : security_groups[i]
                    };
                    groups.push(group);
                }
            }

            data.server.security_groups = groups;
        }

        if (min_count === undefined) {
            min_count = 1;
        }

        data.server.min_count = min_count;

        if (max_count === undefined) {
            max_count = 1;
        }

        data.server.max_count = max_count;

        if (availability_zone !== undefined) {
            data.server.availability_zone = JS.Utils.encode(availability_zone);
        }

        ordinaryreq("post","/servers", data, callback);
    };
    // This operation deletes a cloud server instance from the system.
    // In [Delete Server](http://docs.openstack.org/api/openstack-compute/2/content/Delete_Server-d1e2883.html)
    // there is more information.
    deleteserver = function (id, callback) {
        ordinaryreq("del", "/servers/" + id, undefined, callback);
    };
    // **Server Actions**
    //
    // Take a look at `postAction` for detailed information about requests.

    //
    // This operation changes the server's administrator password.
    // In [Change Password](http://docs.openstack.org/api/openstack-compute/2/content/Change_Password-d1e3234.html)
    // there is more information.
    changepasswordserver = function (id, adminPass, callback) {
        var data;
        if (adminPass === undefined) {
            return;
        }

        data = {
            "changePassword" : {
                "adminPass" : adminPass
            }
        };

        postAction(id, data, callback);
    };
    // This operation allows for a hard reboot that is the equivalent of power
    // cycling the server.
    rebootserverhard = function (id, callback) {
        postAction(id, {
            "reboot" : {
                "type" : "HARD"
            }
        }, callback);
    };

    // This operation allows for a soft reboot, which allows for a graceful
    // shutdown of all processes.
    // In [Reboot Server](http://docs.openstack.org/api/openstack-compute/2/content/Reboot_Server-d1e3371.html)
    // there is more information about hard and soft reboots.
    rebootserversoft = function (id, callback) {
        postAction(id, {
            "reboot" : {
                "type" : "SOFT"
            }
        }, callback);
    };
    // The resize function converts an existing server to a different flavor,
    // in essence, scaling the server up or down. The original server is saved
    // for a period of time to allow rollback if there is a problem. All resizes
    // should be tested and explicitly confirmed with `confirmresizedserver`, at
    // which time the original server is removed. All resizes are automatically
    // confirmed after 24 hours if they are not explicitly confirmed or reverted.
    // In [Resize Server](http://docs.openstack.org/api/openstack-compute/2/content/Resize_Server-d1e3707.html)
    // there is more information.
    resizeserver = function (id, flavorRef, callback) {
        postAction(id, {
            "resize" : {
                "flavorRef" : flavorRef
            }
        }, callback);
    };
    // During a resize operation, the original server is saved for a period of
    // time to allow roll back if there is a problem. Once the newly resized
    // server is tested and has been confirmed to be functioning properly, use
    // this operation to confirm the resize. After confirmation, the original
    // server is removed and cannot be rolled back to. All resizes are
    // automatically confirmed after 24 hours if they are not explicitly
    // confirmed or reverted.
    // In [Confirm Resized Server](http://docs.openstack.org/api/openstack-compute/2/content/Confirm_Resized_Server-d1e3868.html)
    // there is more information.
    confirmresizedserver = function (id, callback) {
        postAction(id, {
            "confirmResize" : null
        }, callback);
    };
    // In [Revert Resized Server](http://docs.openstack.org/api/openstack-compute/2/content/Revert_Resized_Server-d1e4024.html)
    // there is more information.
    revertresizedserver = function (id, callback) {
        postAction(id, {
            "revertResize" : null
        }, callback);
    };
    // It halts a running server. Changes status to STOPPED.
    // In [Start Server](http://api.openstack.org/) there is more information.
    startserver = function (id, callback) {
        postAction(id, {
            "os-start" : null
        }, callback);
    };
    // Returns a STOPPED server to ACTIVE status.
    // In [Stop Server](http://api.openstack.org/) there is more information.
    stopserver = function (id, callback) {
        postAction(id, {
            "os-stop" : null
        }, callback);
    };
    // It pauses a running server. Changes status to PAUSED.
    pauseserver = function (id, callback) {
        postAction(id, {
            "pause" : null
        }, callback);
    };
    // Returns a PAUSED server to ACTIVE status.
    unpauseserver = function (id, callback) {
        postAction(id, {
            "unpause" : null
        }, callback);
    };
    // It pauses a running server. Changes status to SUSPENDED.
    suspendserver = function (id, callback) {
        postAction(id, {
            "suspend" : null
        }, callback);
    };
    // Returns a SUSPENDED server to ACTIVE status.
    resumeserver = function (id, callback) {
        postAction(id, {
            "resume" : null
        }, callback);
    };
    // This action creates a new image for the given server. Once complete, a
    // new image will be available that can be used to rebuild or create servers.
    // In [Create Image](http://docs.openstack.org/api/openstack-compute/2/content/Create_Image-d1e4655.html)
    // there is more information.
    createimage = function (id, name, metadata, callback) {
        var data = {
            "createImage" : {
                'name' : name
            }
        };

        data.createImage.metadata = {};

        if (metadata !== undefined) {
            data.createImage.metadata = metadata;
        }

        postAction(id, data, callback);
    };
    // **Flavor Operations**

    // This operation will list all available flavors.
    // In [List Flavors](http://docs.openstack.org/api/openstack-compute/2/content/List_Flavors-d1e4188.html)
    // there is more information.
    getflavorlist = function (detailed, callback) {
        var  url = "/flavors";
        if (detailed !== undefined && detailed) {
            url += "/detail";
        }
        ordinaryreq("get", url, undefined, callback);
    };
    // This operation returns details of the specified flavor.
    // In [Get Flavor Details](http://docs.openstack.org/api/openstack-compute/2/content/Get_Flavor_Details-d1e4317.html)
    // there is more information.
    getflavordetail = function (id, callback) {
        ordinaryreq("get", "/flavors/" + id, undefined, callback);
    };
    // This operation creates a new flavor, using information given in arguments:
    // the `name` of the new flavor, the number of MB of `ram`, the `id` of the new
    // flavor, the number of GB of root `disk`, the number of GB of `ephemeral` disk,
    // the number of MB of `swap` space, and the `rxtx_factor`.
    // Arguments `ephemeral`, `swap`, `rxtx_factor` and `callback` are optional.
    createflavor = function (name, ram, vcpus, disk, flavorid, ephemeral, swap, rxtx_factor, callback) {
        var url = '/flavors';
        data = {
            "flavor" : {
                "name" : name,
                "ram" : ram,
                "vcpus" : vcpus,
                "disk" : disk,
                "id" : flavorid,
                "swap" : 0,
                "OS-FLV-EXT-DATA:ephemeral" : 0,
                "rxtx_factor" : 0
            }
        };

        if (ephemeral !== undefined) {
            data.flavor["OS-FLV-EXT-DATA:ephemeral"] = ephemeral;
        }

        if (swap !== undefined) {
            data.flavor.swap = swap;
        }

        if (rxtx_factor !== undefined) {
            data.flavor.rxtx_factor = rxtx_factor;
        }
        ordinaryreq("post", url, data, callback);
    };
    // This operation deletes flavor, specified by its `id`.
    // In [Get Flavor Details](http://docs.openstack.org/api/openstack-compute/2/content/Get_Flavor_Details-d1e4317.html)
    // there is more information.
    deleteflavor = function (id, callback) {
        ordinaryrwq("del", '/flavors/' + id, undefined, callback);
    };
    // **Image Operations**

    // This operation will list all images visible by the account.
    // In-flight images will have the status attribute set to SAVING and the
    // conditional progress element (0-100% completion) will also be returned.
    // Other possible values for the status attribute include: UNKNOWN, ACTIVE,
    // SAVING, ERROR, and DELETED. Images with an ACTIVE status are available
    // for install.
    // In [List Images](http://docs.openstack.org/api/openstack-compute/2/content/List_Images-d1e4435.html)
    // there is more information.
    getimagelist = function (detailed, callback) {
        var url = '/images';
        if (detailed !== undefined && detailed) {
            url += '/detail';
        }
        ordinaryreq("get", url, undefined, callback);
    };
    // This operation returns details of the image specified by its `id`.
    // In [Get Image Details](http://docs.openstack.org/api/openstack-compute/2/content/Get_Image_Details-d1e4848.html)
    // there is more information.
    getimagedetail = function (id, callback) {
        ordinaryreq("get", "/images/" + id, undefined, callback);
    };
    // This operation deletes an image from the system, specified by its `id`.
    // Images are immediately removed. Currently, there are no state transitions
    // to track the delete operation.
    // In [Delete Image](http://docs.openstack.org/api/openstack-compute/2/content/Delete_Image-d1e4957.html)
    // there is more information.
    deleteimage = function (id, callback) {
        ordinaryreq("del", "/images/" + id, undefined, callback);
    };
    // This operation retrieves a list of available Key-pairs.
    getkeypairlist = function (callback) {
        ordinaryreq("get", "/os-keypairs", undefined, callback);
    };
    // This operation creates a new Key-pair.
    createkeypair = function (name, pubkey, callback) {
        var data = {
            'keypair' : {
                'name' : name
            }
        };
        if (pubkey !== undefined) {
            data.keypair.public_key = pubkey;
        }
        ordinaryreq("post", "/os-keypairs", data, callback);
    };
    // This operation retrieves a list of available Key-pairs.
    deletekeypair = function (id, callback) {
        ordinaryreq("del", "/os-keypairs/" + id, undefined, callback);
    };
    // This operation retrieves a list of available security groups
    getsecgrouplist = function (callback) {
        ordinaryreq("get", "/os-security-groups", undefined, callback);
    };

    delsecgroup = function (id,callback) {
        ordinaryreq("del", "/os-security-groups/" + id, undefined, callback);
    };

    createsecgroup = function (name, description, callback) {
        var data = {
                        "security_group":
                                    {
                                        "name": name,
                                        "description": description
                                    }
                    };
        ordinaryreq("post", "/os-security-groups", data, callback);
    };

    delsecgrouprule = function (id, callback) {
        ordinaryreq("del", "/os-security-group-rules/" + id, undefined,
                    callback);
    };

    addsecgrouprule = function (fromport, toport, protocol, groupid, cidr,
                                callback) {
        var data = {
                        "security_group_rule":
                            {
                                "from_port": fromport,
                                "ip_protocol": protocol,
                                "to_port": toport,
                                "parent_group_id": groupid,
                                "cidr": cidr,
                                "group_id": null
                            }

            };
        ordinaryreq("post", "/os-security-group-rules", data,
                    callback);
    };

    // Get a vnc console for an instance
    // id: The server's ID to get the vnc console from.
    // console_type: Type of vnc console to get ('novnc' or 'xvpvnc')
    getvncconsole = function (id, console_type, callback) {
        var data;
        if (console_type === undefined || !console_type) {
            console_type = "novnc";
        }

        data = {
            "os-getVNCConsole" : {
                'type' : console_type
            }
        };

        postAction(id, data, null, callback);
    };
    //  Get text console log output from Server.
    // id: The server's ID to get the vnc console from.
    // length: The number of tail loglines you would like to retrieve.
    getconsoleoutput = function (id, length, callback) {
        var data;
        if (length === undefined || !length) {
            length = 35;
        }

        data = {
            "os-getConsoleOutput" : {
                'length' : length
            }
        };

        postAction(id, data, null, callback);
    };
    //  Lists the volume attachments for the specified server.
    // id: The server's ID to get the volume attachments from.
    getattachedvolumes = function (id, callback) {
        ordinaryreq("get", "/servers/" + id + "/os-volume_attachments",
                    undefined, callback);
    };
    // Attaches a volume to the specified server.
    // id: The server's ID.
    // volume_id: The volume's ID to be attached to the server.
    // device: The device where we want to attach this volume.
    attachvolume = function (id, volume_id, device, callback) {
        url = params.url + '/servers/' + id + '/os-volume_attachments';

        if (volume_id === undefined || device === undefined) {
            return;
        }

        var data = {
            'volumeAttachment' : {
                'volumeId' : volume_id,
                'device' : device
            }
        };

        ordinaryreq("post", "/servers/" + id + "/os-volume_attachments", 
                        data, callback);
    };
    // Deletes the specified volume attachment from the specified server.
    // id: The server's ID.
    // volume_id: The volume's ID to be detached from the server.
    detachvolume = function (id, volume_id, callback) {
        if (volume_id === undefined || id === undefined) {
            return;
        }
        ordinaryreq("del", "/servers/" + id + "/os-volume_attachments/" +
                                volume_id, undefined, callback);
    };
    // Lists volume details for the specified volume attachment ID.
    // id: The server's ID.
    // volume_id: The volume's ID.
    getattachedvolume = function (id, volume_id, callback) {
        if (volume_id === undefined || id === undefined) {
            return;
        }
        ordinaryreq("get", "/servers/" + id + "/os-volume_attachments/" +
                            volume_id, undefined, callback);

    };
    updatemetadata = function (id, meta, callback) {
        var url = "/servers/" + id + "/metadata";
        var data = {"metadata": meta};

        ordinaryreq("post", url, data, callback);
    };
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {

        // Functions:
        getserverlist : getserverlist,
        getserverdetail : getserverdetail,
        getserverips : getserverips,
        updateserver : updateserver,
        createserver : createserver,
        deleteserver : deleteserver,
        changepasswordserver : changepasswordserver,
        rebootserverhard : rebootserverhard,
        rebootserversoft : rebootserversoft,
        resizeserver : resizeserver,
        confirmresizedserver : confirmresizedserver,
        revertresizedserver : revertresizedserver,
        startserver : startserver,
        stopserver : stopserver,
        pauseserver : pauseserver,
        unpauseserver : unpauseserver,
        suspendserver : suspendserver,
        resumeserver : resumeserver,
        createimage : createimage,
        getflavorlist : getflavorlist,
        getflavordetail : getflavordetail,
        createflavor : createflavor,
        deleteflavor : deleteflavor,
        getimagelist : getimagelist,
        getimagedetail : getimagedetail,
        deleteimage : deleteimage,
        getkeypairlist : getkeypairlist,
        createkeypair : createkeypair,
        deletekeypair : deletekeypair,
        getsecgrouplist : getsecgrouplist,
        delsecgroup : delsecgroup,
        createsecgroup : createsecgroup,
        addsecgrouprule : addsecgrouprule,
        delsecgrouprule : delsecgrouprule,
        getvncconsole : getvncconsole,
        getconsoleoutput : getconsoleoutput,
        getattachedvolumes : getattachedvolumes,
        updatemetadata : updatemetadata,
        attachvolume : attachvolume,
        detachvolume : detachvolume,
        getattachedvolume : getattachedvolume
    };

}(JSTACK));/*
The MIT License

Copyright (c) 2012 Universidad Politecnica de Madrid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JStack Nova Volume Module
// ------------------

// Allows you to manage volumes and snapshots that can be used with the Compute API.
JSTACK.Nova.Volume = (function (JS, undefined) {
    "use strict";
    var params, check, ordinaryreq, getvolumelist, createvolume, deletevolume,
            getvolume, getsnapshotlist, createsnapshot, deletesnapshot,
            getsnapshot;
    // This modules stores the `url` to which it will send every
    // request.
    params = {
        url : undefined,
        state : undefined
    };

    // Private functions
    // -----------------

    // Function `check` internally confirms that Keystone module is
    // authenticated and it has the URL of the Volume service.
    check = function () {
        if (JS.Keystone !== undefined && JS.Keystone.params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            params.url = JS.Keystone.getserviceendpoint("volume").adminURL;
            return true;
        }
        return false;
    };

    ordinaryreq = function (type, url, data, callback) {
        if (!check()) {
            return;
        }
        url = params.url + url;
        JS.Comm.ordinaryreq(type, url, data, callback);
    };
    // Public functions
    // ----------------
    //
    // **Volume Operations**

    //
    // View a list of simple Volume entities. In
    // [Requesting a List of Volumes](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    getvolumelist = function (detailed, callback) {
        var url = '/volumes';
        if (detailed !== undefined && detailed) {
            url += '/detail';
        }
        ordinaryreq("get", url, undefined, callback);
    };
    // Create a Volume.
    // Arguments in this function are:
    //
    // a. Mandatory
    //
    // * The `size` of volume in GB
    //
    // b. Optional
    //
    // * The `name` of the volume
    //
    // * The `description` of the volume
    //
    createvolume = function (size, name, description, callback) {
        var data = {
            "volume" : {
                "size" : size
            }
        };

        if (name !== undefined) {
            data.volume.display_name = name;
        }

        if (description !== undefined) {
            data.volume.display_description = description;
        }

        ordinaryreq("post", "/volumes", data, callback);
    };
    // Delete a Volume entitiy. In
    // [Deleting a Volume](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    deletevolume = function (id, callback) {
        ordinaryreq("del", "/volumes/" + id, undefined, callback);
    };
    // Get a Volume entitiy. In
    // [Retrieving a Volume](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    getvolume = function (id, callback) {
        ordinaryreq("get", "/volumes/" + id, undefined, callback);
    };
    // **Snapshot Operations**

    //
    // View a list of simple Snapshot entities. In
    // [Requesting a List of Snapshots](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    getsnapshotlist = function (detailed, callback) {
        var url = '/snapshots';
        if (detailed !== undefined && detailed) {
            url += '/detail';
        }
        ordinaryreq("get", url, undefined, callback);
    };
    // Create a Volume Snapshot.
    // Arguments in this function are:
    //
    // a. Mandatory
    //
    // * The `volume_id` of the volume
    //
    // b. Optional
    //
    // * The `name` of the snapshot
    //
    // * The `description` of the snapshot
    //
    createsnapshot = function (volume_id, name, description, callback) {
        var data = {
            "snapshot" : {
                "volume_id" : volume_id,
                "force" : true
            }
        };

        if (name !== undefined) {
            data.snapshot.display_name = name;
        }

        if (description !== undefined) {
            data.snapshot.display_description = description;
        }
        ordinaryreq("post", "/snapshots", data, callback);
    };
    // Delete a Snapshot entitiy. In
    // [Retrieving a Snapshot](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    deletesnapshot = function (id, callback) {
        ordinaryreq("del", "/snapshots/" + id, undefined, callback);
    };
    // Get a Snapshot entitiy. In
    // [Retrieving a Snapshot](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    getsnapshot = function (id, callback) {
        ordinaryreq("get", "/snapshosts/" + id, undefined, callback);
    };
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {

        // Functions:
        getvolumelist : getvolumelist,
        createvolume : createvolume,
        deletevolume : deletevolume,
        getvolume : getvolume,
        getsnapshotlist : getsnapshotlist,
        createsnapshot : createsnapshot,
        deletesnapshot : deletesnapshot,
        getsnapshot : getsnapshot
    };

}(JSTACK));/*
The MIT License

Copyright (c) 2012 Universidad Politecnica de Madrid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JStack Glance Module
// ------------------

// This module provides Glance API functions.
JSTACK.Glance = (function (JS, undefined) {
    "use strict";
    var params, check, getimagelist;

    // This modules stores the `url`to which it will send every
    // request.
    params = {
        url : undefined,
        state : undefined
    };

    // Private functions
    // -----------------

    // Function `check` internally confirms that Keystone module is
    // authenticated and it has the URL of the Glance service.
    check = function () {
        if (JS.Keystone !== undefined && JS.Keystone.params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            params.url = JS.Keystone.getserviceendpoint("image").adminURL;
            return true;
        }
        return false;
    };
    // Public functions
    // ----------------
    //
    // **Image Operations**

    //
    // This operation provides a list of images associated with the account. In
    // [Requesting a List of Public VM Images](http://docs.openstack.org/cactus/openstack-compute/admin/content/requesting-vm-list.html)
    // there is more information about the JSON object that is returned.
    getimagelist = function (detailed, callback) {
        var url, onOK, onError;
        if (!check()) {
            return;
        }
        url = params.url + '/images';
        if (detailed !== undefined && detailed) {
            url += '/detail';
        }

        onOK = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            throw new Error(message);
        };

        JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {

        // Functions:
        getimagelist : getimagelist
    };

}(JSTACK));

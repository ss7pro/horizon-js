var UTILS = UTILS || {};

// Current version is **0.1**.

UTILS.VERSION = '0.1';

// It has been developed by GING (New Generation Internet Group) in
// the Technical University of Madrid.
UTILS.AUTHORS = 'GING';

UTILS.Auth = (function(U, undefined) {

    var tenants = [];
    
    function initialize(url) {
        JSTACK.Keystone.init(url);
    }
    
    function getToken() {
        return JSTACK.Keystone.params.token;
    }
    
    function getName() {
        return JSTACK.Keystone.params.access.user.name;
    }
    
    function getTenants(callback) {
        return JSTACK.Keystone.gettenants(function(resp) {
            callback(resp.tenants);
        });
    }
    
    var getCurrentTenant = function() {
        return JSTACK.Keystone.params.access.token.tenant;
    }

    var getCurrentRegion = function() {
        return JSTACK.Keystone.params.region;
    }

    function setCurrentRegion (region) {
        JSTACK.Keystone.params.region = region;
    }

    var getRegionList = function(){
        return JSTACK.Keystone.getregionlist();
    }

    
    var isAuthenticated = function() {
        return JSTACK.Keystone.params.currentstate == JSTACK.Keystone.STATES.AUTHENTICATED;
    }
    
    var isAdmin = function() {
        var roles = JSTACK.Keystone.params.access.user.roles;
        for (var index in roles) {
            var rol = roles[index];
            if (rol.name == "admin")
            return true;
        }
        return false;
    }
    
/* to be implemented in the future
    var switchTenant = function(tenant, callback, error) {
        JSTACK.Keystone.authenticate(undefined, undefined, JSTACK.Keystone.params.token, tenant, callback, error);
    }
*/

    function authenticate(username, password, tenant, token, callback, error) {
        var _authenticatedWithTenant = function (resp) {
            console.log("Authenticated with tenant");
            console.log(JSON.stringify(resp));
            callback();
        }
/*
        var _authenticatedWithToken = function (resp) {
            console.log("Authenticated with token");
            callback();
        }
*/
        var xxx = 'ziut';

        var _authenticatedWithoutTenant = function() {
            console.log("Ok");
            console.log("Retrieving tenants...");

            var ok = function (resp) {
                tenants = resp.tenants;
                _tryTenant();
            }

            JSTACK.Keystone.gettenants(ok);
        }
        
        var _tryTenant = function(tenant) {
            if (tenants.length > 0) {
                tenant = tenant || tenants.pop();
                console.log("Authenticating for tenant " + JSON.stringify(tenant.id));
                JSTACK.Keystone.authenticate(undefined, undefined, JSTACK.Keystone.params.token, tenant.id, _authenticatedWithTenant, _error);
            } else {
                console.log("Error authenticating");
                error("No tenant")
            }
        }
        
        
        var getToken = function() {
            return JSTACK.Keystone.params.token;
        }
        
        var onError = function(msg) {
            error(msg);
        }

        var _error = function() {
            _tryTenant();
        }
        
        var _credError = function() {
            error("Bad credentials");
        }
        
        var success;
        
        if (username != undefined && password != undefined) {
            success = _authenticatedWithoutTenant;
            console.log("Authenticating with credentials");
        } else if (token != undefined) {
            success = _authenticatedWithoutTenant;
            console.log("Authenticating with token");
        }
        JSTACK.Keystone.authenticate(username, password, token, tenant, success, _credError);
    };
    
    return {
        initialize: initialize,
        authenticate: authenticate,
        getToken: getToken,
        getName: getName,
        isAuthenticated: isAuthenticated,
        getCurrentTenant: getCurrentTenant,
        getTenants: getTenants,
// to be implemented in the future
//        switchTenant: switchTenant,
        isAdmin: isAdmin,
        setCurrentRegion: setCurrentRegion,
        getCurrentRegion: getCurrentRegion,
        getRegionList: getRegionList
    }

})(UTILS);

UTILS.Render = (function(U, undefined) {
    
    function animateRender(el, template, model, callback) {
        var temp = template(model);
        console.log(temp);
        $(el).append(temp);
        $(temp).hide();
        $(el).animate( {
                        marginLeft: "+1250px",
                        marginRight: "-1250px",
                      }, 200, function() {
            $(temp).show();
            $(el).html(temp).css('marginLeft', '1250px').css('marginRight', '-1250px').animate( {
                marginLeft: "-=1250px",
                marginRight: "+=1250px",
                      }, 200, function() {
                          if (callback != undefined) {
                              callback();
                          }
                      });
            });
       return temp;
    }
    
    return {
        animateRender: animateRender
    }
})(UTILS);

UTILS.i18n = (function(U, undefined) {
    
    var dict = {
    };
    
    var params = {
        lang : "en",
        dict: dict
    };
    
    function init() {
        _.extend(_, {itemplate : function(html) {
	        var simple = _.template(html);
	        var func = function(args) {
	            var init = simple(args)

	            init = U.i18n.translate(init);
	            return init;
	        }
	        return func;
	    }});
	    if (localStorage.i18nlang == undefined) {
	        localStorage.i18nlang = 'en';
	    }
	    UTILS.i18n.setlang(localStorage.i18nlang);
        console.log("Language: " + localStorage.i18nlang);
    };
    
    function setlang(lang, callback) {
        var url = "locales/"+lang+".json?random=" + Math.random()*99999;
        $.ajax({
            url: url,
            success: function(data, status, xhr) {
                console.log('loaded: ' + url);
                U.i18n.params.dict = data;
                localStorage.i18nlang = lang;
                if (callback != undefined)
                    callback();
            },
            error : function(xhr, status, error) {
                console.log('failed loading: ' + url);
                console.log(status);
                if (callback != undefined)
                    callback();
            },
            dataType: "json"
        });
    }
    
    function translateNodes(el) {
        var html = $(el);
        var items = html.find("*[data-i18n]");
        items.each(function(index, item) {
            var item = $(items[index], el);
            var newItem = U.i18n.get(item.attr("data-i18n"));
            if (newItem != undefined) {
                var copy = item.clone();
                item.text(newItem);
                html.find(copy).replaceWith(item);
            }
        });
        return html;
    };
    
    function translate(html) {
        var initTime = new Date().getTime();
        html = translateNodes(html);
        var duration = new Date().getTime()-initTime;
        //console.log("Internationalization duration: " + duration);
        return html;
    }
    
    function pluralise(s, n) {
        var text = U.i18n.get(s);
        if (n != 0) {
            return (sprintf(text, n));
        } else {
            return (text);
        }
        return out;
    }
    
    function get(data) {
        var newItem = U.i18n.params.dict[data];
        if (newItem == undefined)
            newItem = data
        return newItem;
    }
    
    function sprintf(s) {
        var bits = s.split('%');
        var out = bits[0];
        var re = /^([ds])(.*)$/;
        for (var i=1; i<bits.length; i++) {
            p = re.exec(bits[i]);
            if (!p || arguments[i]==null) continue;
            if (p[1] == 'd') {
                out += parseInt(arguments[i], 10);
            } else if (p[1] == 's') {
                out += arguments[i];
            }
            out += p[2];
        }
        return out;
    }
    
    return {
        params      :     params,
        init        :     init,
        setlang     :     setlang,
        translate   :     translate,
        get         :     get,
        pluralise   :     pluralise,
    }
})(UTILS);


UTILS.Events = (function(U, undefined) {

    //wrap fetch function to provide 
    function wrapFetch(self) {
        var options = {};
        options.success = function() {
                            self.fetchDate = new Date().getTime();
                            self.fetchErrorDate = undefined;
                            self.trigger('fetch-ready');
                        };
        options.error = function() {
                            self.fetchErrorDate = new Date().getTime();
                        };
        self.fetch(options); 
    }

    function isFetchDataValid(self) {
        if (self.fetchDate == undefined) {
            return (false);
        }
        var curTime = new Date().getTime();
        if ((self.fetchDate+(60*1000)) > curTime) {
            return (true);
        }
        return (false);
    }

    function emptyFetchDate(self) {
        self.fetchDate = undefined;
    }

    return {
        wrapFetch               :   wrapFetch,
        isFetchDataValid        :   isFetchDataValid,
        emptyFetchDate          :   emptyFetchDate,
    }
    
})(UTILS);

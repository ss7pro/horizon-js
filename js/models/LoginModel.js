var LoginStatus = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        username: null,
        password: null,
        error_msg: null,
        token: '',
        tenant: undefined,
        tenants: undefined,
        region: undefined,
        regions: undefined
    },

    initialize: function () {
        if (localStorage.getItem('region') !== undefined) {
            this.set({'region': localStorage.getItem('region')});
        }
        this.bind('change:token', this.onTokenChange, this);
        this.bind('change:regions', this.onRegionsChange, this);
        this.bind('credentials', this.onCredentialsChange, this);
        this.bind('error', this.onValidateError, this);
        if (localStorage.getItem('token') !== undefined) {
            this.set({'token': localStorage.getItem('token')});
        }
/* tenant switch, to be implemented in the future
        if (localStorage.getItem('tenant') !== undefined) {
            this.set({'tenant': localStorage.getItem('tenant')});
        }
*/
    },
    
    onValidateError: function (model, error) {
        model.set({error_msg: "Username and password are mandatory."});
        model.trigger('auth-error', error.msg);
    },
    
    onCredentialsChange: function (model, password) {
        var self = this;
        if (self.get("username") != '' && self.get("password") != '') {
/* tenant switch to be implemented in the future
            var preferedTenant;
            if (self.get("tenant") != undefined) {
                preferedTenant = JSON.parse(self.get("tenant")).id;
            }
*/
            UTILS.Auth.authenticate(self.get("username"), self.get("password"), undefined, undefined, function() {
                console.log("Authenticated with credentials");
                UTILS.Auth.getTenants(function(tenants) {
                    self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
                    self.set({regions: UTILS.Auth.getRegionList()});
                    self.set({tenants: tenants});
                    self.set({userId: UTILS.Auth.getUserId()});
                    localStorage.setItem('token', UTILS.Auth.getToken());
                    self.set({'token': UTILS.Auth.getToken()});
                    self.set({'loggedIn': true});
                });
            }, function(msg) {
                self.set({'error_msg': msg});
                self.trigger('auth-error', msg);
            });
        } else {
            var msg = "Username and password are mandatory.";
            self.set({'error_msg': msg});
            self.trigger('auth-error', msg);
        }
    },
    
    setRegion: function (region) {
        var defaultRegion = 'r4cz1';
        var regionCorrect = false;

        if (region == undefined || region == '')  {
                this.set({'region': defaultRegion});
        } else {
            var regions = this.get("regions");
            for (var rindex in regions) {
                if (regions[rindex].name == region) {
                    regionCorrect = true;
                    this.set({'region': region});
                }
            }
            if (!regionCorrect) {
                this.set({'region': defaultRegion});
            }
        }
        UTILS.Auth.setCurrentRegion(this.get("region"));
        localStorage.setItem('region', this.get("region"));
        this.trigger('switch-region');
    },

    onRegionsChange: function (context) { 
        var self = context;
        self.setRegion(self.get("region"));
    },

    onTokenChange: function (context, token) {
        var self = context;
        //console.log(token);
        if (!UTILS.Auth.isAuthenticated() && token != '') {
            UTILS.Auth.authenticate(undefined, undefined, undefined, token, function() {
          //      console.log("Authenticated with token");
                self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
            //    console.log("New tenant: " + self.get("name"));
                UTILS.Auth.getTenants(function(tenants) {
                    self.set({regions: UTILS.Auth.getRegionList()});
                    self.set({tenants: tenants});
                    self.set({userId: UTILS.Auth.getUserId()});
                    localStorage.setItem('token', UTILS.Auth.getToken());
                    self.set({'token': UTILS.Auth.getToken()});
                    self.set({'loggedIn': true});
                });
                
            }, function(msg) {
              //  console.log("Error authenticating with token");
                self.set({'error_msg': msg});
                self.trigger('auth-error', msg);
            });
        } else if (UTILS.Auth.isAuthenticated() && token != '') {
           // console.log("Token change after login (switch to tenant token)");
        } else {
            self.set({'loggedIn': false});
        }
    },

    isAdmin: function() {
        return UTILS.Auth.isAdmin();  
    },
    
    removeToken: function() {
        localStorage.setItem('token', '');
        this.set({'token': ''});
    },
    
    setCredentials: function(username, password) {
        console.log("Setting credentials");
        this.set({'username': username, 'password': password, 'error_msg':undefined});
        this.trigger('credentials', this);
    },
/*
    switchTenant: function(tenantID) {
        var self = this;
        console.log("Tenant: " + tenantID);
        UTILS.Auth.switchTenant(tenantID, function(resp) {
            console.log(resp);
            self.set({username: UTILS.Auth.getName(), tenant: UTILS.Auth.getCurrentTenant()});
            self.trigger('switch-tenant');
        });
    },
*/
    
    clearAll: function() {
        this.removeToken();
        this.set(this.defaults);
    }

});

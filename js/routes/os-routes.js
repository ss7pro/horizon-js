var OSRouter = Backbone.Router.extend({
    
    rootView: undefined,
    loginModel: undefined,
    instanceModel: undefined,
    volumeModel: undefined,
    topBarModel: undefined,
    
    currentView: undefined,
    currentViewBinds: undefined,
    
    timers: [],
    
    routes: {
        'register': 'register',
        'auth/login': 'login',
        'auth/region/:name': 'switchRegion',
        'auth/logout': 'logout'
    },
	
	initialize: function() {
        this.regionModel = new Regions();
	    this.loginModel = new LoginStatus();
	    this.instanceModel = new Instances();
	    this.volumeModel = new Volumes();
	    this.flavorModel = new Flavors();
	    this.imageModel = new Images();
        this.topBarModel = new TopBarModel();
        this.leftBarModel = new LeftBarModel();
        this.keyPairModel = new KeyPairs();
        this.secGroupModel = new SecGroups();
        this.profileModel = new RcProfile();

        this.setupModelsFetch(this);
        this.loginModel.bind('switch-region', this.onSwitchRegion, this);

        this.loginModel.bind('change:loggedIn', this.loadProfile, this);

	    Backbone.View.prototype.close = function(){
          //this.remove();
          this.unbind();
          if (this.onClose){
            this.onClose();
          }
        }
	    
	    this.rootView = new RootView({model:this.loginModel, auth_el: '#auth',
                                        root_el: '#root'});

	    this.route('', 'init', this.wrap(this.init, this.checkAuth));
	    this.route('#', 'init', this.wrap(this.init, this.checkAuth));
	    this.route('server', 'server', this.wrap(this.navigateServer,
                                                    this.checkAuth));
	    this.route('drive', 'drive', this.wrap(this.navigateDrive,
                                                this.checkAuth));
	    this.route('snapshot', 'snapshot', this.wrap(this.navigateSnapshot,
                                                        this.checkAuth));
	    this.route('firewall', 'firewall', this.wrap(this.navigateFirewall,
                                                        this.checkAuth));
	    this.route('debug', 'debug', this.wrap(this.navigateDebug,
                                                this.checkAuth));
	    this.route('payments/:page/:param', 'paymentsPage', this.wrap(this.navigatePayment, 
                                                this.checkAuth));
	    this.route('payments/:page', 'paymentsPage', this.wrap(this.navigatePayment, 
                                                this.checkAuth));
	    this.route('payments', 'payments', this.wrap(this.navigatePayment, 
                                                this.checkAuth));
	    this.route('server/details/:id', 'serverDetails',
                    this.wrap(this.navigateServerDetails, this.checkAuth));
	},

	wrap: function(func, wrapper, arguments) {
	    var ArrayProto = Array.prototype;
        var slice = ArrayProto.slice;
        return function() {
          var args = [func].concat(slice.call(arguments, 0));
          return wrapper.apply(this, args);
        };
    },
	
	checkAuth: function() {
		
		var next = arguments[0];
        this.rootView.options.next_view = Backbone.history.fragment;
        if (!this.loginModel.get("loggedIn")) {
            window.location.href = "#auth/login";
            return;
        } else {
            if (this.timers.length == 0) {
/*
                this.add_fetch(this.instancesModel, 60);
                this.add_fetch(this.volumesModel, 60);
                this.add_fetch(this.images, 60);
                this.add_fetch(this.flavors, 60);
                this.add_fetch(this.volumeSnapshotsModel,60);
                if (this.loginModel.isAdmin()) {
                    this.add_fetch(this.projects, 60);
                }
*/
            }
        }
        var args = [this].concat(Array.prototype.slice.call(arguments, 1));
	    next.apply(this, args);
	},
	
  loadProfile: function(loginModel) {
    this.profileModel.setUserId(loginModel.get('userId'));
    this.profileModel.fetch();
  },

	newContentView: function (self, view, binds) {

        if (self.currentViewBinds != undefined) {
            self.bindModelEvents(self.currentViewBinds, false);
            self.currentViewBinds = undefined;
        }
        if (self.currentView != undefined){
           self.currentView.close();
        }
        self.currentView = view;
        if (binds != undefined) {
            self.bindModelEvents(binds, true);
            self.currentViewBinds = binds;
        }
        view.renderFirst();
    },

	init: function(self) {
        window.location.href = "#debug";
	},
	
	login: function() {
        this.rootView.renderAuth();
	},
	
	logout: function() {
        this.loginModel.clearAll();
        window.location.href = "#auth/login";
	},

    //bind, unbind events on model to handler on views
    // status: true -> bind
    // status: fale -> unbind
    bindModelEvents: function (binds,status) {
        for(var bidx in binds) {
            for(var eidx in binds[bidx].events) {
                if (status) {
                    binds[bidx].model.bind(binds[bidx].events[eidx].event,
                                            binds[bidx].events[eidx].handler,
                                            binds[bidx].context);
                } else {
                    binds[bidx].model.unbind();
                }
            }
        }
    },

    //helper for showing root page template
    showRoot: function(self) {
        self.rootView.renderRoot();
        var topBarView = new TopBarView({el: '#topbar', model: self.topBarModel,
                                            loginModel: self.loginModel});
        var leftBarView = new LeftBarView({el: '#leftbar',
                                            model: self.leftBarModel});
        topBarView.render();
        leftBarView.render();
	},

//
// navigate models links builder
//
    navigateDebugMods: function(self) {
        var mods = {
                        loginModel: self.loginModel,
                        regionModel: self.regionModel,
                        instanceModel: self.instanceModel,
                        volumeModel: self.volumeModel,
                        flavorModel: self.flavorModel,
                        imageModel: self.imageModel,
                        keyPairModel: self.keyPairModel,
                        secGroupModel: self.secGroupModel
                };
        return (mods);
    },

    navigateServerMods: function(self) {
        var mods = {
                        loginModel: self.loginModel,
                        regionModel: self.regionModel,
                        instanceModel: self.instanceModel,
                        volumeModel: self.volumeModel,
                        flavorModel: self.flavorModel,
                        imageModel: self.imageModel,
                        keyPairModel: self.keyPairModel,
                        secGroupModel: self.secGroupModel
                };
        return (mods);
    },

    navigateDriveMods: function(self) {
        var mods = {
                        loginModel: self.loginModel,
                        regionModel: self.regionModel,
                        instanceModel: self.instanceModel,
                        volumeModel: self.volumeModel
                };
        return (mods);
    },

//
// navigate args builders
//
    navigateDebugArgs: function(self) {
        var args = {
                        el: "#content"
                };
        return (args);
    },

    navigateServerArgs: function(self) {
        var args = {
                        el: "#content"
                };
        return (args);
    },

    navigateDriveArgs: function(self) {
        var args = {
                        el: "#content"
                };
        return (args);
    },

//
// navigate params builders
//
    navigateDebugParams: function(self) { 
        var mods = this.navigateDebugMods(self);
        var args = this.navigateDebugArgs(self);
        return({mods: mods, args: args});
    },

    navigateServerParams: function(self) { 
        var mods = this.navigateServerMods(self);
        var args = this.navigateServerArgs(self);
        return({mods: mods, args: args});
    },

    navigateDriveParams: function(self) { 
        var mods = this.navigateDriveMods(self);
        var args = this.navigateDriveArgs(self);
        return({mods: mods, args: args});
    },

    barDataSet: function(self,active) {
        var navs = [
                   {name: "server", url: "#server", desc: "<img src='images/server-128.png' class='s-leftbar-icon'><span class='s'>Servers</span>" },
                    {name: "drive", url: "#drive", desc: "<img src='images/db-128.png' class='s-leftbar-icon'><span class='s'>Drives</span>" },
                    {name: "firewall", url: "#firewall", desc: "<img src='images/firewall-128.png' class='s-leftbar-icon'><span class='s'>Firewalls</span>" },
                    {name: "snapshot", url: "#snapshot", desc: "<img src='images/camera-128.png' class='s-leftbar-icon'><span class='s'>Snapshots</span>" },
                    {name: "debug", url: "#debug", desc: "<img src='images/debug-128.png' class='s-leftbar-icon'><span class='s'>Debug</span>" },
                    {name: "payments", url: "#payments", desc: "<img src='images/payment-128.png' class='s-leftbar-icon'><span class='s'>Payments</span>" },
                    {name: "serverDetails", url: "", desc: "Server details" }
            ];
        self.topBarModel.set({navs: navs, active: active });
        self.leftBarModel.set({navs: navs, active: active });
    },

//
// navigate functions
//
	navigateDebug: function(self) {
        var params = this.navigateDebugParams(self);
        self.barDataSet(self, "debug");
        self.showRoot(self);
        _.extend(params.args,params.mods);
        view = new DebugView(params.args);
        var binds = [
                {model: params.mods.instanceModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.render},
                        {event: "empty-reset", handler: view.renderOnEmpty}
                    ]
                },
                {model: params.mods.volumeModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.render},
                        {event: "empty-reset", handler: view.renderOnEmpty}
                    ]
                },
                {model: params.mods.flavorModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.render},
                        {event: "empty-reset", handler: view.renderOnEmpty}
                    ]
                },
                {model: params.mods.imageModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.render},
                        {event: "empty-reset", handler: view.renderOnEmpty}
                    ]
                },
                {model: params.mods.keyPairModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.render},
                        {event: "empty-reset", handler: view.renderOnEmpty}
                    ]
                },
                {model: params.mods.secGroupModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.render},
                        {event: "empty-reset", handler: view.renderOnEmpty}
                    ]
                }
        ];
        self.newContentView(self, view, binds);
    },

    navigateServer: function(self) {
        var params = this.navigateServerParams(self);
        self.barDataSet(self, "server");
        self.showRoot(self);
        _.extend(params.args,params.mods);
        view = new ServerView(params.args);
        var binds = [
                {model: params.mods.instanceModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.volumeModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.flavorModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.imageModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.keyPairModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.secGroupModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                }
        ];
        self.newContentView(self, view, binds);
    },

    navigateDrive: function(self) {
        var params = this.navigateDriveParams(self);
        self.barDataSet(self, "drive");
        self.showRoot(self);
        _.extend(params.args,params.mods);
        view = new DriveView(params.args);
        var binds = [
                {model: params.mods.volumeModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderDrive},
                        {event: "empty-reset",
                            handler: view.renderDriveOnEmpty}
                    ]
                },
                {model: params.mods.instanceModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderDrive},
                        {event: "empty-reset",
                            handler: view.renderDriveOnEmpty}
                    ]
                }
        ];
        self.newContentView(self, view, binds);
    },

    navigateSnapshot: function(self) {
        self.barDataSet(self, "snapshot");
        self.showRoot(self);
        view = new SnapshotView({loginModel: this.loginModel,
                                regionModel: this.regionModel,
                                instanceModel: this.instanceModel,
                                volumeModel: this.volumeModel,
                                flavorModel: this.flavorModel,
                                imageModel: this.imageModel,
                                el: "#content"});
        self.newContentView(self, view, undefined);
    },

    navigateFirewall: function(self) {
        self.barDataSet(self, "firewall");
        self.showRoot(self);
        view = new FirewallView({loginModel: this.loginModel,
                                regionModel: this.regionModel,
                                instanceModel: this.instanceModel,
                                flavorModel: this.flavorModel,
                                el: "#content"});
        self.newContentView(self, view, undefined);
    },

    navigatePayment: function(self, page, param) {
        self.barDataSet(self, "payments");
        self.showRoot(self);
        view = new PaymentView({loginModel: this.loginModel, 
                                profileModel: this.profileModel,
                                page: page,
                                param: param,
                                el: "#content"});
        self.newContentView(self, view);
    },

    navigateServerDetails: function(self, id) {
        var params = this.navigateServerParams(self);
        self.barDataSet(self, "serverDetails");
        self.showRoot(self);
        _.extend(params.args,params.mods);
        _.extend(params.args,{serverId: id});
        view = new ServerDetailsView(params.args);
        var binds = [
                {model: params.mods.instanceModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.volumeModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.flavorModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.imageModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.keyPairModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                },
                {model: params.mods.secGroupModel, context: view, events:
                    [
                        {event: "fetch-ready", handler: view.renderServer},
                        {event: "empty-reset",
                            handler: view.renderServerOnEmpty}
                    ]
                }
        ];
        self.newContentView(self, view, binds);
    },

    switchRegion: function(name) {
        if (this.loginModel.get("region") != name) {
	        this.loginModel.setRegion(name);
        }
	    this.navigate(this.rootView.options.next_view, {trigger: false, replace: true});
    },

    onSwitchRegion: function () {
        UTILS.Events.resetAllModels();
    },

    setupModelsFetch: function (self) {
        UTILS.Events.fetchSetsAdd("instanceModel", self.instanceModel);
        UTILS.Events.fetchSetsAdd("volumeModel", self.volumeModel);
        UTILS.Events.fetchSetsAdd("flavorModel", self.flavorModel);
        UTILS.Events.fetchSetsAdd("imageModel", self.imageModel);
        UTILS.Events.fetchSetsAdd("keyPairModel", self.keyPairModel);
        UTILS.Events.fetchSetsAdd("secGrupModel", self.secGroupModel);
    },

    register: function() {
        this.rootView.renderRegister();
    }
});

var OSRouter = Backbone.Router.extend({
    
    rootView: undefined,
    loginModel: undefined,
    instanceModel: undefined,
    volumeModel: undefined,
    topBarModel: undefined,
    
    currentView: undefined,
    
    timers: [],
    
    routes: {
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

        this.loginModel.bind('switch-region', this.onSwitchRegion, this);

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
	    this.route('debug', 'debug', this.wrap(this.debug, this.checkAuth));
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
	
	newContentView: function (self, view) {

        if (self.currentView != undefined){
           self.currentView.close();
        }
    
        self.currentView = view;
    
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

    //hlper for showing root page template
	showRoot: function(self) {
        self.rootView.renderRoot();
        var topBarView = new TopBarView({el: '#topbar', model: self.topBarModel,
                                            loginModel: self.loginModel});
        var leftBarView = new LeftBarView({el: '#leftbar'});
        topBarView.render();
        leftBarView.render();
	},

	debug: function(self) {
        self.topBarModel.set({"title":"Debug"});
        self.showRoot(self);
        view = new DebugView({loginModel: this.loginModel,
                                regionModel: this.regionModel,
                                instanceModel: this.instanceModel,
                                volumeModel: this.volumeModel,
                                flavorModel: this.flavorModel,
                                imageModel: this.imageModel,
                                el: "#content"});
        view.render();
        self.newContentView(self,view);
    },

    navigateServer: function(self) {
        self.topBarModel.set({"title":"Servers"});
        self.showRoot(self);
        view = new ServerView({loginModel: this.loginModel,
                                regionModel: this.regionModel,
                                instanceModel: this.instanceModel,
                                volumeModel: this.volumeModel,
                                flavorModel: this.flavorModel,
                                imageModel: this.imageModel,
                                el: "#content"});
        self.newContentView(self,view);
        view.render();
    },

    navigateDrive: function(self) {
        self.topBarModel.set({"title":"Drives"});
        self.showRoot(self);
        view = new DriveView({loginModel: this.loginModel,
                                regionModel: this.regionModel,
                                instanceModel: this.instanceModel,
                                volumeModel: this.volumeModel,
                                flavorModel: this.flavorModel,
                                imageModel: this.imageModel,
                                el: "#content"});
        self.newContentView(self,view);
        view.render();
    },

    navigateSnapshot: function(self) {
        self.topBarModel.set({"title":"Snapshots"});
        self.showRoot(self);
        view = new SnapshotView({loginModel: this.loginModel,
                                regionModel: this.regionModel,
                                instanceModel: this.instanceModel,
                                volumeModel: this.volumeModel,
                                flavorModel: this.flavorModel,
                                imageModel: this.imageModel,
                                el: "#content"});
        self.newContentView(self,view);
        view.render();
    },

    navigateFirewall: function(self) {
        self.topBarModel.set({"title":"Snapshots"});
        self.showRoot(self);
        view = new FirewallView({loginModel: this.loginModel,
                                regionModel: this.regionModel,
                                instanceModel: this.instanceModel,
                                flavorModel: this.flavorModel,
                                el: "#content"});
        self.newContentView(self,view);
        view.render();
    },

	switchRegion: function(name) {
	    this.loginModel.setRegion(name);
	    this.navigate(this.rootView.options.next_view, {trigger: false, replace: true});
	},

    onSwitchRegion: function () {
        //collection, reset ?, fetch ?
        var toReset  = [
                [this.instanceModel,true,true],
                [this.volumeModel,true,true],
                [this.flavorModel,true,true],
                [this.imageModel,true,true]
            ];
        for (index in toReset) {
            if (toReset[index][1]) {
                toReset[index][0].reset();
            }
            if (toReset[index][2]) {
                toReset[index][0].fetch();
            }
        }
    },

	clear_fetch: function() {
	    var self = this;
	    for (var index in this.timers) {
	        var timer_id = this.timers[index];
	        clearInterval(timer_id);
	    }
	    this.timers = [];
	},
	
	add_fetch: function(model, seconds) {
	    model.fetch();
        var id = setInterval(function() {
            model.fetch();
        }, seconds*1000);
        
        this.timers.push(id);
	}
});

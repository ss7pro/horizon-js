var FiwareRouter = Backbone.Router.extend({
    
    rootView: undefined,
    
    tabs: new NavTabModels([{name: 'Project', active: false, url: '#nova'}, {name: 'Admin', active: true, url: '#syspanel'}]),
    top: new TopBarModel({title:'Overview:', subtitle: ''}),
    navs:  new NavTabModels([]),
    next: undefined,
    
    loginModel: undefined,
    instancesModel: undefined,
    
    timers: [],
    
    routes: {
        'auth/login': 'login',
        'auth/logout': 'logout'
    },
	
	initialize: function() {
	    this.loginModel = new LoginStatus();
	    this.instancesModel = new Instances();
	    this.rootView = new RootView({model:this.loginModel, auth_el: '#auth', root_el: '#root'});
	    this.route('', 'init', this.wrap(this.init, this.checkAuth));
	    this.route('#', 'init', this.wrap(this.init, this.checkAuth));
	    this.route('syspanel', 'syspanel', this.wrap(this.sys_overview, this.checkAuth));
	    this.route('syspanel/', 'syspanel', this.wrap(this.sys_overview, this.checkAuth));

	    this.route('nova', 'nova', this.wrap(this.nova_overview, this.checkAuth));
	    this.route('nova/', 'nova', this.wrap(this.nova_overview, this.checkAuth));
	    
	    this.route('nova/instances_and_volumes/', 'instances_and_volumes', this.wrap(this.nova_instances_and_volumes, this.checkAuth));
	    this.route('nova/access_and_security/', 'access_and_security', this.wrap(this.nova_access_and_security, this.checkAuth));
	    this.route('nova/images_and_snapshots/', 'images_and_snapshots', this.wrap(this.nova_images_and_snapshots, this.checkAuth));

	    this.route('home/', 'home', this.wrap(this.init, this.checkAuth));
	    this.route('syspanel/images/images/', 'images',  _.wrap(this.sys_images, this.checkAuth));
	    this.route('syspanel/instances/', 'instances',  _.wrap(this.sys_instances, this.checkAuth));
	    this.route('syspanel/services/', 'services',  _.wrap(this.sys_services, this.checkAuth));
	    this.route('syspanel/flavors/', 'flavors',  _.wrap(this.sys_flavors, this.checkAuth));
	    this.route('syspanel/flavors/create/', 'create_flavors',  _.wrap(this.sys_create_flavors, this.checkAuth));
	    this.route('syspanel/projects/', 'projects',  _.wrap(this.sys_projects, this.checkAuth));
	    this.route('syspanel/users/', 'users',  _.wrap(this.sys_users, this.checkAuth));
	    this.route('syspanel/quotas/', 'quotas',  _.wrap(this.sys_quotas, this.checkAuth));
	    
	    this.route('nova/instances_and_volumes/instances/:id/update', 'update_instance', this.wrap(this.update_instance, this.checkAuth));
	    
	},
	
	wrap: function(func, wrapper, arguments) {
	    var ArrayProto = Array.prototype;
        var slice = ArrayProto.slice;
        return function() {
          var args = [func].concat(slice.call(arguments, 0));
          return wrapper.apply(this, args);
        };
    },
	
	checkAuth: function(next, args) {
        if (!this.loginModel.get("loggedIn")) {
            this.rootView.options.next_view = Backbone.history.fragment; 
            window.location.href = "#auth/login";
            return;
        }
	    next(this, args);
	},
		
	init: function() {
        window.location.href = "#syspanel";
	},
	
	login: function() {
        this.rootView.renderAuth();
	},
	
	logout: function() {
        this.loginModel.clearAll();
        window.location.href = "#auth/login";
	},
	
	showRoot: function(self,option) {
        self.rootView.renderRoot();
        var navTabView = new NavTabView({el: '#navtab', model: self.tabs});
        navTabView.render();

        var topBarView = new TopBarView({el: '#topbar', model: self.top, loginModel: self.loginModel});
        topBarView.render();

        var sideBarView = new SideBarView({el: '#sidebar', model: self.navs, title: option});
        sideBarView.render();
	},
	
	showSysRoot: function(self, option) {
	    this.clear_fetch();
        self.navs = new NavTabModels([{name: 'Overview', active: true, url: '#syspanel/'}, 
                                    {name: 'Instances', active: false, url: '#syspanel/instances/'},
                                    {name: 'Services', active: false, url: '#syspanel/services/'},
                                    {name: 'Flavors', active: false, url: '#syspanel/flavors/'},
                                    {name: 'Images', active: false, url: '#syspanel/images/images/'},
                                    {name: 'Projects', active: false, url: '#syspanel/projects/'},
                                    {name: 'Users', active: false, url: '#syspanel/users/'},
                                    {name: 'Quotas', active: false, url: '#syspanel/quotas/'}
                                    ]);
        self.navs.setActive(option);
        self.tabs.setActive('Admin');
	    self.showRoot(self, 'System Panel');
	},
	
	sys_overview: function(self) {
	    self.showSysRoot(self, 'Overview');
	    var overview = new Overview();
	    var view = new SysOverviewView({model: overview, el: '#content'});
        view.render();
	},
	
	sys_images: function(self) {
	    self.showSysRoot(self, 'Images');
	    console.log("Images");
	    var images = new Images();
	    var view = new ImagesView({model: images, el: '#content'});
        view.render();
	},
	
	sys_instances: function(self) {
	    self.showSysRoot(self, 'Instances');
	    self.instancesModel.unbind("change");
	    self.add_fetch(self.instancesModel, 4);
	    var view = new InstanceView({model: self.instancesModel, el: '#content'});
        view.render();
	},
	
	sys_services: function(self) {
	    self.showSysRoot(self, 'Services');
	    console.log("Services");
	    var services = new Services();
	    var view = new ServiceView({model: services, el: '#content'});
        view.render();
	},
	
	sys_flavors: function(self) {
	    self.showSysRoot(self, 'Flavors');	
	    var flavors = new Flavors();
	    var view = new FlavorView({model: flavors, el: '#content'});
        view.render();
	},

	sys_create_flavors: function(self) {
	    var flavor = new Flavor();
	    var view = new FlavorCreateView({model: flavor, el: '#content'});
        view.rerender();
	},
	
	sys_projects: function(self) {
	    self.showSysRoot(self, 'Projects');
	    var projects = new Projects();
	    var view = new ProjectView({model:projects, el: '#content'});
        view.render();
	},
	
	sys_users: function(self) {
	    self.showSysRoot(self, 'Users');
	    var users = new Users();
	    var view = new UserView({model:users, el: '#content'});
        view.render();
	},
	
	sys_quotas: function(self) {
	    self.showSysRoot(self, 'Quotas');
	    var quotas = new Quotas();
	    var view = new QuotaView({model:quotas, el: '#content'});
        view.render();
	},
	
	showNovaRoot: function(self, option) {
        this.clear_fetch();
        self.navs = new NavTabModels([   {name: 'Overview', active: true, url: '#nova/'}, 
                            {name: 'Instances &amp; Volumes', active: false, url: '#nova/instances_and_volumes/'},
                            {name: 'Access &amp; Security', active: false, url: '#nova/access_and_security/'},
                            {name: 'Images &amp; Snapshots', active: false, url: '#nova/images_and_snapshots/'}
                            ]);
        self.navs.setActive(option);
        self.tabs.setActive('Project');
	    self.showRoot(self, 'Manage Compute');
	},
	
	nova_overview: function(self) {
	    self.showNovaRoot(self, 'Overview');
	    var view = new NovaOverviewView({el: '#content'});
        view.render();
	},
	
	nova_access_and_security: function(self) {
	    self.showNovaRoot(self, 'Access &amp; Security');
	    var view = new AccessAndSecurityView({el: '#content'});
        view.render();
	},
	
	nova_images_and_snapshots: function(self) {
	    self.showNovaRoot(self, 'Images &amp; Snapshots');
	    var view = new ImagesAndSnapshotsView({el: '#content'});
        view.render();
	},
	
	nova_instances_and_volumes: function(self) {
	    self.showNovaRoot(self, 'Instances &amp; Volumes');
	    self.add_fetch(self.instancesModel, 4);
	    var view = new InstancesAndVolumesView({model:self.instancesModel, el: '#content'});
        //view.render();
	},
	
	update_instance: function(self, id) {
	    console.log("Received update: " + id);
	    var instance = new Instance();
	    instance.set({"id": id});
        var view = new UpdateInstanceView({model:instance, el: 'body'});
        self.navigate('#nova/instances_and_volumes/', {trigger: false, replace: true});
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
	    console.log("Starging timer for " + model);
        var id = setInterval(function() {
            model.fetch();
        }, seconds*1000);
        
        this.timers.push(id);
	}
});


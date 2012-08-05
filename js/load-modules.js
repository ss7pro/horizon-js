
var MODULES = MODULES || {};

MODULES.Loader = (function(M, undefined) {
    "use strict";

    var custom_require, loadOS, loadRoutes, loadViews, loadModels, loadUtils,
        loadLibraries, getTemplates, loadModules;

    var fiRouter;

    custom_require = function (urls, callback) {
        var total = urls.length;
        var amount = 0;
        for (var index in urls) {
            var url = urls[index];
            if (navigator.userAgent.indexOf("MSIE") !=-1 || true) {
                url += "?random=" + Math.random()*99999;
                urls[index] = url;
            }
        }
        require(urls, callback);
    };

    loadOS = function() {
        $(document).ready(function(){
            var origin = window.location.protocol + "//" + window.location.host;
            UTILS.Auth.initialize(origin, "/api/keystone/v2.0/");
            M.R4C.Config.add({
              r4cfrontendEndpoint:  '/api/r4cfrontend'
            });
            M.Loader.fiRouter = new OSRouter();
            Backbone.history.start();
        });
    };

    loadRoutes = function() {
        M.Loader.custom_require([
                                    "js/routes/os-routes.js"
            ], function(someModule) {
                    M.Loader.loadOS();
            });
    };

    loadViews = function() {
        M.Loader.custom_require([
                                    "js/views/RootView.js",
                                    "js/views/RegisterView.js",
                                    "js/views/DebugView.js",
                                    "js/views/TopBarView.js",
                                    "js/views/LeftBarView.js",
                                    "js/views/ServerView.js",
                                    "js/views/DriveView.js",
                                    "js/views/FirewallView.js",
                                    "js/views/SnapshotView.js",
                                    "js/views/VncView.js",
                                    "js/views/PaymentView.js",
                                    "js/views/PaymentPromoCodeView.js",
                                    "js/views/PaymentFormView.js",
                                    "js/views/PaymentPayView.js",
                                    "js/views/CreateServerView.js",
                                    "js/views/EditServerView.js",
                                    "js/views/ConfirmModalView.js",
                                    "js/views/CreateDriveView.js",
                                    "js/views/ServerDetailsView.js",
                                    "js/views/EditDriveAttachmentsView.js"
            ], function(someModule) {
                    M.Loader.loadRoutes();
            });
    };

    loadModels = function() {

        M.Loader.custom_require([
                                   "js/models/LoginModel.js",
                                   "js/models/RegionModel.js",
                                   "js/models/TopBarModel.js",
                                   "js/models/LeftBarModel.js",
                                   "js/models/InstanceModel.js",
                                   "js/models/VolumeModel.js",
                                   "js/models/FlavorModel.js",
                                   "js/models/ImageModel.js",
                                   "js/models/KeyPairModel.js",
                                   "js/models/SecGroupModel.js",
                                   "js/models/PaymentModel.js",
                                   "js/models/RegisterModel.js",
                                   "js/models/PromoCodeModel.js",
                                   "js/models/RcProfileModel.js",
                                   "js/views/BaseView.js",
                                   "js/views/CreateModal.js"
            ], function(someModule) {
                    M.Loader.loadViews();
            });
    };

    loadUtils = function() {
        M.Loader.custom_require([
                                    "js/models/BaseNovaModel.js",
                                    "js/os-utils.js"
            ], function(someModule) {
                    UTILS.i18n.init();
                    M.Loader.loadModels();
            });
    };

    loadLibraries = function() {
        M.Loader.custom_require([
                                    "lib/backbone.js",
                                    "lib/jstack.js",
                                    "lib/bootstrap.min.js",
									"lib/jquery-ui-1.8.21.custom.min.js",
									"lib/jquery.dataTables.min.js"
            ], function(someModule) {
                    M.Loader.loadUtils();
            });
    };

    getTemplates = function() {
        M.Loader.custom_require([
                                    "js/load-templates.js"
            ], function(someModule) {
                loadTemplates([
                                "templates/registerTemplate.html",
                                "templates/notLoggedInTemplate.html",
                                "templates/rootTemplate.html",
                                "templates/debugTemplate.html",
                                "templates/topBarTemplate.html",
                                "templates/leftBarTemplate.html",
                                "templates/serverTemplate.html",
                                "templates/serverListTemplate.html",
                                "templates/driveTemplate.html",
                                "templates/driveListTemplate.html",
                                "templates/snapshotTemplate.html",
                                "templates/firewallTemplate.html",
                                "templates/vncTemplate.html",
                                "templates/vncIframeTemplate.html",
                                "templates/createServerFormTemplate.html",
                                "templates/editServerFormTemplate.html",
                                "templates/confirmTemplate.html",
                                "templates/paymentTemplate.html",
                                "templates/paymentPromoCodeTemplate.html",
                                "templates/paymentFormTemplate.html",
                                "templates/paymentPayTemplate.html",
                                "templates/createDriveFormTemplate.html",
                                "templates/serverDetailsTemplate.html",
                                "templates/serverDetailsDataTemplate.html",
                                "templates/editDriveAttachmentsFormTemplate.html"
                ], function(){
                        M.Loader.loadLibraries();
                });
        });
    };

    loadModules = function() {
        M.Loader.custom_require([
            "lib/jquery.js",
            "http://www.google.com/recaptcha/api/js/recaptcha_ajax.js",
			"lib/underscore.js"
            ], function(someModule) {
                M.Loader.custom_require(["lib/jquery.noty.js"]);
                M.Loader.getTemplates();
            });

    };

    return {
        fiRouter: fiRouter,
        custom_require: custom_require,
        loadOS: loadOS,
        loadRoutes: loadRoutes,
        loadViews: loadViews,
        loadModels: loadModels,
        loadUtils: loadUtils,
        loadLibraries: loadLibraries,
        getTemplates: getTemplates,
        loadModules: loadModules
    };

}(MODULES));

MODULES.R4C = (function(M, undefined) {

  var settings = {};
  var config = {
    add: function(options) {
      _.each(options, function(opt, key) {
        settings[key] = opt;
      });
    },
    get: function(name) {
      if(name === undefined) return _settings;
      return settings[name];
    }
  };

  var jQueryEscapeAttribute = function(str) {
    return str.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');
  }

  return {
    Config: config,
    jqEscape: jQueryEscapeAttribute
  }

})(MODULES);

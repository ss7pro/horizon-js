
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
            UTILS.Auth.initialize("http://178.239.138.10:5000/v2.0/");
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
                                    "js/views/DebugView.js"
            ], function(someModule) {
                    M.Loader.loadRoutes();
            });
    };

    loadModels = function() {

        M.Loader.custom_require([
                                   "js/models/LoginModel.js",
                                   "js/models/RegionModel.js"
            ], function(someModule) {
                    M.Loader.loadViews();
            });
    };

    loadUtils = function() {
        M.Loader.custom_require([
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
                                    "lib/bootstrap.min.js"
            ], function(someModule) {
                    M.Loader.loadUtils();
            });
    };

    getTemplates = function() {
        M.Loader.custom_require([
                                    "js/load-templates.js"
            ], function(someModule) {
                loadTemplates([
                                "templates/notLoggedInTemplate.html",
                                "templates/rootTemplate.html",
                                "templates/debugTemplate.html"

                ], function(){
                        M.Loader.loadLibraries();
                });
        });
    };

    loadModules = function() {
        M.Loader.custom_require([
                                    "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js",
                                    "lib/underscore.js"
            ], function(someModule) {
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

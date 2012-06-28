var ServerView = BaseView.extend({

    _template: _.itemplate($('#serverTemplate').html()),
    
    initialize: function () {
    },

    checkModels: function () {
        if(UTILS.Events.isFetchDataValid(this.options.instanceModel) &&
            UTILS.Events.isFetchDataValid(this.options.flavorModel) &&
            UTILS.Events.isFetchDataValid(this.options.imageModel)) {
            return (true);
        }
        return (false);
    },

    renderFirst: function () {
        $(this.el).empty().html(this._template());
        this.renderServer();
    },

    buildServerParams: function () {
        var params = {
                        instanceModel: this.options.instanceModel,
                        flavorModel: this.options.flavorModel,
                        imageModel: this.options.imageModel,
            };
        return (params);
    },

    renderServer: function () {
        var _ServerListTemplate =  _.itemplate($('#serverListTemplate').html());
        var params = this.buildServerParams(this);
        if (!this.checkModels(this)) {
            this.renderServerOnEmpty();
            return (this);
        }
        $("#serverList").empty().html(_ServerListTemplate(params));
        $("#serverLoading").fadeOut();
        return (this);
    },

    renderServerOnEmpty: function () {
        $("#serverList").empty()
        $("#serverLoading").fadeIn();
        return (this);
    }
    
});

var ServerDetailsView = BaseView.extend({

    _template: _.itemplate($('#serverDetailsTemplate').html()),

    events: {
    },

    initialize: function () {
    },

    checkModels: function () {
        if(UTILS.Events.isFetchDataValid(this.options.instanceModel) &&
            UTILS.Events.isFetchDataValid(this.options.flavorModel) &&
            UTILS.Events.isFetchDataValid(this.options.imageModel) &&
            UTILS.Events.isFetchDataValid(this.options.keyPairModel) &&
            UTILS.Events.isFetchDataValid(this.options.secGroupModel)) {
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
                        keyPairModel: this.options.keyPairModel,
                        secGroupModel: this.options.secGroupModel,
                        serverId: this.options.serverId
            };
        return (params);
    },

    renderServer: function () {
        var _ServerListTemplate =  _.itemplate($('#serverDetailsDataTemplate').html());
        var params = this.buildServerParams(this);
        if (!this.checkModels(this)) {
            this.renderServerOnEmpty();
            return (this);
        }
        $("#serverDetails").empty().html(_ServerListTemplate(params));
        $("#serverDetailsLoading").fadeOut();
        return (this);
    },

    renderServerOnEmpty: function () {
        $("#serverDetails").empty()
        $("#serverDetailsLoading").fadeIn();
        return (this);
    }

});

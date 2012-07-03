var VncView = BaseView.extend({

    _template: _.itemplate($('#vncTemplate').html()),
    
    initialize: function () {
        var self = this;
        var options = {};
        options.success = function(resp) {
            self.vncUrl = resp.console.url;
            self.renderVnc();
        }
        this.options.instance.vncconsole(options);

    },

    checkModels: function () {
        return (true);
    },

    renderFirst: function () {
        $(this.el).empty().html(this._template());
        this.renderVnc();
    },

    buildVncParams: function () {
        var params = {
                        instanceModel: this.options.instanceModel,
            };
        return (params);
    },

    renderVnc: function () {
        var _vncIframeTemplate = _.itemplate($('#vncIframeTemplate').html());
        var params = this.buildVncParams(this);
        if (!this.checkModels(this)) {
            this.renderVncOnEmpty();
            return (this);
        }
        $("#vncList").empty().html(_vncIframeTemplate({vncUrl: this.vncUrl}));
        $("#vncLoading").fadeOut();
        return (this);
    },

    renderVncOnEmpty: function () {
        $("#vncList").empty()
        $("#vncLoading").fadeIn();
        return (this);
    }
    
});

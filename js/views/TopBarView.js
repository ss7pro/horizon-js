var TopBarView = Backbone.View.extend({
    
    _template: _.itemplate($('#topBarTemplate').html()),
    
    initialize: function() {
        this.model.bind('change:title', this.render, this);
        this.model.bind('change:subtitle', this.render, this);
        this.options.loginModel.bind('change:username', this.render, this);
        this.options.loginModel.bind('switch-region', this.render, this);
    },
    
    render: function () {
        this.model.set({'username': this.options.loginModel.get('username')});
        var navs = this.model.get("navs");
        for (nidx in navs) {
            if (navs[nidx].name == this.model.get("active")) {
                this.model.set({'title': navs[nidx].desc});
            }
        }
        $(this.el).empty().html(this._template({model: this.model, loginModel: this.options.loginModel}));
        return this;
    }
});

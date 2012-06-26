var FirewallView = Backbone.View.extend({

    _template: _.itemplate($('#firewallTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        $(this.el).empty().html(this._template({}));
    },

    close: function() {
        $(this.el).empty();
    }

});

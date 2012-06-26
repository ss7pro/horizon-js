var ServerView = Backbone.View.extend({

    _template: _.itemplate($('#serverTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        $(this.el).empty().html(this._template({}));
    },

    close: function() {
        $(this.el).empty();
    }

});

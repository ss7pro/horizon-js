var DriveView = Backbone.View.extend({

    _template: _.itemplate($('#driveTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        $(this.el).empty().html(this._template({}));
    },

    close: function() {
        $(this.el).empty();
    }

});

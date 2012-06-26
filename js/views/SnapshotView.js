var SnapshotView = Backbone.View.extend({

    _template: _.itemplate($('#snapshotTemplate').html()),
    
    initialize: function() {
    },
    
    render: function () {
        $(this.el).empty().html(this._template({}));
    },

    close: function() {
        $(this.el).empty();
    }

});

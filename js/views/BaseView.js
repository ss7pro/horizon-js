var BaseView = Backbone.View.extend({

    renderFirst: function () {
        $(this.el).empty().html(this._template({}));
    },

    close: function() {
        this.undelegateEvents()
        $(this.el).empty();
    }

});


var LeftBarView = Backbone.View.extend({
 
    _template: _.itemplate($('#leftBarTemplate').html()),

    initialize: function() {
    },
    
    render: function () {
        $(this.el).empty().html(this._template());
        return this;
    }
    
});

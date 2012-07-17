var BaseNovaModel = Backbone.Model.extend({
    
    _action:function(method, options) {
        var xhr = this.sync(method, this, options);
        return xhr;
    }
    
});

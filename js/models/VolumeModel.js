var Volume = Backbone.Model.extend({
    
    _action:function(method, options) {
        var model = this;
        if (options == null) options = {};
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!=undefined) {
                options.callback(resp);
            }
        }
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },
    
    sync: function(method, model, options) {
        switch(method) {
            case "create":
                JSTACK.Nova.Volume.createvolume(model.get("size"), model.get("name"), model.get("description"), options.success);
                break;
            case "delete":
                JSTACK.Nova.Volume.deletevolume(model.get("id"), options.success);
                break;
            case "update":
                break;
            case "read":
                JSTACK.Nova.Volume.getvolume(model.get("id"), options.success);
                break;
        }
    },
    
    parse: function(resp) {
        if (resp.volume != undefined) {
            return resp.volume;
        } else {
            return resp;
        }
    }
});

var Volumes = Backbone.Collection.extend({
    
    model: Volume,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.Volume.getvolumelist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.volumes;
    }
    
});

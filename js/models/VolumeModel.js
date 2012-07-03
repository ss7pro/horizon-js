var Volume = BaseNovaModel.extend({
    
    sync: function(method, model, options) {
        switch(method) {
            case "create":
                JSTACK.Nova.Volume.createvolume(model.get("size"), model.get("name"), model.get("description"), options);
                break;
            case "delete":
                JSTACK.Nova.Volume.deletevolume(model.get("id"), options);
                break;
            case "update":
                break;
            case "read":
                JSTACK.Nova.Volume.getvolume(model.get("id"), options);
                break;
            case "snapshot":
                JSTACK.Nova.Volume.createsnapshot(model.get("id"), model.get("display_name"), model.get("display_name"), options);
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
                JSTACK.Nova.Volume.getvolumelist(true, options);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.volumes;
    }
    
});

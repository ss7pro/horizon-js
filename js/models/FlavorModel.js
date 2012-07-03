var Flavor = BaseNovaModel.extend({
});

var Flavors = Backbone.Collection.extend({
    model: Flavor,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getflavorlist(true, options);
                break;
        }
    },
    
    comparator: function(flavor) {
        return flavor.get("id");
    },
    
    parse: function(resp) {
        return resp.flavors;
    }
    
});

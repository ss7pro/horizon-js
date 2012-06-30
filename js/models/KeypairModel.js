var Keypair = Backbone.Model.extend({

    sync: function(method, model, options) {
            switch(method) {
                case "create":
                    JSTACK.Nova.createkeypair(model.get("name"),
                                                model.get("public_key"),
                                                options.success);
                    break;
                case "delete":
                    JSTACK.Nova.deletekeypair(model.get("name"),
                                                options.success);
                   break;
            }
    },

    parse: function(resp) {
        resp.keypair.id = resp.keypair.name;
        return (resp.keypair);
    }
   
});

var Keypairs = Backbone.Collection.extend({
    model: Keypair,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getkeypairlist(options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return (resp.keypairs);
    }
    
});

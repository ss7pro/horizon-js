var KeyPair = Backbone.Model.extend({

    sync: function(method, model, options) {
            switch(method) {
                case "create":
                    JSTACK.Nova.createkeypair(model.get("name"),
                                                model.get("public_key"),
                                                options);
                    break;
                case "delete":
                    JSTACK.Nova.deletekeypair(model.get("name"),
                                                options);
                   break;
            }
    },

    parse: function(resp) {
        resp.keypair.id = resp.keypair.name;
        return (resp.keypair);
    }
   
});

var KeyPairs = Backbone.Collection.extend({
    model: KeyPair,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getkeypairlist(options);
                break;
        }
    },
    
    parse: function(resp) {
        return (resp.keypairs);
    }
    
});

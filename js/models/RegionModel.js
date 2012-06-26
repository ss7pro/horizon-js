//
// (C) Tomasz Paszkowski <ss7pro@gmail.com>
//
//
var Region = Backbone.Model.extend({
});

var Regions = Backbone.Collection.extend({
    model: Region,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                var resp = JSTACK.Keystone.getregionlist();
                options.success(resp);
                break;
        }
    },
    
    parse: function(resp) {
        return(resp);
    }
    
});

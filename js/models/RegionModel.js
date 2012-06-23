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
                var resp = JSTACK.Keystone.getservicelist();
                options.success(resp);
                break;
        }
    },
    
    parse: function(resp) {
	var regions = {};
	for (var rindex in resp) {
		for (var eindex in resp[rindex].endpoints) {
			var rname = resp[rindex].endpoints[eindex].region;
			regions[rname] = true
		}
	}
	var list = [];
	for (var rindex in regions) {
		var region = {"name" : rindex};
		list.push(region);
	}
	return(list);
    }
    
});

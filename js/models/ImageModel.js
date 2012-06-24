var Image = Backbone.Model.extend({
	sync: function(method, model, options) {
	switch(method) {
		case "read":
			JSTACK.Nova.getimagedetail(model.get("id"), options.success);
		break;
	case "delete":
		JSTACK.Nova.deleteimage(model.get("id"), options.success);
		break;
	case "update":
		console.log("Updating Image: " + model.get("name"));
		JSTACK.Nova.updateimage(model.get("id"), model.get("name"), options.success);
		break;
	}
   },
   
	parse: function(resp) {
		if (resp.image != undefined) {
			return resp.image;
		} else {
		return resp;
		}
	}
});

var Images = Backbone.Collection.extend({
	model: Image,
    
	sync: function(method, model, options) {
		switch(method) {
			case "read":
	                JSTACK.Nova.getimagelist(true, options.success);
	                break;
	        }
	},
    
	parse: function(resp) {
		return resp.images;
	}
});

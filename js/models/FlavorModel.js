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
    },

    findFirstByRam: function(ram) {
      var tmp = this.filter(function(flav) {
        return flav.get('ram') == ram;
      });
      if(!tmp.length) return null;
      return tmp[0];
    },

    findFirstByCpu: function(vcpus) {
      var tmp = this.filter(function(flav) {
        return flav.get('vcpus') == vcpus;
      });
      if(!tmp.length) return null;
      return tmp[0];
    },

    findByRamAndCpu: function(ram, vcpus) {
      return this.filter(function(flav) {
        return flav.get('vcpus') == vcpus && flav.get('ram') == ram;
      });
    }
    
});

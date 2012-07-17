var SecGroupRule = Backbone.Model.extend({
    sync: function(method, model, options) {
        switch(method) {
            case "create":
                JSTACK.Nova.addsecgrouprule(model.get("from_port"),
                                            model.get("to_port"),
                                            model.get("ip_protocol"),
                                            model.get("parent_group_id"),
                                            model.get("cidr"),
                                            options);
                break;
            case "delete":
                JSTACK.Nova.delsecgrouprule(model.get("id"), options);
                break;
           }
   }
});

var SecGroupRules = Backbone.Collection.extend({
    model: SecGroupRule
});

var SecGroup = Backbone.Model.extend({

    sync: function(method, model, options) {
        switch(method) {
            case "create":
                JSTACK.Nova.createsecgroup(model.get("name"),
                                            model.get("description"),
                                            options);
                break;
            case "delete":
                JSTACK.Nova.delsecgroup(model.get("id"), options);
                break;
           }
   },

    parse: function(resp) {
        return (resp);
    }

});

var SecGroups = Backbone.Collection.extend({
    model: SecGroup,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getsecgrouplist(options);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.security_groups;
    }
    
});

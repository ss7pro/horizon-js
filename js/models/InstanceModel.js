var Instance = BaseNovaModel.extend({
    
    sync: function(method, model, options) {
        switch(method) {
            case "create":
                JSTACK.Nova.createserver(model.get("name"), model.get("imageReg"), model.get("flavorReg"), model.get("key_name"), 
                    model.get("user_data"), model.get("security_groups"), model.get("min_count"), model.get("max_count"), 
                    model.get("availability_zone"), options);
                break;
            case "delete":
                JSTACK.Nova.deleteserver(model.get("id"), options);
                break;
            case "update":
                JSTACK.Nova.updateserver(model.get("id"), model.get("name"), options);
                break;
            case "read":
                JSTACK.Nova.getserverdetail(model.get("id"), options);
                break;
            case "reboot":
                if (options.hasOwnProperty("soft") && options.soft) {
                    JSTACK.Nova.rebootserversoft(model.get("id"), options);
                } else {
                    JSTACK.Nova.rebootserverhard(model.get("id"), options);
                }
                break;
            case "resize":
                JSTACK.Nova.resizeserver(model.get("id"), options.flavor.id, options);
                break;
            case "snapshot":
                JSTACK.Nova.createimage(model.get("id"), model.get("name"),
                                            undefined,  options);
                break;
            case "confirm-resize":
                JSTACK.Nova.confirmresizedserver(model.get("id"), options);
                break;
            case "revert-resize":
                JSTACK.Nova.revertresizedserver(nmodel.get("id"), options);
                break;
            case "pause":
                JSTACK.Nova.pauseserver(model.get("id"), options);
                break;
            case "unpause":
                JSTACK.Nova.unpauseserver(model.get("id"), options);
                break;
            case "suspend":
                JSTACK.Nova.suspendserver(model.get("id"), options);
                break;
            case "resume":
                JSTACK.Nova.resumeserver(model.get("id"), options);
                break;
            case "start":
                JSTACK.Nova.startserver(model.get("id"), options);
                break;
            case "stop":
                JSTACK.Nova.stopserver(model.get("id"), options);
                break;
            case "change-password":
                JSTACK.Nova.changepasswordserver(model.get("id"), options.adminPass, options);
                break;
            case "create-image":
                JSTACK.Nova.createimage(model.get("id"), options);
                break;
            case "get-vncconsole":
                JSTACK.Nova.getvncconsole(model.get("id"), "novnc", options);
                break;
            case "consoleoutput":
                JSTACK.Nova.getconsoleoutput(model.get("id"), options.length, options);
                break;
            case "attachvolume":
                JSTACK.Nova.attachvolume(model.get("id"), options.volume_id, options.device, options);
                break;
            case "detachvolume":
                console.log("Detaching " + options.volume_id + " from " + model.get("id"));
                JSTACK.Nova.detachvolume(model.get("id"), options.volume_id, options);
                break;
            case "attachedvolumes":
                JSTACK.Nova.getattachedvolumes(model.get("id"), options);
                break;
        }
    },
    
    parse: function(resp) {
        if (resp.server != undefined) {
            return resp.server;
        } else {
            return resp;
        }
    }
});

var Instances = Backbone.Collection.extend({
    
    model: Instance,

    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getserverlist(true, this.alltenants, options);
                break;
        }
    },

    parse: function(resp) {
        return resp.servers;
    }
    
});

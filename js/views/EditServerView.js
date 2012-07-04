var EditServerView = CreateModalView.extend({

    edit: function () {
        var inputs = this.getInputsAndValidate();
        if(inputs.hasOwnProperty("invalid")) {
            return;
        }
        this.editServer(inputs);
        this.close();
    },

    getInputsAndValidate: function () {
        var invalid = [];
        var serverName = this.getInputVal("server_name");
        var serverDescription = this.getInputVal("server_description");
        var serverId = this.getInputVal("instance_id");
        if (serverName == undefined || !serverName.length) {
            invalid.push("serverName");
        }
        if (serverDescription == undefined) {
            serverDescription = "";
        }
        var ret = {
                serverName: serverName,
                serverDescription : serverDescription,
                serverId: serverId
            };
        if (invalid.length) {
            ret.invalid = invalid;
        }
        return (ret);
    },

    editServer: function (inputs) {
        var curServer = this.options.params.instanceModel.get(inputs.serverId);
        var changeSet = {};
        if (curServer == undefined) {
            //no such instance
            return;
        }
        if (curServer.get("name") != inputs.serverName) {
            changeSet["update"] = true;
        }
        if (curServer.get("metadata") != undefined) {
            if (curServer.get("metadata").hasOwnProperty("description")) {
                if (curServer.get("metadata").description !=
                    inputs.serverDescription)
                    changeSet["meta"] = true;
            } else if (inputs.serverDescription.length)
                changeSet["meta"] = true;
        } else{
            if (inputs.serverDescription.length)
                changeSet["meta"] = true;
                
        } 
        var server = new Instance ();
        server.set({
                    name: inputs.serverName,
                    meta: {"description" : inputs.serverDescription},
                    id: inputs.serverId
            });
        var modelsToReset = ["instanceModel"];
//update name
        if (changeSet.hasOwnProperty("update")) {
            var reqId = UTILS.Events.genRequestId();
            UTILS.Events.setRequestProperty(reqId, "modelsToReset",
                                            modelsToReset);
            UTILS.Events.setRequestProperty(reqId, "description", "Server " +
                                                "name edit request for: "  +
                                                inputs.serverName);
            server._action('update', UTILS.Events.requestHandlerDict(reqId));
        }

//update metadata
        if (changeSet.hasOwnProperty("meta")) {
            var reqId = UTILS.Events.genRequestId();
            UTILS.Events.setRequestProperty(reqId, "modelsToReset",
                                            modelsToReset);
            UTILS.Events.setRequestProperty(reqId, "description", "Server " +
                                            "meta edit request for: "  +
                                                inputs.serverName);
            server._action('updatemeta',
                            UTILS.Events.requestHandlerDict(reqId));
        }
    }

});

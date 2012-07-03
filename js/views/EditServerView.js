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
        var serverId = this.getInputVal("instance_id");
        if (serverName == undefined || !serverName.length) {
            invalid.push("serverName");
        }
        var ret = {
                serverName: serverName,
                serverId: serverId
            };
        if (invalid.length) {
            ret.invalid = invalid;
        }
        return (ret);
    },

    editServer: function (inputs) {
        var server = new Instance ();
        server.set({
                    name: inputs.serverName,
                    id: inputs.serverId
            });
        server._action("update", {success: function(model,response) {
                                            UTILS.Events.resetModelByName("instanceModel");
                                        }
                                    });
    }

});

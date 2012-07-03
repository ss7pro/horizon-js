var CreateServerView = CreateModalView.extend({

    create: function () {
        var inputs = this.getInputsAndValidate();
        if(inputs.hasOwnProperty("invalid")) {
            return;
        }
        this.createServer(inputs);
        this.close();
    },

    getInputsAndValidate: function () {
        var serverName = this.getInputVal("server_name");
        var flavorId = this.getSelectedOptionVal("id_flavor");
        var imageId = this.getSelectedOptionVal("id_image");
        var keyPairName = this.getSelectedOptionVal("name_keypair");
        var secGroupId = this.getSelectedOptionVal("id_secgroup");
        var invalid = [];
        if (serverName == undefined || !serverName.length) {
            invalid.push("serverName");
        }
        if (imageId == undefined || !imageId.length) {
            invalid.push("imageId");
        }
        if (flavorId == undefined || !flavorId.length) {
            invalid.push("flavorId");
        }
        if (secGroupId == undefined || !secGroupId.length) {
            invalid.push("secGroupId");
        }
        var ret = {
                serverName: serverName,
                flavorId: flavorId,
                imageId: imageId,
                keyPairName: keyPairName,
                secGroupId: secGroupId
            };
        if (invalid.length) {
            ret.invalid = invalid;
        }
        return (ret);
    },

    createServer: function (inputs) {
        var server = new Instance ();
        server.set({
                    name: inputs.serverName,
                    imageReg: inputs.imageId,
                    flavorReg: inputs.flavorId,
                    security_groups: inputs.security_groups,
                    min_count: 1,
                    max_count: 1
            });
        server.save(undefined, {success: function(model,response) {
                                            UTILS.Events.resetModelByName("instanceModel");
                                            alert(JSON.stringify(response));
                                        }
                                });
    }

});

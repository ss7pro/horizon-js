var CreateDriveView = CreateModalView.extend({

    create: function () {
        var inputs = this.getInputsAndValidate();
        if(inputs.hasOwnProperty("invalid")) {
            return;
        }
        this.createDrive(inputs);
        this.close();
    },

    getInputsAndValidate: function () {
        var driveName = this.getInputVal("drive_name");
        var driveDescription = this.getInputVal("drive_description");
        var driveSize = this.getInputVal("drive_size");
        var invalid = [];
        if (driveName == undefined || !driveName.length) {
            invalid.push("driveName");
        }
        if (driveSize == undefined || !(driveSize > 0)) {
            invalid.push("driveSize");
        }
        if (driveDescription == undefined || !driveDescription.length) {
            driveDescription = "";
        }
        var ret = {
                driveName: driveName,
                driveDescription: driveDescription,
                driveSize: driveSize,
            };
        if (invalid.length) {
            ret.invalid = invalid;
        }
        return (ret);
    },

    createDrive: function (inputs) {
        var volume = new Volume ();
        volume.set({
                name: inputs.driveName,
                description: inputs.driveDescription,
                size: inputs.driveSize
            });
        var reqId = UTILS.Events.genRequestId();
        var modelsToReset = ["instanceModel", "volumeModel"];
        UTILS.Events.setRequestProperty(reqId, "modelsToReset", modelsToReset);
        UTILS.Events.setRequestProperty(reqId, "description", "Drive " +
                                        "creation request for: "  +
                                        inputs.driveName);
        volume._action('create', UTILS.Events.requestHandlerDict(reqId));
    }

});

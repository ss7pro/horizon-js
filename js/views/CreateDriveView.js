var CreateDriveView = CreateModalView.extend({

    onShow: function() {
       var sizes = [1, 2, 5, 10, 20, 50, 100, 200, 500];

      $('#drive-slider').slider({
        min: 0,
        max: sizes.length - 1,
        animate: 'medium',
        disabled: false,
        value: 0,
        slide: function(e, ui) {
          $('#create_drive_modal #drive-value').text(sizes[ui.value]);
console.log(ui);
          $('#create_drive_modal #drive_size').val(sizes[ui.value]);
        }
      }).slider("value", 0);
    },

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
                driveSize: driveSize
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

        var that = this;
        volume._action('create', this.alert(reqId));
    }

});

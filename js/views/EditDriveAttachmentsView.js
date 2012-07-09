var EditDriveAttachmentsView = CreateModalView.extend({

    edit: function () {
        var inputs = this.getInputsAndValidate();
        if(inputs.hasOwnProperty("invalid")) {
            return;
        }
        this.editDriveAttachments(inputs);
        this.close();
    },

    getInputsAndValidate: function () {
        var invalid = [];
        var driveId = this.getInputVal("drive_id");
        if (driveId == undefined || !driveId.length) {
            invalid.push("driveId");
        }
        var ret = {
                driveId: driveId
            };
        if (invalid.length) {
            ret.invalid = invalid;
        }
        return (ret);
    },

    editDriveAttachments: function (inputs) {
        var curDrive = this.options.params.volumeModel.get(inputs.driveId);
        var changeSet = {};
        if (curDrive == undefined) {
            //no such volume
            return;
        }
    }

});

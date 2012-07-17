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
        var serverIdAttach = this.getSelectedOptionVal("server_id_attach");
        var ret = {
                driveId: driveId,
                serverIdAttach: serverIdAttach
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
        if (inputs.serverIdAttach != null && inputs.serverIdAttach.length) {
            this.attachDriveToServer(inputs.driveId, inputs.serverIdAttach);
        }
    },

    attachDriveToServer: function (driveId, serverId) {
        var serverModel = new Instance ();
        alert(driveId);
        serverModel.set({id:serverId, volume_id:driveId, device:"/dev/vdc"});
        UTILS.Servers.issueAction("attachvolume",serverModel);
    }

});

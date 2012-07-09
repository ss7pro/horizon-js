var DriveView = BaseView.extend({

    _template: _.itemplate($('#driveTemplate').html()),

    events: {
        "click .btn-create-drive"       :   "renderCreateDrive",
        "click .btn-delete"             :   "handleDriveActions",
        "click .btn-snapshot"           :   "handleDriveActions",
        "click .btn-edit-attachments"   :   "renderEditDriveAttachments"
    },

    
    initialize: function () {
    },

    checkModels: function () {
        if(UTILS.Events.isFetchDataValid(this.options.instanceModel) &&
            UTILS.Events.isFetchDataValid(this.options.volumeModel)) {
            return (true);
        }
        return (false);
    },


    renderFirst: function () {
        $(this.el).empty().html(this._template());
        this.renderDrive();
    },

    buildDriveParams: function (self) {
        var params = {
                        volumeModel: self.options.volumeModel,
                        instanceModel: self.options.instanceModel
            };
        return (params);
    },

    renderDrive: function () {
        var _DriveListTemplate =  _.itemplate($('#driveListTemplate').html());
        var params = this.buildDriveParams(this);
        if (!this.checkModels(this)) {
            this.renderDriveOnEmpty();
            return (this);
        }
        $("#driveList").empty().html(_DriveListTemplate(params));
        $("#driveLoading").fadeOut();
    },

    renderDriveOnEmpty: function () {
        $("#driveList").empty()
        $("#driveLoading").fadeIn();
    },

    renderCreateDrive: function () {
        var params = this.buildDriveParams(this);
        var subview = new CreateDriveView({
                                htmlTemplate: "#createDriveFormTemplate",
                                modalName: "create_drive_modal",
                                params: params,
                                el: "body"
                    });
        subview.render();
        return (this);
    },

    handleDriveActions: function (evt) {
        var confirmActions = [
                {
                    "name": "btn-delete",
                    action: "delete",
                    handler: this.issueActionOnDrive,
                    model: this.options.volumeModel,
                    title: "Delete volume ?",
                    btn: "Yes, I confirm",
                    body: "Please confirm. This action cannot be undone"
                 },
                {
                    "name": "btn-snapshot",
                    action: "snapshot",
                    handler: this.issueActionOnDrive,
                    model: this.options.volumeModel,
                    title: "Snapshot volume ?",
                    btn: "Yes, I confirm",
                    body: "Please confirm."
                 }
            ];
        var subview= new ConfirmModalView({ confirmActions: confirmActions,
                                            evt: evt,
                                            el: "body"
                                    });
        subview.render();
        return (this);
    },

    issueActionOnDrive: function (action, model, id) {
        var volumeModel = model.get(id);
        if (volumeModel == undefined) {
            return;
        }
        var reqId = UTILS.Events.genRequestId();
        var volumeName = volumeModel.get("display_name");
        var modelsToReset = ["instanceModel", "volumeModel"];
        UTILS.Events.setRequestProperty(reqId, "modelsToReset", modelsToReset);
        UTILS.Events.setRequestProperty(reqId, "description", "Request for: "  +
                                        action + " on volume: " + volumeName);
        volumeModel._action(action, UTILS.Events.requestHandlerDict(reqId));
    },

    renderEditDriveAttachments: function (evt) {
        var params = this.buildDriveParams(this);
        params["evt"] = evt;
        var subview = new EditDriveAttachmentsView({
                                htmlTemplate: "#editDriveAttachmentsFormTemplate",
                                modalName: "edit_drive_attachments_modal",
                                params: params,
                                action: "edit",
                                el: "body"
                    });
        subview.render();
        return (this);
    }
    
});

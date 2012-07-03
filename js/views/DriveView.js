var DriveView = BaseView.extend({

    _template: _.itemplate($('#driveTemplate').html()),

    events: {
        "click .btn-create-drive"       :   "renderCreateDrive",
        "click .btn-delete"             :   "handleDriveActions",
        "click .btn-snapshot"           :   "handleDriveActions"
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
                    model: this.options.instanceModel,
                    title: "Delete volume ?",
                    btn: "Yes, I confirm",
                    body: "Please confirm. This action cannot be undone"
                 },
                {
                    "name": "btn-snapshot",
                    action: "snapshot",
                    handler: this.issueActionOnDrive,
                    model: this.options.instanceModel,
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
        var volumeName = serverModel.get("display_name");
        serverModel._action(action, {success: function(reqId, response) {
                                            alert("Action: " + action + " on Volume: " + volumeName + " succseed.");
                                            UTILS.Events.resetModelByName("instanceModel");
                                            UTILS.Events.resetModelByName("volumeModel");
                                        }
                                    });
    }
    
});

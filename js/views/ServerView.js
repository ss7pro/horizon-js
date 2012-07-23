var ServerView = BaseView.extend({

    _template: _.itemplate($('#serverTemplate').html()),

    events: {
        "click .btn-create-server"      :   "renderCreateServer",
        "click .btn-edit-server"        :   "renderEditServer",
        "click .btn-terminate"          :   "handleServerActions",
        "click .btn-reboot"             :   "handleServerActions",
        "click .btn-snapshot"           :   "handleServerActions",
        "click .btn-start"              :   "handleServerActions",
        "click .btn-stop"               :   "handleServerActions",
        "click .btn-resume"             :   "handleServerActions",
        "click .btn-unpause"            :   "handleServerActions",
        "click  .vnc-link"              :   "renderVncServer"
    },

    initialize: function () {
      $('.btn-create-server')
        .click(this.renderCreateServer.bind(this))
        .show();
      
    },

    checkModels: function () {
    },

    checkModels: function () {
        if(UTILS.Events.isFetchDataValid(this.options.instanceModel) &&
            UTILS.Events.isFetchDataValid(this.options.flavorModel) &&
            UTILS.Events.isFetchDataValid(this.options.imageModel) &&
            UTILS.Events.isFetchDataValid(this.options.keyPairModel) &&
            UTILS.Events.isFetchDataValid(this.options.secGroupModel)) {
            return (true);
        }
        return (false);
    },

    renderFirst: function () {
        $(this.el).empty().html(this._template());
        this.renderServer();
    },

    buildServerParams: function () {
        var params = {
                        instanceModel: this.options.instanceModel,
                        flavorModel: this.options.flavorModel,
                        imageModel: this.options.imageModel,
                        keyPairModel: this.options.keyPairModel,
                        secGroupModel: this.options.secGroupModel
            };
        return (params);
    },

    renderServer: function () {
        var _ServerListTemplate =  _.itemplate($('#serverListTemplate').html());
        var params = this.buildServerParams(this);
        if (!this.checkModels(this)) {
            this.renderServerOnEmpty();
            return (this);
        }
        $("#serverList").empty().html(_ServerListTemplate(params));
        $("#serverLoading").fadeOut();
        return (this);
    },

    renderServerOnEmpty: function () {
        $("#serverList").empty()
        $("#serverLoading").fadeIn();
        return (this);
    },

    renderCreateServer: function (evt) {
        var params = this.buildServerParams(this);
        var subview = new CreateServerView({
                                htmlTemplate: "#createServerFormTemplate",
                                modalName: "create_server_modal",
                                params: params,
                                el: "body"
                    });
        subview.render();
        return (this);
    },

    renderEditServer: function (evt) {
        var params = this.buildServerParams(this);
        params["evt"] = evt;
        var subview = new EditServerView({
                                htmlTemplate: "#editServerFormTemplate",
                                modalName: "edit_server_modal",
                                params: params,
                                action: "edit",
                                el: "body"
                    });
        subview.render();
        return (this);
    },

    renderVncServer: function (evt) {
        evt.preventDefault();
        var params = this.buildServerParams(this);
        params["evt"] = evt;
        var subview = new VncView({
                                params: params,
                                el: "body"
                    });
        subview.render();
        return (this);
    },


    handleServerActions: function (evt) {
        var confirmIcon = '<img src="images/question-mark.png" class="confirm-icon">';
        var confirmActions = [
                {
                    "name": "btn-terminate",
                    action: "delete",
                    handler: this.issueActionOnServer,
                    model: this.options.instanceModel,
                    title: "Terminate server?",
                    btn: "Yes, I confirm.",
                    body: confirmIcon + "Please confirm. This action cannot be undone."
                 },
                {
                    "name": "btn-reboot",
                    action: "reboot",
                    handler: this.issueActionOnServer,
                    model: this.options.instanceModel,
                    title: "Reboot server?",
                    btn: "Yes, I confirm.",
                    body: confirmIcon + "Please confirm."
                },
                {
                    "name": "btn-start",
                    action: "start",
                    handler: this.issueActionOnServer,
                    model: this.options.instanceModel,
                    title: "Start server?",
                    btn: "Yes, I confirm.",
                    body: confirmIcon + "Please confirm."
                },
                {
                    "name": "btn-stop",
                    action: "stop",
                    handler: this.issueActionOnServer,
                    model: this.options.instanceModel,
                    title: "Stop server?",
                    btn: "Yes, I confirm.",
                    body: confirmIcon + "Please confirm."
                },
                {
                    "name": "btn-resume",
                    action: "resume",
                    handler: this.issueActionOnServer,
                    model: this.options.instanceModel,
                    title: "Resume server?",
                    btn: "Yes, I confirm.",
                    body: confirmIcon + "Please confirm."
                },
                {
                    "name": "btn-unpause",
                    action: "unpause",
                    handler: this.issueActionOnServer,
                    model: this.options.instanceModel,
                    title: "Unpause server?",
                    btn: "Yes, I confirm.",
                    body: confirmIcon + "Please confirm."
                },
                {
                    "name": "btn-snapshot",
                    action: "snapshot",
                    handler: this.issueActionOnServer,
                    model: this.options.instanceModel,
                    title: "Snapshot server?",
                    btn: "Yes, I confirm.",
                    body: confirmIcon + "Please confirm."
                }
            ];
        var subview= new ConfirmModalView({ confirmActions: confirmActions,
                                            evt: evt,
                                            el: "body"
                                    });
        subview.render();
        return (this);
    },

    issueActionOnServer: function (action, model, id) {
        var serverModel = model.get(id);
        if (serverModel == undefined) {
            return;
        }
        var serverName = serverModel.get("name");
        var reqId = UTILS.Events.genRequestId();
        var modelsToReset = ["instanceModel", "volumeModel"];
        if (action == "snapshot") {
            modelsToReset.push("imageModel");
        }
        UTILS.Events.setRequestProperty(reqId, "modelsToReset", modelsToReset);
        UTILS.Events.setRequestProperty(reqId, "description", "Request for: "  +
                                        action + " on server: " + serverName);
        serverModel._action(action, UTILS.Events.requestHandlerDict(reqId));
    }
    
});

var ConfirmModalView = Backbone.View.extend({

     _template: _.itemplate($('#confirmTemplate').html()),

    events: {
    },
    
    initialize: function() {
        this.undelegateEvents();
        if (!this.events.hasOwnProperty("hide")) {
            this.events["hide"] = "onHide";
        }
        if (!this.events.hasOwnProperty("click .modal-backdrop")) {
            this.events["click .modal-backdrop"] = "close";
        }
        if (!this.events.hasOwnProperty("click .btn-confirm")) {
            this.events["click .btn-confirm"] = "confirm";
        }
        this.delegateEvents(this.events);
        this.confirmParams = this.buildConfirmParams(this.options.evt,
                                                this.options.confirmActions);
        this.options.title = this.options.title ||
                                UTILS.i18n.pluralise("Are you sure?");
        this.options.btn_message = this.options.btn_message ||
                                UTILS.i18n.pluralise("Confirm");

    },

    buildConfirmParams: function (evt, confirmActions) {
        var onConfirmParams = {};
        for (var cidx in confirmActions) {
            if (evt.target.className.indexOf(confirmActions[cidx].name) >= 0) {
                onConfirmParams.action = confirmActions[cidx].action;
                onConfirmParams.handler = confirmActions[cidx].handler;
                onConfirmParams.model = confirmActions[cidx].model;
                onConfirmParams.id = evt.target.value;
                onConfirmParams.title = confirmActions[cidx].title;
                onConfirmParams.btn = confirmActions[cidx].btn;
                onConfirmParams.body = confirmActions[cidx].body;
                break;
            }
        }
        return (onConfirmParams);
    },

    onHide: function() {
        this.close();
    },

    render: function () {
        if ($(this.options.modalName).html() != null) {
            return;
        }
        $(this.el).append(this._template({
                                            title: this.confirmParams.title,
                                            btn: this.confirmParams.btn,
                                            body: this.confirmParams.body
                                        }));
        $('.modal:last').modal();
        return this;
    },

    confirm: function(evt){
        this.confirmParams.handler(this.confirmParams.action,
                                    this.confirmParams.model,
                                    this.confirmParams.id);
        this.close();
    },

    close: function(evt) {
        $('.modal:last').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    }

});

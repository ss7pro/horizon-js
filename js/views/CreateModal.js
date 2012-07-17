// this.options.htmlTemplate
// this.options.modalName
var CreateModalView = Backbone.View.extend({

    initialize: function() {
        var action;
        this.undelegateEvents();
        if (this.events === undefined) {
            this.events = {};
        }
        if (!this.events.hasOwnProperty("hide")) {
            this.events["hide"] = "onHide";
        }
        if (!this.events.hasOwnProperty("click .modal-backdrop")) {
            this.events["click .modal-backdrop"] = "close";
        }
        if (this.options.action !== undefined) {
            action = this.options.action;
        } else {
            action = "create";
        }
        if (!this.events.hasOwnProperty("click .btn-" + action)) {
            this.events["click .btn-" + action] = action;
        }
        this.delegateEvents(this.events);
        this._template = _.itemplate($(this.options.htmlTemplate).html());
    },

    onHide: function(evt) {
        this.close();
    },

    render: function () {
        if ($(this.options.modalName).html() != null) {
            return;
        }
        $(this.el).append(this._template(this.options.params));
        $('.modal:last').modal();
        this.onShow();
        return this;
    },

    getSelectedOptionVal: function (name) {
        return ($("#" + name + " option:selected").val());
    },

    getInputVal: function (name) {
        return ($("input[name=" + name + "]").val());
    },

    onShow: function() {
    },

    close: function(evt) {
        $('.modal:last').remove();
        $('.modal-backdrop').remove();
        this.undelegateEvents();
        this.unbind();
    },
    alert: function(reqId) {
        var obj = UTILS.Events.requestHandlerDict(reqId);
        var tmp = obj.success;
        obj.success = function(resp, status, xhr, reqData) {
            noty({"text":JSON.stringify(JSON.stringify(resp)),"theme":"noty_theme_twitter","layout":"topRight","type":"success","animateOpen":{"height":"toggle"},"animateClose":{"height":"toggle"},"speed":500,"timeout":25000,"closeButton":true,"closeOnSelfClick":true,"closeOnSelfOver":false,"modal":false});
            tmp.apply(obj, arguments);
        }
        return obj;
    }
});

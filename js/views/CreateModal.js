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
        console.log(reqId);
        var obj = UTILS.Events.requestHandlerDict(reqId);
        var tmp = obj.success;
        var cycki = jQuery.parseJSON(obj.success);
        obj.success = function(resp, status, xhr, reqData) {
          if(resp.server) {
            noty({"text":"<div><span class='s-black'>ID: </span>"+resp.server.id+"</div><div><span class='s-black'>OS-DCF: </span>"+resp.server['OS-DCF:diskConfig']+"</div><div><span class='s-black'>adminPass: </span>"+resp.server.adminPass+"</div><div><span class='s-black'>href: </span>"+resp.server.links[0].href+"</div>","theme":"noty_theme_twitter","layout":"topRight","type":"success","animateOpen":{"height":"toggle"},"animateClose":{"height":"toggle"},"speed":500,"timeout":25000,"closeButton":true,"closeOnSelfClick":true,"closeOnSelfOver":false,"modal":false});
            tmp.apply(obj, arguments);
          } else if (resp.volume) {
            noty({"text":"<div><span class='s-black'>Name: </span>"+resp.volume['display_name']+"</div><div><span class='s-black'>Description: </span>"+resp.volume['display_description']+"</div><div><span class='s-black'>ID: </span>"+resp.volume.id+"</div><div><span class='s-black'>Availability zone: </span>"+resp.volume['availability_zone']+"</div><div><span class='s-black'>Created at: </span>"+resp.volume['created_at']+"</div>","theme":"noty_theme_twitter","layout":"topRight","type":"success","animateOpen":{"height":"toggle"},"animateClose":{"height":"toggle"},"speed":500,"timeout":25000,"closeButton":true,"closeOnSelfClick":true,"closeOnSelfOver":false,"modal":false});
            tmp.apply(obj, arguments);
          }
        }
        return obj;
        
  },
});

var VncView = BaseView.extend({

    _template: _.itemplate($('#vncTemplate').html()),
    
    initialize: function () {
        if (this.options.params.evt.target.name == undefined)
            return;
        this.getVncLink(this.options.params.evt.target.name);
    },

    getVncLink: function (serverId) {
        var self = this;
        var server = this.options.params.instanceModel.get(serverId);
        var onSuccess = function (resp, status, xhr) {
            self.renderVnc(resp.console.url);
        }
        var onError = function (resp, status, xhr) {
            alert('error');
            self.getVncLink(serverId);
        }
        server._action("get-vncconsole",{success: onSuccess, error: onError});
    },

    checkModels: function () {
        return (true);
    },

    render: function () {
        this.vncWin = this.openVncWin();
        $(this.vncWin.document.body).empty().html(this._template());
/*
        this.renderVnc();
*/
    },




    popupCenter: function(title,w,h) {
      var left = (screen.width/2)-(w/2);
      var top = (screen.height/2)-(h/2);
      return window.open ('', title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    },


    openVncWin: function () {
        
        var vncWin = this.popupCenter("VncView",735,490);
//window.open('','VncView','location=0,titlebar=0,status=0,width=780,height=500');
        vncWin.focus();
        return (vncWin);
    },

    buildVncParams: function () {
        var params = {
                        instanceModel: this.options.params.instanceModel
            };
        return (params);
    },

    renderVnc: function (vncUrl) {
        var _vncIframeTemplate = _.itemplate($('#vncIframeTemplate').html());
        var params = this.buildVncParams(this);
        if (!this.checkModels(this)) {
            this.renderVncOnEmpty();
            return (this);
        }
        $("#vncList", this.vncWin.document).empty().html(_vncIframeTemplate({vncUrl: vncUrl}));
        $("#vncLoading", this.vncWin.document).fadeOut();
        return (this);
    },

    renderVncOnEmpty: function () {
        $("#vncList").empty()
        $("#vncLoading").fadeIn();
        return (this);
    }
    
});

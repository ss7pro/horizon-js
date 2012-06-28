var DebugView = BaseView.extend({

    _template: _.itemplate($("#debugTemplate").html()),
    toShow: undefined,

    
    initialize: function() {
        //name, object, collection==true or model==false
        this.toShow=  [
                    ["regionModel",this.options.regionModel,false,true],
                    ["instanceModel",this.options.instanceModel,true,true],
                    ["volumeModel",this.options.volumeModel,true,true],
                    ["flavorModel",this.options.flavorModel,true,true],
                    ["imageModel",this.options.imageModel,true,true]
                ];
        // force models fetchs
        for (var index in this.toShow) {
            if (this.toShow[index][3]) {
                UTILS.Events.wrapFetch(this.toShow[index][1]);
            }
        }
    },

    render: function () {
        $(this.el).empty().html(this._template());
        $("#debugLoading").fadeOut();
        for (var index in this.toShow) {
            var models;
            if (this.toShow[index][2]) {
                models = this.toShow[index][1].models;
            } else {
                models = this.toShow[index][1];
            }
            $("#" + this.toShow[index][0]).html(this.toShow[index][0] + "<pre>" + JSON.stringify(models) + "</pre>");
        }
        return (this);
    },

    renderOnEmpty: function  () {
        $(this.el).empty().html(this._template());
        $("#debugLoading").fadeIn();
        return (this);
    },

});


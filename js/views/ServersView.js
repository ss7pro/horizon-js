var DebugView = Backbone.View.extend({

    _template: _.itemplate($('#debugTemplate').html()),
    
    initialize: function() {
// name, variable, fetch ?, collection ?
        toShow = [
                    ["loginModel",this.options.loginModel,false,false],
                    ["regionModel",this.options.regionModel,true,false],
                    ["instanceModel",this.options.instanceModel,true,true],
                    ["volumeModel",this.options.volumeModel,true,true],
                    ["flavorModel",this.options.flavorModel,true,true],
                    ["imageModel",this.options.imageModel,true,true]
                ];
        for (var index in toShow) {
            if (toShow[index][2]) {
                toShow[index][1].fetch();
                toShow[index][1].unbind("reset");
                toShow[index][1].bind("reset", this.render, this);
            }
        }
    },
    
    render: function () {
        JSON.stringify(this.options.instanceModel);
        $(this.el).html(this._template({}));
        for (var index in toShow) {
            var models;
            if (toShow[index][3]) {
                models = toShow[index][1].models;
            } else {
                models = toShow[index][1];
            }
            $("#" + toShow[index][0]).html(toShow[index][0] + "<pre>" + JSON.stringify(models) + "</pre>");
        }
    },

});


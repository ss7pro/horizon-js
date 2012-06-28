var DriveView = BaseView.extend({

    _template: _.itemplate($('#driveTemplate').html()),
    
    initialize: function () {
    },

    renderFirst: function () {
        $(this.el).empty().html(this._template());
        if(UTILS.Events.isFetchDataValid(this.options.volumeModel)) {
            this.renderDrive();
        }
        
    },

    buildDriveParams: function (self) {
        var params = {
                        volumeModel: self.options.volumeModel,
            };
        return (params);
    },

    renderDrive: function () {
        var _DriveListTemplate =  _.itemplate($('#driveListTemplate').html());
        var params = this.buildDriveParams(this);
        $("#driveList").empty().html(_DriveListTemplate(params));
        $("#driveLoading").fadeOut();
    },

    renderDriveOnEmpty: function () {
        $("#driveList").empty()
        $("#driveLoading").fadeIn();
    }
    
});

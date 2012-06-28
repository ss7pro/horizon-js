var NovaVolumesView = Backbone.View.extend({
    
    _template: _.itemplate($('#novaVolumesTemplate').html()),
    
    dropdownId: undefined,
    
    events: {
        'change .checkbox_volumes':'enableDisableDeleteButton',
        'click .btn-create-volume':'onCreate',
        'click .btn-edit-volumes':'onEdit',
        'click .btn-delete-volume':'onDelete',
        'click .btn-camera':'onSnapshot',
        'click .btn-delete-group':'onDeleteGroup'
    },
    
    initialize: function() {
        this.model.unbind("reset");
        this.model.bind("reset", this.render, this);
        this.renderFirst();
    },
    
    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },
    
    onCreate: function(evt) {
        var subview = new CreateVolumeView({el: 'body'});
        subview.render();
    },
    
    onSnapshot: function(evt) {
        var volumeSnapshot = evt.target.value;
        var volumeSnap = this.model.get(volumeSnapshot);
        var subview = new CreateVolumeSnapshotView({el: 'body', model: volumeSnap});
        subview.render();
    },
    
    onEdit: function(evt) {
        var vol = evt.target.getAttribute("value");
        var volume = this.model.get(vol);
        var subview = new EditVolumeAttachmentsView({el: 'body', model: volume, instances: this.options.instances});
        subview.render();
    },
    
    onDelete: function(evt) {
        var volume = evt.target.value;
        var vol = this.model.get(volume);
        var subview = new ConfirmView({el: 'body', title: "Delete Volume", btn_message: "Delete Volume", onAccept: function() {
            vol.destroy();
            var subview = new MessagesView({el: '.topbar', state: "Success", title: "Volume "+vol.get("display_name")+" deleted."});     
            subview.render();
        }});
        
        subview.render();
    },
    
    onDeleteGroup: function(evt) {
        var self = this;
        var subview = new ConfirmView({el: 'body', title: "Delete Volume", btn_message: "Delete Volumes", onAccept: function() {
            $(".checkbox_volumes:checked").each(function () {
                    var volume = $(this).val(); 
                    var vol = self.model.get(volume);
                    vol.destroy();
                    var subview = new MessagesView({el: '.topbar', state: "Success", title: "Volume "+vol.get("display_name")+" deleted."});     
                    subview.render();
            });
        }});
        subview.render();
    },
    
    enableDisableDeleteButton: function () {
        if ($(".checkbox_volumes:checked").size() > 0) { 
            $("#volumes_delete").attr("disabled", false);
        } else {
            $("#volumes_delete").attr("disabled", true);
        }
        
    },

    showVolumes: function(model) {
        $(this.el).html(this._template({models:model.models}));
    },
    
    renderFirst: function() {
        this.showVolumes(this.model);
    },
        
    render: function () {
        this.showVolumes(this.model);
        this.enableDisableDeleteButton();
        return this;
    }
    
});

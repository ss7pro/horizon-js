var PaymentHistoryView = Backbone.View.extend({

  _rowTemplate: _.itemplate($('#paymentHistoryTemplate').html()),
  _headerTemplate: _.itemplate($('#paymentHistoryTemplateHeader').html()),

  initialize: function() {
    this.invoicesModel = this.options.invoicesModel;
    this.invoicesModel.on('reset', this.render, this);
    //this.invoicesModel.on('all', this.debug, this);
  },

  render: function() {
    var self = this;

    var $table = $('<table class="table table-hover table-condensed"/>');
    $table.append(self._headerTemplate());

    this.invoicesModel.each(function(model){
      $table.append(self._rowTemplate(model.toJSON()));
    });
    
    self.$el.empty().append($table);

    return this;
  },

  debug: function() {
    console.log(arguments);
  }
});

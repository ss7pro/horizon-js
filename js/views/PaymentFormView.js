var PaymentFormView = Backbone.View.extend({

  _template: _.itemplate($('#paymentFormTemplate').html()),

  initialize: function() {
    this.loginModel = this.options.loginModel;
  },

  render: function() {
    var self = this;
    self.$el.html(self._template());
    return this;
  }
});

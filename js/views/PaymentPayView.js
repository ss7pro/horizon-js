var PaymentPayView = Backbone.View.extend({

  _template: _.itemplate($('#paymentPayTemplate').html()),

  initialize: function() {
    this.loginModel = this.options.loginModel;
  },

  render: function() {
  }
});

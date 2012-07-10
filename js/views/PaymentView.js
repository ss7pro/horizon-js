var PaymentView = BaseView.extend({

  _template: _.itemplate($('#paymentTemplate').html()),

  initialize: function() {
  },

  render: function () {
    var self = this;
    self.$el.html(self._template());
    return this;
  }

});

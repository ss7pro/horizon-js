var PaymentView = BaseView.extend({

  _template: _.itemplate($('#paymentTemplate').html()),

  promoCodeView: undefined,
  formView: undefined,

  initialize: function() {
    this.loginModel = this.options.loginModel;
    this.profileModel = this.options.profileModel;
  },

  renderFirst: function() {
    return this.render();
  },

  render: function() {
    var self = this;
    self.$el.html(self._template());

    this.promoCodeView = new PaymentPromoCodeView({
      loginModel: this.loginModel,
      el: self.$('#payment_promo_code')
    }).render();

    this.formView = new PaymentFormView({
      loginModel: this.loginModel,
      profileModel: this.profileModel,
      el: self.$('#payment_form')
    }).render();

    return this;
  }

});

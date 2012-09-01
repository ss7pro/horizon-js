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

    this.showPage(this.options.page);

    return this;
  },

  showPage: function(name) {

    this.$el.find('.page').hide();
    switch(name)
    {
      case 'history':
        this.$el.find('#payment_history').show();
        break;
      case 'success':
        this.$el.find('#payment_success').show();
        break;
      case 'error':
        this.$el.find('#payment_error').show();
        break;
      default:
        this.$el.find('#payment_promo_code').show();
        this.$el.find('#payment_form').show();
    }


  }

});

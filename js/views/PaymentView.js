var PaymentView = BaseView.extend({

  _template: _.itemplate($('#paymentTemplate').html()),

  initialize: function() {
    this.loginModel = this.options.loginModel;
    this.promoCodeModel = new PromoCodeModel();
    this.promoCodeModel.on('sync',  this.debug, this);
    this.promoCodeModel.on('error', this.debug, this);
  },

  events: {
    'click #charge': 'charge'
  },

  charge: function(e) {
    e.preventDefault();
    this.promoCodeModel.set('code', this.$('#code').val());
    this.promoCodeModel.set('token', this.loginModel.get('token'));
    if(this.loginModel.get('tenant')) {
      this.promoCodeModel.set('tenant_id', this.loginModel.get('tenant').id);
    }
    this.promoCodeModel.save();
  },

  debug: function() {
    console.log(arguments);
  },

  render: function () {
    var self = this;
    self.$el.html(self._template());
    return this;
  }

});

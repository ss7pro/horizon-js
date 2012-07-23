var PaymentView = BaseView.extend({

  _template: _.itemplate($('#paymentTemplate').html()),

  initialize: function() {
    this.loginModel = this.options.loginModel;
    this.promoCodeModel = new PromoCodeModel();
    this.promoCodeModel.on('sync',  this.chargeSuccess, this);
    this.promoCodeModel.on('error', this.chargeError,   this);
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

  chargeSuccess: function() {
    var value = this.promoCodeModel.get('value');
    this.setMessage('code', 'Your account has been charged with $' + value);
  },

  chargeError: function(model, xhr) {
    try {
      var resp = JSON.parse(xhr.responseText);
      if(resp.errors && resp.errors.fields && resp.errors.fields.code) {
        this.setError('code', resp.errors.fields.code);
      } else if(resp.errors && resp.errors.globals && resp.errors.globals.length > 0) {
        this.setError('code', resp.errors.globals[0]);
      } else {
        this.setError('code', 'Unknown error');
      }
    } catch(err) {
      this.setError('code', 'Unknown error');
    }
  },

  debug: function() {
    console.log(arguments);
  },

  setError: function(name, msg) {
    name = this._jqEscape(name);
    this.$('[name="' + name + '"]')
      .parents('.control-group')
      .addClass('error')
      .find('span.help')
      .text(msg);
  },

  setMessage: function(name, msg) {
    name = this._jqEscape(name);
    this.$('[name="' + name + '"]')
      .parents('.control-group')
      .removeClass('error')
      .find('span.help')
      .text(msg);
  },

  _jqEscape: function(str) {
    return str.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');
  },

  render: function () {
    var self = this;
    self.$el.html(self._template());
    return this;
  }

});

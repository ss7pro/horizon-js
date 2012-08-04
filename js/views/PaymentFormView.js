var PaymentFormView = Backbone.View.extend({

  _template: _.itemplate($('#paymentFormTemplate').html()),

  initialize: function() {
    this.loginModel = this.options.loginModel;
    this.model = new PaymentModel();
    this.model.set('tenant_api_id', this.loginModel.get('tenant').id);
    //this.model.on('all', this.debug, this);
    this.model.on('change:invoice', this.changeInvoice, this);
    this.model.on('sync' , this.saveSuccess, this);
    this.model.on('error', this.saveError,   this);
  },

  events: {
    'change input'               : 'updateModel',
    'change select'              : 'updateModel',
    'keyup input[type=text]'     : 'updateModel',
    'click #btn-payment'         : 'doPayment' 
  },

  render: function() {
    var self = this;
    self.$el.html(self._template());
    self.updateView();
    self.changeInvoice();
    return this;
  },

  debug: function() {
    console.log(arguments);
  },

  updateModel: function(e) {
    if(e.target.type == 'checkbox') {
      this.model.set(e.target.name, e.target.checked ? e.target.value : '');
    } else {
      this.model.set(e.target.name, e.target.value);
    }
  },

  updateView: function() {
    _.each(this.model.attributes, function(value, name) {
      name = MODULES.R4C.jqEscape(name);
      var $el = this.$('[name="' + name + '"]');
      if($el.attr('type') == 'radio') {
        value = MODULES.R4C.jqEscape(value);
        $el.filter('[value="' + value + '"]').attr('checked', true);
      } else if($el.attr('type') == 'checkbox') {
        $el.attr('checked', value == '1');
      } else {
        $el.val(value);
      }
    }, this);
  },

  changeInvoice: function() {
    this.$('.invoice').attr('disabled', this.model.get('invoice') != '1');
  },

  doPayment: function(e) {
    e.preventDefault();
    this.model.set('payment_id', null);
    this.model.save();
  },

  saveSuccess: function(model, resp) {
    this.clearErrors();
    this.renderPaymentPay();
  },

  renderPaymentPay: function() {
    this.paymentPayView = new PaymentPayView({
      htmlTemplate: "#paymentPayTemplate",
      modalName: "payment_pay_modal",
      paymentModel: this.model,
      params: {},
      el: "body"
    });
    this.paymentPayView.render();
  },

  saveError: function(model, resp) {
    if(resp.responseText) {
      try {
        var resp = JSON.parse(resp.responseText);
        if(resp.errors && resp.errors.fields) {
          this.clearErrors();
          _.each(resp.errors.fields, function(msg, name){
            this.setError(name, msg);
          }, this);
          return;
        }
      } catch(err) {
        console.log(err)
      }
    }
    console.log(resp);
  },

  clearErrors: function() {
    this.$('.error').removeClass('error');
    this.$('span.help').text('');
  },

  setError: function(name, msg) {
    name = MODULES.R4C.jqEscape(name);
    this.$('[name="' + name + '"]')
      .parents('.control-group')
      .addClass('error')
      .find('span.help')
      .text(msg);
  }


});

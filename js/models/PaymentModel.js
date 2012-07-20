var PaymentModel = Backbone.Model.extend({
  urlRoot: function() {
    return MODULES.R4C.Config.get('paymentEndpoint')
  },
  defaults: {
    code: '',
    tenant_id: '',
    token: '',
    value: '',
    used_at: ''
  }

});

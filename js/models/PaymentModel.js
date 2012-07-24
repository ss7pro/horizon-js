var PaymentModel = Backbone.Model.extend({
  urlRoot: function() {
    return MODULES.R4C.Config.get('paymentEndpoint')
  },
  idAttribute: 'payment_id',
  defaults: {
    'payment_id': null,
    'amount': '100',
    'tenant_api_id': '',
    'session_id': '',
    'first_name': 'aa',
    'last_name': 'bb',
    'email': 'cc',
    'invoice': '',
    'company_name': '',
    'street': '',
    'post_code': '',
    'city': '',
    'nip': ''
  },
  parse: function(resp) {
    if(resp.response) return resp.response;
    return resp;
  }
});

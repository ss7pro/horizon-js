var InvoiceModel = Backbone.Model.extend({
  urlRoot: function() {
    return MODULES.R4C.Config.get('r4cfrontendEndpoint') + '/invoice'
  },
  idAttribute: 'payment_id',
  defaults: {
    payment_id: null,
    invoice_url: '',
    status: ''
  },
  parse: MODULES.R4C.parse,
  sync: MODULES.R4C.sync,
});

var Invoices = Backbone.Collection.extend({
  model: InvoiceModel,
  url: function() {
    return MODULES.R4C.Config.get('r4cfrontendEndpoint') + '/invoice'
  },
  parse: MODULES.R4C.parse,
  sync: MODULES.R4C.sync,
});

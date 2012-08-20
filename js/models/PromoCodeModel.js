var PromoCodeModel = Backbone.Model.extend({
  urlRoot: function() {
    return MODULES.R4C.Config.get('r4cfrontendEndpoint') + '/billing/promo_code';
  },
  defaults: {
    code: '',
    tenant_id: '',
    token: '',
    value: '',
    used_at: ''
  }
});

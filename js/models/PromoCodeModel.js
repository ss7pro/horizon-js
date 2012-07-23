var PromoCodeModel = Backbone.Model.extend({
  urlRoot: function() {
    return MODULES.Config.get('promoCodeEndpoint')
  },
  defaults: {
    code: '',
    tenant_id: '',
    token: '',
    value: '',
    used_at: ''
  }
});

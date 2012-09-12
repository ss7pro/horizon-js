var RcProfile = Backbone.Model.extend({
  idAttribute: 'account[profile][api_id]',
  defaults: {
    'account[profile][api_id]': null,
    'account[profile][title]': '',
    'account[profile][email]': '',
    'account[profile][first_name]': '',
    'account[profile][last_name]': '',
    'account[tenant][type]': '1',
    'account[tenant][company_name]': '',
    'account[tenant][nip]': '',
    'account[tenant][www]': '',
    'account[account_address][street]': '',
    'account[account_address][post_code]': '',
    'account[account_address][city]': '',
    'account[account_address][phone]': '',
    'account[invoice_address][street]': '',
    'account[invoice_address][post_code]': '',
    'account[invoice_address][city]': '',
    'account[invoice_address][phone]': '',
  },
  urlRoot: function() {
    return MODULES.R4C.Config.get('r4cfrontendEndpoint') + '/profile';
  },
  parse: MODULES.R4C.parse,
  sync: MODULES.R4C.sync,
  isCompany: function() {
    return this.get('account[tenant][type]') == '1';
  },
  copyAddress: function() {
    _.each(['street', 'post_code', 'city', 'phone'], function(key) {
      var src = 'account[account_address][' + key + ']';
      var dst = 'account[invoice_address][' + key + ']';
      this.set(dst, this.get(src));
    }, this);
  },
  setUserId: function(userId) {
    this.set('account[profile][api_id]', userId);
  }
});

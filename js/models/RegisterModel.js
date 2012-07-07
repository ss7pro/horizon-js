var Register = Backbone.Model.extend({
  defaults: {
    'registration[profile][username]': '',
    'registration[profile][password]': '',
    'registration[profile][password_again]': '',
    'registration[profile][title]': '',
    'registration[profile][first_name]': '',
    'registration[profile][last_name]': '',
    'registration[tenant][type]': '1',
    'registration[tenant][company_name]': '',
    'registration[tenant][nip]': '',
    'registration[tenant][www]': '',
    'registration[account_address][street]': '',
    'registration[account_address][post_code]': '',
    'registration[account_address][city]': '',
    'registration[account_address][phone]': '',
    'registration[invoice_address][street]': '',
    'registration[invoice_address][post_code]': '',
    'registration[invoice_address][city]': '',
    'registration[invoice_address][phone]': ''
  },
  sync: function(method, model, options) {
    switch(method) {
      case 'create':
        var url = 'http://178.239.138.10:8081/main_dev.php/registration/register';
        $.post(url, $.param(model.toJSON()), function(resp) {
          resp = model.parse(resp);
          model.trigger('sync', model, resp, options);
        }, 'json')
        .error(function(xhr) {
          try {
            var resp = JSON.parse(xhr.responseText);
            model.trigger('error', model, resp, options);
          } catch(err) {
            model.trigger('error', model, err, options);
          }
        });
        break;
      default:
        console.log('invalid register method: ' + method);
    }
  },
  parse: function(resp) {
    return resp;
  },
  getUsername: function() {
    return this.get('registration[profile][username]')
  },
  getPassword: function() {
    return this.get('registration[profile][password]')
  },
  isCompany: function() {
    return this.get('registration[tenant][type]') == '1';
  },
  copyAddress: function() {
    _.each(['street', 'post_code', 'city', 'phone'], function(key) {
      var src = 'registration[account_address][' + key + ']';
      var dst = 'registration[invoice_address][' + key + ']';
      this.set(dst, this.get(src));
    }, this);
  }
});

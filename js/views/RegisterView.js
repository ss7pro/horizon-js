var RegisterView = Backbone.View.extend({
    
  _template: _.itemplate($('#registerTemplate').html()),
  
  initialize: function() {
    this.model = new Register();
    this.model.on('sync' , this.saveSuccess, this);
    this.model.on('error', this.saveError,   this);
  },
  
  events: {
    'click  a#register-btn'      : 'register',
    'click  a#register-back-btn' : 'confirmBack',
    'click  a#confirm-btn'       : 'confirm',
    'click  a#copy-address'      : 'copyAddress',
    'change select'              : 'updateModel',
    'change input'               : 'updateModel',
    'keyup  input[type=text]'    : 'updateModel',
    'keyup  input[type=password]': 'updateModel',
    'change input.company_type'  : 'updateView'
  },

  render: function () {
    var self = this;
    var model = this.model;
    this.$el.hide();
    this.$el.html(self._template());
    this.updateView();
    Recaptcha.create("6LffzNMSAAAAAGDlUb8oV2G4QceRErUZfXNwGc9A", 'registration_captcha', {
      theme: 'clean',
      callback: function() {
        model.set('recaptcha_challenge_field', Recaptcha.get_challenge());
        model.set('recaptcha_response_field', Recaptcha.get_response());
      }
    });
    return this;
  },

  updateModel: function(e) {
    this.model.set(e.target.name, e.target.value);
    if(!this.model.isCompany()) {
      _.each(['street', 'post_code', 'city', 'phone'], function(key) {
        this.model.set('registration[invoice_address][' + key + ']', '');
      }, this);
      _.each(['company_name', 'nip', 'www'], function(key) {
        this.model.set('registration[tenant][' + key + ']', '');
      }, this);
    }
  },

  updateView: function() {
    _.each(this.model.attributes, function(value, name) {
      name = MODULES.R4C.jqEscape(name);
      var $el = this.$('[name="' + name + '"]');
      if($el.attr('type') == 'radio') {
        value = MODULES.R4C.jqEscape(value);
        $el.filter('[value="' + value + '"]').attr('checked', true);
      } else {
        $el.val(value);
      }
    }, this);
    this.$('.company').attr('disabled', !this.model.isCompany());
  },

  updateConfirmView: function() {
    this.$('#confirm_email').text(this.model.get('registration[profile][username]'));
    this.$('#confirm_name').text(
      this.model.get('registration[profile][title]') + ' ' +
      this.model.get('registration[profile][first_name]') + ' ' +
      this.model.get('registration[profile][last_name]')
    );
    this.$('#confirm_address').text(
      this.model.get('registration[account_address][street]') + ', ' +
      this.model.get('registration[account_address][post_code]') + ' ' +
      this.model.get('registration[account_address][city]') + ', ' +
      this.model.get('registration[account_address][phone]')
    );
    this.$('#confirm_company_name').text(this.model.get('registration[tenant][company_name]'));
    this.$('#confirm_company_address').text(
      this.model.get('registration[invoice_address][street]') + ', ' +
      this.model.get('registration[invoice_address][post_code]') + ' ' +
      this.model.get('registration[invoice_address][city]') + ', ' +
      this.model.get('registration[invoice_address][phone]')
    );
    this.$('#confirm_company_nip').text(this.model.get('registration[tenant][nip]'));
    this.$('#confirm_company_www').text(this.model.get('registration[tenant][www]'));
  },

  copyAddress: function(e) {
    e.preventDefault();
    this.model.copyAddress();
    this.updateView();
  },

  confirm: function(e) {
    e.preventDefault();
    this.updateConfirmView();
    this.showPage('#page_confirm');
  },

  confirmBack: function(e) {
    e.preventDefault();
    this.showPage('#page_form');
  },

  register: function(e) {
    e.preventDefault();
    this.model.save();
  },

  saveSuccess: function(model, resp) {
    this.clearErrors();
    this.options.loginModel.setCredentials(model.getUsername(), model.getPassword());
  },

  saveError: function(model, resp) {
    if(resp.errors && resp.errors.fields) {
      this.clearErrors();
      _.each(resp.errors.fields, function(msg, name){
        this.setError(name, msg);
      }, this);
      this.showPage('#page_form');
      return;
    }
    console.log(resp);
  },

  authSuccess: function() {
    this.redirectIfAuthenticated();
  },

  authError: function(msg) {
    console.log(msg);
  },

  redirectIfAuthenticated: function() {
    if(this.options.loginModel.get('loggedIn') == true) {
      this.hide(function(){
        window.location.hash = '#debug';
      });
    }
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
  },

  showPage: function(id) {
    var self = this;
    self.$('.page').fadeOut(function() {
      self.$(id).fadeIn();
    });
  },

  show: function(callback) {
    this.redirectIfAuthenticated();
    this.delegateEvents();
    this.options.loginModel.on('change:loggedIn', this.authSuccess, this);
    this.options.loginModel.on('auth-error',      this.authError,   this);
    this.$el.fadeIn(callback || function(){});
  },

  hide: function(callback) {
    this.undelegateEvents();
    this.options.loginModel.off('change:loggedIn', this.authSuccess, this);
    this.options.loginModel.off('auth-error',      this.authError,   this);
    this.$el.fadeOut(callback || function(){});
  }
});


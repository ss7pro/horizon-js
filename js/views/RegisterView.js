var RegisterView = Backbone.View.extend({
    
  _template: _.itemplate($('#registerTemplate').html()),
  
  initialize: function() {
    this.redirectIfAuthenticated();
    this.model = new Register();
    this.model.bind('sync' , this.saveSuccess, this);
    this.model.bind('error', this.saveError,   this);
    this.options.loginModel.bind('change:loggedIn', this.authSuccess, this);
    this.options.loginModel.bind('auth-error',      this.authError,   this);
  },
  
  events: {
    'change input.company_type' : 'toggleCompany',
    'click a#register-btn'      : 'register',
  },

  render: function () {
    var self = this;
    this.$el.hide();
    this.$el.html(self._template());
    this.toggleCompany();
    return this;
  },

  toggleCompany: function() {
    var isCompany = this.$('input.company_type:checked').val() == '1';
    this.$('.company').attr('disabled', !isCompany);
  },
  
  register: function(e) {
    e.preventDefault();
    var data = {};
    this.$('input[type="email"], input[type="text"], input[type="password"], select, input[type="radio"]:checked').each(function(i,v) {
      data[v.name] = v.value;
    });
    this.model.set(data);
    this.model.save();
  },

  saveSuccess: function(model, resp) {
    this.clearErrors();
    this.options.loginModel.setCredentials(model.getUsername(), model.getPassword());
  },

  saveError: function(model, resp) {
    if(resp.errors && resp.errors.fields) {
      _.each(resp.errors.fields, function(msg, name){
        this.setError(name, msg);
      }, this);
      return;
    }
    console.log(resp);
  },

  authSuccess: function() {
    this.redirectIfAuthenticated();
  },

  authError: function(msg) {
    //TODO: handle auth error
    console.log(msg);
  },

  redirectIfAuthenticated: function() {
    if(this.options.loginModel.get('loggedIn') == true) {
      this.hide(function(){
        window.location.hash = '#debug';
      });
    }
  },

  clearErrors: function(e) {
    this.$('form .error').removeClass('error');
    this.$('form span.help').text('');
  },

  setError: function(name, msg) {
    name = this._jqEscape(name);
    this.$('form [name="' + name + '"]')
      .parents('.control-group')
      .addClass('error')
      .find('span.help')
      .text(msg);
  },

  _jqEscape: function(str) {
    return str.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');
  },

  show: function(callback) {
    this.$el.fadeIn(callback || function(){});
  },

  hide: function(callback) {
    this.$el.fadeOut(callback || function(){});
  }
});


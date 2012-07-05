var RegisterView = Backbone.View.extend({
    
  _template: _.itemplate($('#registerTemplate').html()),
  
  initialize: function() {
    this.model = new Register();
    this.model.bind('sync', this.saveSuccess, this);
    this.model.bind('error', this.saveError, this);
    //this.model.bind('all', function(){ console.log(arguments); });
  },
  
  events: {
    'change input.company_type': 'toggleCompany',
    'click a#register-btn': 'register',
    'click a#clear-btn': 'clearErrors'
  },

  render: function () {
    var self = this;
    
    self.$el.fadeOut('slow', function() {
      $('#root').css('display','none');
      self.$el.html(self._template({}));
      self.$el.fadeIn('slow');
    });
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
    if(this.validate()) {
      this.save();
    }
  },

  save: function() {
    this.model.save();
  },

  saveSuccess: function(model, resp) {

  },

  saveError: function(model, resp) {
    if(resp.errors && resp.errors.fields) {
      _.each(resp.errors.fields, function(msg, name){
        this.setError(name, msg);
      }, this);
    }
  },

  clearErrors: function(e) {
    e.preventDefault();
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

  validate: function() {
    return true; 
  },

  _isValidEmail: function(value) {
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
  }

});


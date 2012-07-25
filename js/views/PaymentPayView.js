var PaymentPayView = CreateModalView.extend({

  events: {
    'click li': 'selectMethod'
  },

  onShow: function() {
    var self = this;
    this.paymentModel = this.options.paymentModel;
    if(window.PlnPayTypeArray === undefined) {
      var pos_id = this.paymentModel.get('pos_id');
      var pay_type_key = this.paymentModel.get('pay_type_key');
      var pay_type_url = this.paymentModel.get('pay_type_url');
      require([pay_type_url], function(){
        self.renderPaymentTypes(window.PlnPayTypeArray);
      });
    } else {
      self.renderPaymentTypes(window.PlnPayTypeArray);
    }
    var fields = [
      'amount', 'first_name', 'last_name', 'email', 'phone', 'desc',
      'pos_id', 'pos_auth_key', 'session_id', 'client_ip', 'payment_id',
    ];
    _.each(fields, function(field) {
      this.$('#payment_' + field).val(this.paymentModel.get(field));
    }, this);
    this.$('#payment_form').attr('action', this.paymentModel.get('payment_url'));
  },

  renderPaymentTypes: function(types) {
    _.each(types, function(type) {
      if(!type.enable) return;
      var id = 'payment_type_' + type.type;
      var $img = $('<img/>').attr('src', type.img);
      var $input = $('<input type="radio"/>').attr({id: id, name: 'pay_type'}).val(type.type);
      var $label = $('<label/>').attr({id: id})
        .append($input)
        .append($img)
        .append($('<span/>').text(type.name));
      var $li = $('<li/>').append($label);
      this.$('#payment_type_widget').append($li);
    }, this);
  },

  create: function (e) {
    //unused, but required by CreateModalView
    e.preventDefault();
  },

  selectMethod: function(e) {
    this.$('.selected').removeClass('selected');
    $(e.target).parents('li').addClass('selected');
  }

});

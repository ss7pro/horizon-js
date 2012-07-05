var Register = Backbone.Model.extend({
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
            console.log(err);
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
  }
});

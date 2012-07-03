var CreateServerView = CreateModalView.extend({

    onShow: function() {
      var flavors = this.options.params.flavorModel;
      var rams = [];
      var cpus = [];
      flavors.each(function(f) {
        if(_.indexOf(rams, f.get('ram')) == -1) {
          rams.push(f.get('ram'));
        }
        if(_.indexOf(cpus, f.get('vcpus')) == -1) {
          cpus.push(f.get('vcpus'));
        }
      });
      rams.sort(function(a,b){ return a-b; });
      cpus.sort(function(a,b){ return a-b; });

      $('#mem-slider').slider({
        max: rams.length - 1,
        animate: 'medium',
        slide: function(e, ui) {
          var ram = rams[ui.value];
          $('#mem-value').text(ram);
          var tmp = flavors.findFirstByRam(ram);
          var vcpus = tmp.get('vcpus');
          var cpuval = cpus.indexOf(vcpus);
          $('#cpu-slider').slider('option', 'value', cpuval);
        },
        create: function(e, ui) {
          $('#mem-value').text(rams[0]);
        },
        change: function(e, ui) {
          $('#mem-value').text(rams[ui.value]);
        }
      });

      $('#cpu-slider').slider({
        max: cpus.length - 1,
        animate: 'medium',
        slide: function(e, ui) {
          var cpu = cpus[ui.value];
          $('#cpu-value').text(cpu);
          var tmp = flavors.findFirstByCpu(cpu);
          var vrams = tmp.get('ram');
          var ramval = rams.indexOf(vrams);
          $('#mem-slider').slider('option', 'value', ramval);
        },
        create: function(e, ui) {
          $('#cpu-value').text(cpus[0]);
        },
        change: function(e, ui) {
          $('#cpu-value').text(cpus[ui.value]);
        }
      });

      $('#mem-slider, #cpu-slider').bind('slidechange', function(e, ui) {
        var ram  =  rams[$('#mem-slider').slider('option', 'value')];
        var vcpus = cpus[$('#cpu-slider').slider('option', 'value')];
        var flavs = flavors.findByRamAndCpu(ram, vcpus);
        if(flavs.length > 0) {
          $('#id_flavor').val(flavs[0].get('id'));
        }
      });
    },

    create: function () {
        var inputs = this.getInputsAndValidate();
        if(inputs.hasOwnProperty("invalid")) {
            return;
        }
        this.createServer(inputs);
        this.close();
    },

    getInputsAndValidate: function () {
        var serverName = this.getInputVal("server_name");
        var flavorId = this.getSelectedOptionVal("id_flavor");
        var imageId = this.getSelectedOptionVal("id_image");
        var keyPairName = this.getSelectedOptionVal("name_keypair");
        var secGroupId = this.getSelectedOptionVal("id_secgroup");
        var invalid = [];
        if (serverName == undefined || !serverName.length) {
            invalid.push("serverName");
        }
        if (imageId == undefined || !imageId.length) {
            invalid.push("imageId");
        }
        if (flavorId == undefined || !flavorId.length) {
            invalid.push("flavorId");
        }
        if (secGroupId == undefined || !secGroupId.length) {
            invalid.push("secGroupId");
        }
        var ret = {
                serverName: serverName,
                flavorId: flavorId,
                imageId: imageId,
                keyPairName: keyPairName,
                secGroupId: secGroupId
            };
        if (invalid.length) {
            ret.invalid = invalid;
        }
        return (ret);
    },

    createServer: function (inputs) {
        var serverModel = new Instance ();
        serverModel.set({
                    name: inputs.serverName,
                    imageReg: inputs.imageId,
                    flavorReg: inputs.flavorId,
                    security_groups: inputs.security_groups,
                    min_count: 1,
                    max_count: 1
            });
        var reqId = UTILS.Events.genRequestId();
        var modelsToReset = ["instanceModel"];
        UTILS.Events.setRequestProperty(reqId, "modelsToReset", modelsToReset);
        UTILS.Events.setRequestProperty(reqId, "description", "Server " +
                                        "creation request for: "  +
                                        inputs.serverName);
        serverModel._action('create', UTILS.Events.requestHandlerDict(reqId));
    }

});

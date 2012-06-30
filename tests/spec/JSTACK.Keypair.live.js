describe("JSTACK Keypair", function() {

	
	beforeEach(function() {
		this.url = 'http://178.239.138.10:5000/v2.0/'
		JSTACK.Keystone.init(this.url)
		var username = 'pfedkow';
		var password = 'dopal4mi';
        var tenant = 'd9a0f593e31f4b96b6488292353f7f15';
        var _ok = function () {
        };
        var _err = function () {
        };
		JSTACK.Keystone.authenticate(username, password, undefined, tenant, _ok, _err);
        JSTACK.Keystone.params.region = 'r4cz1';
        waitsFor(function() { if(JSTACK.Keystone.STATES.AUTHENTICATED ==  JSTACK.Keystone.params.currentstate) return true; return false; }, "Keystone authetication never completed", 2000);
	});


	it("Should create and delete keypair", function() {
        var keypair = new Keypair ();
        var destroyed = false;
//keypair creation
        runs( function() {
                keypair.set({name:"unittestkey"});
                keypair.save();
            });
        waitsFor(function() { if(keypair.get("fingerprint") != undefined) return true; return false; }, "Keypair creation never completed", 2000);
//keypair deletion
        runs( function() {
                keypair.destroy({success: function() { destroyed=true; }});
            });
        waitsFor(function() { return destroyed; }, "Keypair deletion never completed", 2000);
    });

});

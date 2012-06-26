describe("JSTACK Keystone tests", function() {

	
	beforeEach(function() {
		this.url = 'http://127.0.0.99/v2.0/'
		JSTACK.Keystone.init(this.url)
	});


	it("Should authenticate.", function() {
		var username = 'stackuser';
		var password = 'stackpassword';
		var fixture = this.fixtures.respKeystonePostTokens;

		JSTACK.Keystone.authenticate(username, password, undefined, undefined, _ok, _err);
		this.server.respondWith([200, {}, fixture]);
		this.server.respond();
		expect(JSTACK.Keystone.params.currentstate).toEqual(JSTACK.Keystone.STATES.AUTHENTICATED);
		expect(JSTACK.Keystone.params.token).toEqual('146282a8cc8742298dd9b03ed3c3d616');
		expect(JSTACK.Keystone.params.access).toEqual(JSON.parse(fixture).access);
	});

	it("Should provide region list", function() {
        var fixture = this.fixtures.respKeystoneEndpoints;
        JSTACK.Keystone.params.currentstate = JSTACK.Keystone.STATES.AUTHENTICATED;
        JSTACK.Keystone.params.access = JSON.parse(fixture).access;
        var regions = JSTACK.Keystone.getregionlist();
        expect(regions[0].name).toEqual("r4cz2");
        expect(regions[1].name).toEqual("r4cz1");
	});

	it("Should provide valid endpoint", function() {
        var fixture = this.fixtures.respKeystoneEndpoints;
        JSTACK.Keystone.params.currentstate = JSTACK.Keystone.STATES.AUTHENTICATED;
        JSTACK.Keystone.params.access = JSON.parse(fixture).access;
        var r;
//test getserviceendpoint without providing region name
        r = JSTACK.Keystone.getserviceendpoint("compute");
        expect(r.adminURL).toEqual("http://127.0.0.2:8774/v2/b6d0176ee858411caef6fca6a63bdd31");
        expect(r.region).toEqual("r4cz2");
//provide region name: r4cz1
        JSTACK.Keystone.params.region = "r4cz1";
        r = JSTACK.Keystone.getserviceendpoint("compute");
        expect(r.adminURL).toEqual("http://127.0.0.1:8774/v2/b6d0176ee858411caef6fca6a63bdd31");
        expect(r.region).toEqual("r4cz1");
//provide region name: r4cz2
        JSTACK.Keystone.params.region = "r4cz2";
        r = JSTACK.Keystone.getserviceendpoint("compute");
        expect(r.adminURL).toEqual("http://127.0.0.2:8774/v2/b6d0176ee858411caef6fca6a63bdd31");
        expect(r.region).toEqual("r4cz2");
//provide wron regoion name: wrong
        JSTACK.Keystone.params.region = "wrong";
        r = JSTACK.Keystone.getserviceendpoint("compute");
        expect(r).toEqual(undefined);
	});

});

describe("UTILS.auth tests", function() {
	it("Should provide valid endpoint", function() {
        var fixture = this.fixtures.respKeystoneEndpoints;
        JSTACK.Keystone.params.currentstate = JSTACK.Keystone.STATES.AUTHENTICATED;
        JSTACK.Keystone.params.access = JSON.parse(fixture).access;
        var r;
//test getserviceendpoint without providing region name
       UTILS.Auth.setCurrentRegion("r4cz1");
       expect("r4cz1").toEqual(UTILS.Auth.getCurrentRegion());
       UTILS.Auth.setCurrentRegion("r4cz2");
       expect("r4cz2").toEqual(UTILS.Auth.getCurrentRegion());
       UTILS.Auth.setCurrentRegion(undefined);
       expect(undefined).toEqual(UTILS.Auth.getCurrentRegion());
       UTILS.Auth.setCurrentRegion("r4cz2");
       expect("r4cz2").toEqual(UTILS.Auth.getCurrentRegion());
        rl = UTILS.Auth.getRegionList();
       expect("r4cz2").toEqual(rl[0].name);
       expect("r4cz1").toEqual(rl[1].name);
    });
});

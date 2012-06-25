describe("JSTACK Keystone tests", function() {

	
	beforeEach(function() {
		this.url = 'http://127.0.0.1/v2.0/'
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
});

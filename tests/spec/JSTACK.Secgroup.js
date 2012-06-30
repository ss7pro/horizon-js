describe("JSTACK Security Group", function() {

	
	beforeEach(function() {
		this.url = 'http://127.0.0.1/v2.0/'
		JSTACK.Keystone.init(this.url)
		var username = 'stackuser';
		var password = 'stackpassword';
		var keystoneFixture = this.fixtures.respKeystoneEndpoints;

		JSTACK.Keystone.authenticate(username, password, undefined, undefined, _ok, _err);
		this.server.respondWith([200, {}, keystoneFixture]);
		this.server.respond();
		expect(JSTACK.Keystone.params.currentstate).toEqual(JSTACK.Keystone.STATES.AUTHENTICATED);
		expect(JSTACK.Keystone.params.access).toEqual(JSON.parse(keystoneFixture).access);

	});


	it("Should return security group list.", function() {
		var secGroupListFixture = this.novaFixtures.secGroupList;
        JSTACK.Nova.getsecgrouplist(function(result) { alert(JSON.stringify(result)); });
		this.server.respondWith([200, {}, secGroupListFixture]);
		this.server.respond();
	});
	it("Should delete security group.", function() {
		var secGroupListFixture = this.novaFixtures.secGroupList;
        JSTACK.Nova.delsecgroup(1, function(result) { alert(JSON.stringify(result)); });
		this.server.respondWith([200, {}, secGroupListFixture]);
		this.server.respond();
	});
	it("Should create security group.", function() {
		var secGroupListFixture = this.novaFixtures.secGroupList;
        JSTACK.Nova.createsecgroup('nazwa-test','Testowy opis',function(result) { alert(JSON.stringify(result)); });
		this.server.respondWith([200, {}, secGroupListFixture]);
		this.server.respond();
	});
	it("Should delete security group rule.", function() {
		var secGroupListFixture = this.novaFixtures.secGroupList;
        JSTACK.Nova.delsecgrouprule(1, function(result) { alert(JSON.stringify(result)); });
		this.server.respondWith([200, {}, secGroupListFixture]);
		this.server.respond();
	});
	it("Should add security group rule.", function() {
		var secGroupListFixture = this.novaFixtures.secGroupList;
        JSTACK.Nova.addsecgrouprule('22', '22', 'ip', '1', '0.0.0.0/0', function(result) { alert(JSON.stringify(result)); });
		this.server.respondWith([200, {}, secGroupListFixture]);
		this.server.respond();
        alert('a');
	});
});

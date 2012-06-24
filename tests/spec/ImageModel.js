describe("Image Backbone Model tests", function() {

	
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


	it("Should return image list.", function() {
		var images = new Images();
		var imageListFixture = this.novaFixtures.imageList;
		images.fetch();
		this.server.respondWith([200, {}, imageListFixture]);
		this.server.respond();
		expect(images.models.length).toEqual(3);
		expect(images.models[0].get("name")).toEqual("Ubuntu 11.10 (Oneiric Ocelot)");
		expect(images.models[1].get("name")).toEqual("Ubuntu 11.04 (Natty Narwhal)");
		expect(images.models[2].get("name")).toEqual("Ubuntu 12.04 (Precise Pangolin)");
	});
});

describe("Region backbone model tests", function() {

	
	it("Should provider list of regions.", function() {
		var fixture = this.fixtures.respKeystoneEndpoints;

		JSTACK.Keystone.params.access = JSON.parse(fixture).access;
		var regions = new Regions();
		regions.fetch();
		expect(regions.models[0].get("name")).toEqual("r4cz2");
		expect(regions.models[1].get("name")).toEqual("r4cz1");
	});
});

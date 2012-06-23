describe("JSTACK", function() {

	it("should set params.url attribiute", function() {
		var url = 'http://127.0.0.1:5000'
		JSTACK.Keystone.init(url)
		expect(JSTACK.Keystone.params.url).toEqual(url);
	});
});

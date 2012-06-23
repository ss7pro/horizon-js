describe("JSTACK Keystone tests", function() {

	
	beforeEach(function() {
		this.url = 'http://127.0.0.1/v2.0/'
		this.server = sinon.fakeServer.create();
		this.server.respondWith(function (xhr) {
			console.log(xhr.method, xhr.url, xhr.requestBody);
		});
		JSTACK.Keystone.init(this.url)
	});


	it("Should authenticate.", function() {
		var username = 'stackuser';
		var password = 'stackpassword';
		var _fret = undefined
		var fixture = this.fixtures.respKeystonePostTokens;

		var _ok = function (resp) {
			console.log('_ok:', JSON.stringify(resp));
		}
		var _err = function (resp) {
			console.log('_err::', JSON.stringify(resp));
		}

		JSTACK.Keystone.authenticate(username, password, undefined, undefined, _ok, _err);
		this.server.respondWith([200, {}, fixture])
		this.server.respond();
		expect(JSTACK.Keystone.params.currentstate).toEqual(JSTACK.Keystone.STATES.AUTHENTICATED);
		expect(JSTACK.Keystone.params.token).toEqual('146282a8cc8742298dd9b03ed3c3d616');
		expect(JSTACK.Keystone.params.access).toEqual(JSON.parse(fixture).access);
	});
});

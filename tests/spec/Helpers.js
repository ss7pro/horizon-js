var _ok = function (resp) {
	console.log('_ok:', JSON.stringify(resp));
}
var _err = function (resp) {
	console.log('_err::', JSON.stringify(resp));
}

        
beforeEach(function() {
	this.server = sinon.fakeServer.create();
	this.server.respondWith(function (xhr) {
		console.log(xhr.method, xhr.url, xhr.requestBody);
	});
});

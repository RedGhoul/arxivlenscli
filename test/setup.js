const {TextEncoder, TextDecoder} = require('util');

Object.defineProperty(global, 'TextEncoder', {
	value: TextEncoder,
});

Object.defineProperty(global, 'TextDecoder', {
	value: TextDecoder,
});

Object.defineProperty(global, 'Response', {
	value: global.Response,
	writable: true,
	configurable: true,
});

Object.defineProperty(global, 'Request', {
	value: global.Request,
	writable: true,
	configurable: true,
});

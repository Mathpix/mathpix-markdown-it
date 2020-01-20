const { JSDOM, ResourceLoader } = require('jsdom');

// Class to return a window instance.
// Accepts a jsdom config object.
module.exports = class Window {
	constructor(jsdomConfig = {}) {
		const { proxy, strictSSL, userAgent } = jsdomConfig;
		const resources = new ResourceLoader({
			proxy,
			strictSSL,
			userAgent
		});
		return (new JSDOM('', Object.assign(jsdomConfig, {
			resources
		}))).window;
	}
};

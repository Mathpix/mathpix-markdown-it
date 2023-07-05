"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSre = void 0;
var sre = require("speech-rule-engine/lib/sre.js");
var loadSre = function (options) {
    if (options === void 0) { options = {}; }
    var optionsEngine = Object.assign({}, { domain: 'mathspeak' }, options);
    sre.setupEngine(optionsEngine);
    return sre;
};
exports.loadSre = loadSre;
//# sourceMappingURL=sre-browser.js.map
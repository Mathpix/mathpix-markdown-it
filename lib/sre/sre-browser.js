"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSre = void 0;
var sre = require("speech-rule-engine/lib/sre.js");
exports.loadSre = function (options) {
    if (options === void 0) { options = {}; }
    var optionsEngine = Object.assign({}, { domain: 'mathspeak' }, options);
    sre.setupEngine(optionsEngine);
    return sre;
};
//# sourceMappingURL=sre-browser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSreAsync = exports.loadSre = void 0;
var tslib_1 = require("tslib");
var sre = require("speech-rule-engine/lib/sre.js");
var loadSre = function (options) {
    if (options === void 0) { options = {}; }
    var optionsEngine = Object.assign({}, { domain: 'mathspeak' }, options);
    sre.setupEngine(optionsEngine);
    return sre;
};
exports.loadSre = loadSre;
/**
 * Initializes Speech Rule Engine (SRE) with the given options and waits until it is ready.
 *
 * @param {LoadSreOptions} [options] SRE engine options (merged with defaults).
 * @returns {Promise<typeof sre>} The initialized SRE instance.
 */
var loadSreAsync = function (options) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var optionsEngine;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    optionsEngine = tslib_1.__assign({ domain: 'mathspeak', locale: 'en' }, options);
                    sre.setupEngine(optionsEngine);
                    return [4 /*yield*/, sre.engineReady()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, sre];
            }
        });
    });
};
exports.loadSreAsync = loadSreAsync;
//# sourceMappingURL=sre-browser.js.map
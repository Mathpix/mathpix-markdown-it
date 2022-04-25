"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSreAsync = void 0;
var tslib_1 = require("tslib");
var sre = require('speech-rule-engine');
/**
 * Note that in asynchronous operation mode for these methods to work correctly,
 * it is necessary to ensure that the Engine is ready for processing.
 * In other words, you need to wait for the setup promise to resolve.
 * */
exports.loadSreAsync = function (options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var optionsEngine;
        return tslib_1.__generator(this, function (_a) {
            try {
                optionsEngine = Object.assign({}, { domain: 'mathspeak' }, options);
                sre.setupEngine(optionsEngine);
                sre.engineReady()
                    .then(function () {
                    resolve(sre);
                })
                    .catch(function (err) {
                    reject(err);
                });
            }
            catch (err) {
                reject(err);
            }
            return [2 /*return*/];
        });
    }); });
};
//# sourceMappingURL=sre-node.js.map
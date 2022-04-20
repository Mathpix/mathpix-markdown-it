"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSRE = void 0;
var tslib_1 = require("tslib");
var sre = require('speech-rule-engine');
sre.setupEngine({
    domain: 'mathspeak'
});
exports.getSRE = function () {
    return new Promise(function (resolve, reject) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            sre.engineReady()
                .then(function (res) {
                resolve(sre);
            })
                .catch(function (err) {
                reject(err);
            });
            return [2 /*return*/];
        });
    }); });
};
//# sourceMappingURL=sre-node.js.map
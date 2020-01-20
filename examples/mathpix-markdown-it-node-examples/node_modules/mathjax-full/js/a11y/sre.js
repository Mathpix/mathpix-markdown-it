"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AsyncLoad_js_1 = require("../util/AsyncLoad.js");
var SRELIB = (typeof window === 'undefined' ? './a11y/sre-node.js' :
    '../../../speech-rule-engine/lib/sre_browser.js');
var srePromise = (typeof sre === 'undefined' ? AsyncLoad_js_1.asyncLoad(SRELIB) : Promise.resolve());
var SRE_DELAY = 100;
var SRE_TIMEOUT = 5 * 1000;
exports.sreReady = new Promise(function (resolve, reject) {
    srePromise.then(function () {
        var start = new Date().getTime();
        function checkSRE() {
            if (sre.Engine.isReady()) {
                resolve();
            }
            else {
                if (new Date().getTime() - start < SRE_TIMEOUT) {
                    setTimeout(checkSRE, SRE_DELAY);
                }
                else {
                    reject('Timed out waiting for Speech-Rule-Engine');
                }
            }
        }
        checkSRE();
    }).catch(function (error) { return reject(error.message || error); });
});
//# sourceMappingURL=sre.js.map
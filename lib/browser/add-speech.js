"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSpeechToRenderedMath = void 0;
var tslib_1 = require("tslib");
var sre_browser_1 = require("../sre/sre-browser");
var sre_1 = require("../sre");
var defaultConfig = {};
/**
 * Add speech attributes to already-rendered SVG math elements.
 * Use this when math was rendered server-side without accessibility (output_format: 'svg').
 *
 * This function:
 * - Loads SRE (Speech Rule Engine) dynamically
 * - Finds all mjx-container elements
 * - Extracts MathML from mjx-assistive-mml
 * - Generates speech text and adds aria-label
 *
 * @param container - The container element to search for math elements (defaults to document.body)
 */
var addSpeechToRenderedMath = function (container) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var root, sre, mathContainers, mathContainers_1, mathContainers_1_1, elMath, err_1;
    var e_1, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                root = container !== null && container !== void 0 ? container : document.body;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, sre_browser_1.loadSreAsync)()];
            case 2:
                sre = _b.sent();
                if (!sre) {
                    console.warn('[addSpeechToRenderedMath] SRE not available');
                    return [2 /*return*/];
                }
                mathContainers = Array.from(root.querySelectorAll('mjx-container'));
                try {
                    for (mathContainers_1 = tslib_1.__values(mathContainers), mathContainers_1_1 = mathContainers_1.next(); !mathContainers_1_1.done; mathContainers_1_1 = mathContainers_1.next()) {
                        elMath = mathContainers_1_1.value;
                        (0, sre_1.addSpeechToMathContainer)(sre, elMath);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (mathContainers_1_1 && !mathContainers_1_1.done && (_a = mathContainers_1.return)) _a.call(mathContainers_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.error('[addSpeechToRenderedMath] SRE processing error:', err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addSpeechToRenderedMath = addSpeechToRenderedMath;
/**
 * Returns true when running in a browser environment (not SSR / Node).
 */
var isBrowser = function () {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
};
/**
 * Read config from the global `window.MathpixSpeechConfig` if provided,
 * otherwise fall back to `defaultConfig`.
 */
var getGlobalConfig = function () {
    return window.MathpixSpeechConfig || defaultConfig;
};
/**
 * Auto-add speech to rendered math elements.
 * This function is meant to be called once on page load.
 */
var autoAddSpeech = function () {
    var _a;
    var config = getGlobalConfig();
    var container = (_a = config.container) !== null && _a !== void 0 ? _a : document.body;
    (0, exports.addSpeechToRenderedMath)(container).catch(function (err) {
        console.error('[MathpixSpeech] autoAddSpeech failed:', err);
    });
};
// Auto-add speech on DOMContentLoaded (browser only).
if (isBrowser()) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoAddSpeech, { once: true });
    }
    else {
        autoAddSpeech();
    }
    /**
     * Global API exposed for integrators (optional usage).
     * - `addSpeechToRenderedMath`: add speech to already-rendered SVG math
     */
    window.MathpixSpeech = {
        addSpeechToRenderedMath: exports.addSpeechToRenderedMath
    };
}
//# sourceMappingURL=add-speech.js.map
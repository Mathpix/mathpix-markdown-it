"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = void 0;
/**
 * Returns true when running in a browser environment (not SSR / Node).
 */
var isBrowser = function () {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
};
exports.isBrowser = isBrowser;
//# sourceMappingURL=utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProcessWolfram = void 0;
exports.postProcessWolfram = function (wolfram) {
    /** add space after number and before later */
    wolfram = wolfram.replace(/([0-9])([a-zA-Z])/g, '$1 $2');
    return wolfram;
};
//# sourceMappingURL=post-process.js.map
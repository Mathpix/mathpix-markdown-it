"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetWarnDistinct = exports.warnDistinct = void 0;
var tslib_1 = require("tslib");
// Speculative parses reach these diagnostics once per offending line, so a desync would flood a
// consumer's log. Report each distinct case once per parse (reset below); a repeat says nothing new.
var warned = new Set();
var warnDistinct = function (key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (warned.has(key)) {
        return;
    }
    warned.add(key);
    console.warn.apply(console, tslib_1.__spreadArray([], tslib_1.__read(args), false));
};
exports.warnDistinct = warnDistinct;
// Called per render from the `reset_mmd_global_state` rule, before its partial-render bail — so it is
// not part of the public resetMmdGlobalState, which a partial render skips.
var resetWarnDistinct = function () {
    warned.clear();
};
exports.resetWarnDistinct = resetWarnDistinct;
//# sourceMappingURL=warn-distinct.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetWarnDistinct = exports.warnDistinct = void 0;
var tslib_1 = require("tslib");
// Speculative parses reach these diagnostics once per offending line, so a desync would flood a
// consumer's log. Report each distinct case once per parse (reset below); a repeat says nothing new.
var warned = new Set();
// A key carries a list depth or an error message, so a pathological document can mint many. Past the
// cap the set stops growing and reporting: it exists to dedupe a flood, not to itemise one.
var MAX_DISTINCT_KEYS = 200;
// Per cause family, so a document minting hundreds of `list-rule-failed:` keys cannot silence the one
// warning another subsystem has to give. The family is the key up to its first colon.
var MAX_KEYS_PER_FAMILY = 40;
var capReported = false;
var perFamily = new Map();
var familyCapReported = new Set();
var familyOf = function (key) {
    var at = key.indexOf(':');
    return at < 0 ? key : key.slice(0, at);
};
var warnDistinct = function (key) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (warned.has(key)) {
        return;
    }
    var family = familyOf(key);
    var usedByFamily = (_a = perFamily.get(family)) !== null && _a !== void 0 ? _a : 0;
    if (usedByFamily >= MAX_KEYS_PER_FAMILY) {
        if (!familyCapReported.has(family)) {
            familyCapReported.add(family);
            console.warn("[mmd] more than ".concat(MAX_KEYS_PER_FAMILY, " distinct '").concat(family, "' diagnostics in one render; the rest of that family are silent"));
        }
        return;
    }
    if (warned.size >= MAX_DISTINCT_KEYS) {
        // Said once, so a reader knows the log is truncated rather than complete.
        if (!capReported) {
            capReported = true;
            console.warn("[mmd] more than ".concat(MAX_DISTINCT_KEYS, " distinct diagnostics in one render; the rest are silent"));
        }
        return;
    }
    warned.add(key);
    perFamily.set(family, usedByFamily + 1);
    console.warn.apply(console, tslib_1.__spreadArray([], tslib_1.__read(args), false));
};
exports.warnDistinct = warnDistinct;
// Called per render from the `reset_mmd_global_state` rule, before its partial-render bail — so it is
// not part of the public resetMmdGlobalState, which a partial render skips.
var resetWarnDistinct = function () {
    warned.clear();
    capReported = false;
    perFamily.clear();
    familyCapReported.clear();
};
exports.resetWarnDistinct = resetWarnDistinct;
//# sourceMappingURL=warn-distinct.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mathOpenerOffsets = exports.nextMathSpan = exports.shouldSkipDollar = exports.getEndMarker = exports.RE_MATH_OPEN_G = exports.RE_MATH_OPEN = void 0;
var common_1 = require("../common");
var utils_1 = require("../utils");
var consts_1 = require("./consts");
/**
 * Where math sits in a string. One scanner for every caller: the tabular path extracts math with it,
 * the list guard asks it whether an `\end{itemize}` is inside math rather than structure. Openers, end
 * markers and the `$` guards live here alone — a second copy is what makes the two disagree.
 *
 * Markers are mirrored, scope is not: the owning rules pair math inside one inline token, so a caller
 * reading raw source must bound the scan by paragraph.
 */
var MATH_ENV_NAMES = new Set(consts_1.mathEnvironments);
exports.RE_MATH_OPEN = /\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\}/;
// One `/g` instance per caller: `lastIndex` is state, and the scans below can interleave.
exports.RE_MATH_OPEN_G = new RegExp(exports.RE_MATH_OPEN.source, 'g');
var RE_MATH_SPAN_G = new RegExp(exports.RE_MATH_OPEN.source, 'g');
var RE_MATH_SWEEP_G = new RegExp(exports.RE_MATH_OPEN.source, 'g');
/**
 * End marker for a matched opening marker.
 * - string: marker to search for (e.g. "\\]", "$")
 * - null: self-closing match (eqref/ref) — content is the match itself
 * - undefined: `\begin{env}` — the caller resolves it by balanced tag search
 */
var getEndMarker = function (matchStr, envGroup, eqrefGroup, refGroup) {
    if (matchStr === "\\\\[")
        return "\\\\]";
    if (matchStr === "\\[")
        return "\\]";
    if (matchStr === "\\\\(")
        return "\\\\)";
    if (matchStr === "\\(")
        return "\\)";
    if (eqrefGroup !== undefined || refGroup !== undefined)
        return null;
    if (matchStr === "$$")
        return "$$";
    if (matchStr === "$")
        return "$";
    return undefined;
};
exports.getEndMarker = getEndMarker;
/** Is this `$`/`$$` pair not math after all? Escaped either side, whitespace inside a `$` pair, or a
 *  digit right after the closer, which reads as a price rather than a formula. */
var shouldSkipDollar = function (str, marker, beginMarkerPos, endMarkerPos) {
    var beforeEnd = str.charCodeAt(endMarkerPos - 1);
    if (beforeEnd === 0x5c ||
        (beginMarkerPos > 0 && str.charCodeAt(beginMarkerPos - 1) === 0x5c)) {
        return true;
    }
    // Single `$` only: a digit right after it reads as currency, `$5`. For `$$` the pair is unambiguous, so
    // `$$x$$5` stays math — and `endMarkerPos + 1` pointed at the second `$` there, never at a digit anyway.
    if (marker === "$") {
        var afterStart = str.charCodeAt(beginMarkerPos + 1);
        if (beforeEnd === 0x20 || beforeEnd === 0x09 || beforeEnd === 0x0a ||
            afterStart === 0x20 || afterStart === 0x09 || afterStart === 0x0a) {
            return true;
        }
        var suffix = str.charCodeAt(endMarkerPos + 1);
        if (suffix >= 0x30 && suffix < 0x3a) {
            return true;
        }
    }
    return false;
};
exports.shouldSkipDollar = shouldSkipDollar;
/**
 * First math span at or after `from`, or null. Same openers, end markers and `$` guards the extraction
 * uses, with nothing extracted and no state touched.
 */
var nextMathSpan = function (str, from, mathEnvsOnly, until) {
    var _a;
    if (mathEnvsOnly === void 0) { mathEnvsOnly = false; }
    if (until === void 0) { until = str.length; }
    RE_MATH_SPAN_G.lastIndex = from > 0 ? from : 0;
    var match;
    while ((match = RE_MATH_SPAN_G.exec(str)) !== null) {
        // Past what the caller asked about: scanning on would walk the whole tail for every block.
        if (match.index >= until) {
            return null;
        }
        var beginMarkerPos = match.index;
        var startMathPos = beginMarkerPos + match[0].length;
        var envGroup = match[1];
        // Extraction takes any env and sorts them later; a reader that wants math only must not take `itemize`.
        if (mathEnvsOnly && envGroup && !MATH_ENV_NAMES.has(envGroup.trim())) {
            RE_MATH_SPAN_G.lastIndex = startMathPos;
            continue;
        }
        var endMarker = (0, exports.getEndMarker)(match[0], envGroup, match[2], match[3]);
        var endMarkerPos = -1;
        if (endMarker === null) {
            endMarkerPos = startMathPos;
            endMarker = '';
        }
        else if (endMarker === undefined) {
            if (envGroup && envGroup !== 'abstract' && envGroup !== 'tabular') {
                var environment = envGroup.trim();
                var openTag = (0, utils_1.beginTag)(environment, true);
                var closeTag = (0, utils_1.endTag)(environment, true);
                if (closeTag && openTag) {
                    var data = (0, utils_1.findOpenCloseTagsMathEnvironment)(str.slice(beginMarkerPos), openTag, closeTag);
                    var lastClose = ((_a = data === null || data === void 0 ? void 0 : data.arrClose) === null || _a === void 0 ? void 0 : _a.length) ? data.arrClose[data.arrClose.length - 1] : null;
                    if (lastClose && typeof lastClose.posStart === 'number') {
                        endMarkerPos = beginMarkerPos + lastClose.posStart;
                    }
                    endMarker = "\\end{".concat(envGroup, "}");
                }
            }
            if (endMarker === undefined) {
                continue;
            }
        }
        if (endMarkerPos === -1) {
            endMarkerPos = (0, common_1.findEndMarkerPos)(str, endMarker, startMathPos);
        }
        if (endMarkerPos === -1) {
            RE_MATH_SPAN_G.lastIndex = startMathPos;
            continue;
        }
        if ((match[0] === "$" || match[0] === "$$")
            && (0, exports.shouldSkipDollar)(str, match[0], beginMarkerPos, endMarkerPos)) {
            RE_MATH_SPAN_G.lastIndex = startMathPos;
            continue;
        }
        return { start: beginMarkerPos, end: endMarkerPos + endMarker.length };
    }
    return null;
};
exports.nextMathSpan = nextMathSpan;
/** Offset of every math opener, ascending. `nextMathSpan` with no opener ahead scans to EOF, so a
 *  caller asking per block needs these once instead. */
var mathOpenerOffsets = function (str) {
    var offsets = [];
    RE_MATH_SWEEP_G.lastIndex = 0;
    var match;
    while ((match = RE_MATH_SWEEP_G.exec(str)) !== null) {
        offsets.push(match.index);
        if (RE_MATH_SWEEP_G.lastIndex <= match.index) {
            RE_MATH_SWEEP_G.lastIndex = match.index + 1;
        }
    }
    return offsets;
};
exports.mathOpenerOffsets = mathOpenerOffsets;
//# sourceMappingURL=math-spans.js.map
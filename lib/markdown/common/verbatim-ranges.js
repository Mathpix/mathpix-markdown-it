"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInsideRanges = exports.findVerbatimRanges = exports.isFenceClose = exports.detectFenceOpen = void 0;
var tslib_1 = require("tslib");
var math_spans_1 = require("./math-spans");
var common_1 = require("../common");
var consts_1 = require("./consts");
/**
 * Stretches of source a parser reads verbatim: fenced blocks, `lstlisting` bodies, inline code and math.
 * A rule that re-reads raw source — the list guard looking ahead for a wrapper's closer — must skip
 * them, or a `{` or an `\end{itemize}` written there reads as structure. Detection mirrors the rules
 * that own each construct: the core fence rule, and `simpleMath`/`multiMath` for math — within a
 * paragraph, as those rules pair it.
 */
var BACKTICK = 0x60;
var TILDE = 0x7E;
var SPACE = 0x20;
var TAB = 0x09;
var skipUpTo3Spaces = function (rawLine) {
    var pos = 0;
    while (pos < 3 && rawLine.charCodeAt(pos) === SPACE) {
        pos++;
    }
    return pos;
};
/** Marker of a fence opening this line, or null. Mirrors the core fence rule (mmd-fence.ts): marker
 *  ` or ~, run of 3 or more, up to 3 leading spaces, no backtick in a backtick fence's info string. */
var detectFenceOpen = function (rawLine) {
    var pos = skipUpTo3Spaces(rawLine);
    var char = rawLine.charCodeAt(pos);
    if (char !== BACKTICK && char !== TILDE) {
        return null;
    }
    var len = 0;
    while (rawLine.charCodeAt(pos + len) === char) {
        len++;
    }
    if (len < 3) {
        return null;
    }
    if (char === BACKTICK && rawLine.indexOf('`', pos + len) >= 0) {
        return null;
    }
    return { char: char, len: len };
};
exports.detectFenceOpen = detectFenceOpen;
/** Does this line close `fence`? Same char, at least as long, blank tail. */
var isFenceClose = function (rawLine, fence) {
    var pos = skipUpTo3Spaces(rawLine);
    if (rawLine.charCodeAt(pos) !== fence.char) {
        return false;
    }
    var len = 0;
    while (rawLine.charCodeAt(pos + len) === fence.char) {
        len++;
    }
    if (len < fence.len) {
        return false;
    }
    for (var i = pos + len; i < rawLine.length; i++) {
        var c = rawLine.charCodeAt(i);
        if (c !== SPACE && c !== TAB) {
            return false;
        }
    }
    return true;
};
exports.isFenceClose = isFenceClose;
var lineEndFrom = function (text, from) {
    var at = text.indexOf('\n', from);
    return at < 0 ? text.length : at;
};
// Where a fenced block opened on this line ends, or the end of `text` when it never closes.
var fenceRangeEnd = function (text, afterOpenLine, fence) {
    var scan = afterOpenLine;
    while (scan <= text.length) {
        var end = lineEndFrom(text, scan);
        if ((0, exports.isFenceClose)(text.slice(scan, end), fence)) {
            return end;
        }
        if (end >= text.length) {
            return text.length;
        }
        scan = end + 1;
    }
    return text.length;
};
// Same for an `lstlisting` body, whose closer may sit on the opening line.
var listingRangeEnd = function (text, openLineEnd, tailAfterOpen) {
    if (consts_1.END_LST_INLINE_RE.test(tailAfterOpen)) {
        return openLineEnd;
    }
    var scan = openLineEnd + 1;
    while (scan <= text.length) {
        var end = lineEndFrom(text, scan);
        if (consts_1.END_LST_INLINE_RE.test(text.slice(scan, end))) {
            return end;
        }
        if (end >= text.length) {
            return text.length;
        }
        scan = end + 1;
    }
    return text.length;
};
/**
 * Every verbatim stretch of `text`, ascending and non-overlapping. An unclosed fence, `lstlisting` or
 * math environment runs to the end, as the owning rules treat it.
 */
var findVerbatimRanges = function (text) {
    var e_1, _a;
    var ranges = [];
    var blankLines = [];
    var lineStart = 0;
    // Blocks first, line by line: a `$` inside a fence is not math, so math is asked for the gaps between.
    // Blank lines are recorded on the way — they bound where math may pair.
    while (lineStart <= text.length) {
        var lineEnd = lineEndFrom(text, lineStart);
        var line = text.slice(lineStart, lineEnd);
        var fence = (0, exports.detectFenceOpen)(line);
        if (fence) {
            var end = fenceRangeEnd(text, lineEnd + 1, fence);
            ranges.push([lineStart, end]);
            lineStart = end + 1;
            continue;
        }
        var listingOpen = line.match(consts_1.BEGIN_LST_INLINE_RE);
        if (listingOpen) {
            var openAt = listingOpen.index;
            var end = listingRangeEnd(text, lineEnd, line.slice(openAt + listingOpen[0].length));
            ranges.push([lineStart + openAt, end]);
            lineStart = end + 1;
            continue;
        }
        if (!line.trim()) {
            blankLines.push(lineStart);
        }
        lineStart = lineEnd + 1;
    }
    // Inline code and math in what is left: both are read verbatim, and neither can start inside a block.
    var inlineCode = (0, common_1.getInlineCodeListFromString)(text);
    var merged = [];
    var gapFrom = 0;
    var codeAt = 0;
    var breakAt = 0;
    for (var i = 0; i <= ranges.length; i++) {
        var gapTo = i < ranges.length ? ranges[i][0] : text.length;
        var gapSpans = [];
        while (codeAt < inlineCode.length && inlineCode[codeAt].posStart < gapTo) {
            if (inlineCode[codeAt].posStart >= gapFrom) {
                gapSpans.push([inlineCode[codeAt].posStart, inlineCode[codeAt].posEnd]);
            }
            codeAt++;
        }
        // Per paragraph, not per gap: the inline rules pair math inside one paragraph token, so a `$` on
        // either side of a blank line opens nothing — scanning across one marked whole lists as verbatim.
        var blockFrom = gapFrom;
        while (blockFrom < gapTo) {
            while (breakAt < blankLines.length && blankLines[breakAt] <= blockFrom) {
                breakAt++;
            }
            var blockTo = breakAt < blankLines.length
                ? Math.min(blankLines[breakAt], gapTo)
                : gapTo;
            var seek = blockFrom;
            while (seek < blockTo) {
                var span = (0, math_spans_1.nextMathSpan)(text, seek, true, blockTo);
                if (!span || span.start >= blockTo) {
                    break;
                }
                // Clamped: display math that legitimately crosses a blank line is covered only to that line.
                gapSpans.push([span.start, Math.min(span.end, blockTo)]);
                seek = span.end > seek ? span.end : seek + 1;
            }
            blockFrom = blockTo + 1;
        }
        gapSpans.sort(function (a, b) { return a[0] - b[0]; });
        // A `$` inside inline code opened no math: drop what a span already covers.
        var reach = gapFrom;
        try {
            for (var gapSpans_1 = (e_1 = void 0, tslib_1.__values(gapSpans)), gapSpans_1_1 = gapSpans_1.next(); !gapSpans_1_1.done; gapSpans_1_1 = gapSpans_1.next()) {
                var span = gapSpans_1_1.value;
                if (span[0] >= reach) {
                    merged.push(span);
                    reach = span[1];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (gapSpans_1_1 && !gapSpans_1_1.done && (_a = gapSpans_1.return)) _a.call(gapSpans_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (i < ranges.length) {
            merged.push(ranges[i]);
            gapFrom = ranges[i][1];
        }
    }
    return merged;
};
exports.findVerbatimRanges = findVerbatimRanges;
/** Is `at` inside one of the ascending `ranges`? Binary search, no allocation. */
var isInsideRanges = function (ranges, at) {
    var low = 0;
    var high = ranges.length - 1;
    while (low <= high) {
        var mid = (low + high) >> 1;
        if (ranges[mid][1] <= at) {
            low = mid + 1;
        }
        else if (ranges[mid][0] > at) {
            high = mid - 1;
        }
        else {
            return true;
        }
    }
    return false;
};
exports.isInsideRanges = isInsideRanges;
//# sourceMappingURL=verbatim-ranges.js.map
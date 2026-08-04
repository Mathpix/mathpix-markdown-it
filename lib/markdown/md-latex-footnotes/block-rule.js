"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latex_footnotetext_block = exports.latex_footnote_block = void 0;
var consts_1 = require("../common/consts");
var common_1 = require("../common");
var utils_1 = require("../utils");
var fence = require("markdown-it/lib/rules_block/fence.js");
var src_pos_cache_1 = require("../common/src-pos-cache");
// Symbol keys: collision-free on StateBlock; invisible to JSON.stringify/Object.keys (use `Object.getOwnPropertySymbols` to inspect).
var FOOTNOTE_POS_KEY = Symbol('mmd.footnoteSrcPositions');
var FOOTNOTETEXT_POS_KEY = Symbol('mmd.footnotetextSrcPositions');
// Helper-owned /g sweeps. lastIndex is reset in the helper before each scan; sync-only.
var FOOTNOTE_TOKEN_SWEEP_G = new RegExp(consts_1.reFootnoteToken.source, 'g');
var FOOTNOTETEXT_TOKEN_SWEEP_G = new RegExp(consts_1.reFootnotetextToken.source, 'g');
// Terminators for the \footnote scan, kept minimal alongside fence.
var LIST_RULE_NAME = "Lists";
var LIST_TERMINATOR_NAME = new Set([LIST_RULE_NAME]);
// Terminators for the \footnotetext scan. Neither set caches resolved fns: `rule.enabled` toggles
// mid-parse (measured: no cost).
var FOOTNOTE_TERMINATOR_NAMES = new Set([
    "table", "smilesDrawerBlock", "collapsible", "fence", "blockquote", "hr",
    "list", "Lists", "footnote_def", "heading", "svg_block", "html_block", "pageBreaksBlock", "deflist",
    "BeginTable", "BeginAlign", "BeginTabular", "BeginProof",
    "BeginTheorem", "headingSection", "mathMLBlock",
    "abstractBlock",
    "image_with_size_block"
]);
// Only `guarded` may throw here by design: it parses the body to answer, and a probe that cannot
// answer is not a terminator. Every other rule keeps propagating, so a bug in one stays visible.
var anyTerminates = function (rules, state, line, endLine, guarded) {
    for (var i = 0; i < rules.length; i++) {
        if (rules[i] !== guarded) {
            if (rules[i](state, line, endLine, true)) {
                return true;
            }
            continue;
        }
        try {
            if (rules[i](state, line, endLine, true)) {
                return true;
            }
        }
        catch (e) {
            // the speculative parse blew up: treat as "no terminator here"
        }
    }
    return false;
};
// One walk per entry: the terminator fns plus the one allowed to throw (`guardName`), so the caller
// never walks again just to identify it. Not cached — see the FOOTNOTE_TERMINATOR_NAMES note.
var resolveEnabledRuleFns = function (ruler, names, guardName) {
    var rules = ruler.__rules__;
    var fns = [];
    var guarded;
    if (rules === null || rules === void 0 ? void 0 : rules.length) {
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (rule.enabled && names.has(rule.name)) {
                fns.push(rule.fn);
                if (rule.name === guardName) {
                    guarded = rule.fn;
                }
            }
        }
    }
    return { fns: fns, guarded: guarded };
};
var latex_footnote_block = function (state, startLine, endLine, silent) {
    var _a, _b, _c, _d;
    try {
        var token = void 0, lineText = void 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        // Bail when the last `\footnote` literal is strictly before this block's start. Equality keeps the literal in scope (token starts on this block). `-1` from cache means no match anywhere.
        var lastFootnotePos = (0, src_pos_cache_1.lastMatchPosCached)(state, FOOTNOTE_POS_KEY, FOOTNOTE_TOKEN_SWEEP_G);
        if (lastFootnotePos < state.bMarks[startLine]) {
            return false;
        }
        var nextLine = startLine + 1;
        var startPos = pos;
        var numbered = void 0;
        lineText = state.src.slice(pos, max);
        var fullContent = lineText;
        var hasOpenTag = false;
        var pending = '';
        var terminate = false;
        // Literal token can't span `\n` — gate the O(fullContent) regex on per-line presence.
        var sawFootnoteToken = consts_1.reFootnoteToken.test(lineText);
        if (!sawFootnoteToken || !consts_1.reOpenTagFootnoteG.test(lineText)) {
            // Terminate on `fence` (original) plus the LaTeX list rule, so a `\begin{itemize}`
            // before the tag isn't swallowed — a minimal addition (fence + Lists, not the full set).
            var listRule = resolveEnabledRuleFns(state.md.block.ruler, LIST_TERMINATOR_NAME, LIST_RULE_NAME).guarded;
            var probeRules = listRule ? [fence, listRule] : [fence];
            for (; nextLine < endLine; nextLine++) {
                if (anyTerminates(probeRules, state, nextLine, endLine, listRule)) {
                    terminate = true;
                }
                if (terminate) {
                    break;
                }
                if (state.isEmpty(nextLine)) {
                    break;
                }
                pos = state.bMarks[nextLine];
                max = state.eMarks[nextLine];
                lineText = state.src.slice(pos, max);
                if (!lineText || !lineText.trim()) {
                    break;
                }
                fullContent += fullContent ? '\n' : '';
                fullContent += lineText;
                // Two cheap gates (token-seen, `{` present) both must hold before we run the heavy O(fullContent) regex; either gate's `continue` shortcuts to the next line.
                if (!sawFootnoteToken) {
                    if (!consts_1.reFootnoteToken.test(lineText)) {
                        continue;
                    }
                    sawFootnoteToken = true;
                }
                // Opening tag requires `{` — every alternative of the open-tag regex ends with literal `{`.
                // Lines without `{` cannot complete the pattern, so `continue` defers the heavy regex run
                // until a line with `{` arrives. Soundness: `{` cannot straddle a `\n` (it's a single char),
                // so if the pattern matches in `fullContent` after this iteration appended `lineText`, the
                // closing `{` must be present in `lineText` and the gate doesn't lose a match.
                if (!lineText.includes('{')) {
                    continue;
                }
                if (consts_1.reOpenTagFootnoteG.test(fullContent)) {
                    hasOpenTag = true;
                    nextLine += 1;
                    break;
                }
            }
            if (!hasOpenTag || nextLine > endLine) {
                return false;
            }
        }
        var dataTags = (0, utils_1.findOpenCloseTags)(fullContent, consts_1.reOpenTagFootnote, '', '', true);
        if (!((_a = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _a === void 0 ? void 0 : _a.length)) {
            return false;
        }
        pending = dataTags.pending;
        var matchNumbered = dataTags.arrOpen[dataTags.arrOpen.length - 1].content
            .match(consts_1.reOpenTagFootnoteNumbered);
        if (matchNumbered) {
            numbered = matchNumbered.groups.number;
        }
        var startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
        var startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;
        var content = fullContent.slice(startContent);
        var data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
        if (data === null || data === void 0 ? void 0 : data.res) {
            return false;
        }
        var hasEnd = false;
        var nextLineContent = nextLine;
        var inlineContentAfter = '';
        var openBrackets = 0;
        var contentLength = content.length;
        for (; nextLine <= endLine; nextLine++) {
            if (fence(state, nextLine, endLine, true)) {
                terminate = true;
            }
            if (terminate) {
                break;
            }
            pos = state.bMarks[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (hasEnd) {
                if (!lineText || !lineText.trim()) {
                    break;
                }
                if (!(inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length)) {
                    nextLineContent = nextLine;
                }
                inlineContentAfter += '\n';
                inlineContentAfter += lineText;
                var nextLineText = nextLine + 1 <= endLine
                    ? state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
                    : '';
                if (!nextLineText || !nextLineText.trim()) {
                    break;
                }
                continue;
            }
            fullContent += '\n';
            fullContent += lineText;
            if (!lineText || !lineText.trim()) {
                pending = '';
            }
            if (pending) {
                dataTags = (0, utils_1.findOpenCloseTags)(fullContent, consts_1.reOpenTagFootnotetext, '');
                if (!((_b = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _b === void 0 ? void 0 : _b.length)) {
                    break;
                }
            }
            data = (0, common_1.findEndMarker)(lineText, -1, '{', '}', true, openBrackets);
            if (data.res) {
                hasEnd = true;
                nextLineContent = nextLine;
                inlineContentAfter = state.src.slice(startPos + startContent + contentLength + 1 + data.nextPos, state.eMarks[nextLine]);
                content += '\n';
                content += data.content;
                openBrackets = 0;
                continue;
            }
            else {
                if (data.openBrackets) {
                    openBrackets = data.openBrackets;
                }
            }
            content += '\n';
            content += lineText;
            contentLength = content ? content.length : 0;
        }
        if (!data || !data.res) {
            return false;
        }
        /** For validation mode we can terminate immediately */
        if (silent) {
            return true;
        }
        state.line = nextLine + 1;
        var inlineContentBefore = startFootnote > 0
            ? state.src.slice(startPos, startPos + startFootnote)
            : '';
        token = state.push('paragraph_open', 'div', 1);
        token.map = [startLine, state.line];
        if ((inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.length) && ((_c = inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.trim()) === null || _c === void 0 ? void 0 : _c.length)) {
            token = state.push('inline', '', 0);
            token.map = [startLine, startLine];
            token.content = inlineContentBefore;
            token.bMarks = 0;
            token.eMarks = token.bMarks + token.content.length;
            token.bMarksContent = token.bMarks;
            token.eMarksContent = token.eMarks;
            token.lastBreakToSpace = true;
            token.children = [];
        }
        token = state.push('footnote_latex', '', 0);
        token.numbered = numbered;
        var children = [];
        state.md.block.parse(content, state.md, state.env, children);
        token.children = children;
        if ((inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length) && ((_d = inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.trim()) === null || _d === void 0 ? void 0 : _d.length)) {
            token = state.push('inline', '', 0);
            token.map = [nextLineContent, nextLine + 1];
            token.content = inlineContentAfter;
            token.firstBreakToSpace = true;
            token.children = [];
        }
        token = state.push('paragraph_close', 'div', -1);
        return true;
    }
    catch (e) {
        console.log("[ERROR]=>[latex_footnote_block]=>", e);
        return false;
    }
};
exports.latex_footnote_block = latex_footnote_block;
var latex_footnotetext_block = function (state, startLine, endLine, silent) {
    var _a, _b, _c, _d, _e, _f;
    try {
        var token = void 0, lineText = void 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        // Bail when the last `\footnotetext`/`\blfootnotetext` literal is strictly before this block's start. Equality keeps it in scope. `-1` means no match anywhere.
        var lastFootnotetextPos = (0, src_pos_cache_1.lastMatchPosCached)(state, FOOTNOTETEXT_POS_KEY, FOOTNOTETEXT_TOKEN_SWEEP_G);
        if (lastFootnotetextPos < state.bMarks[startLine]) {
            return false;
        }
        var nextLine = startLine + 1;
        var startPos = pos;
        var numbered = void 0;
        lineText = state.src.slice(pos, max);
        var fullContent = lineText;
        var hasOpenTag = false;
        var pending = '';
        var terminate = false;
        var _g = resolveEnabledRuleFns(state.md.block.ruler, FOOTNOTE_TERMINATOR_NAMES, LIST_RULE_NAME), terminatorRules = _g.fns, listTerminator = _g.guarded;
        // Literal token can't span `\n` — gate the O(fullContent) regex on per-line presence.
        var sawFootnotetextToken = consts_1.reFootnotetextToken.test(lineText);
        if (!sawFootnotetextToken || !consts_1.reOpenTagFootnotetextG.test(lineText)) {
            // jump line-by-line until empty one or EOF
            for (; nextLine < endLine; nextLine++) {
                if (anyTerminates(terminatorRules, state, nextLine, endLine, listTerminator)) {
                    terminate = true;
                }
                if (terminate) {
                    break;
                }
                if (state.isEmpty(nextLine)) {
                    break;
                }
                pos = state.bMarks[nextLine];
                max = state.eMarks[nextLine];
                lineText = state.src.slice(pos, max);
                if (!lineText || !lineText.trim()) {
                    break;
                }
                fullContent += fullContent ? '\n' : '';
                fullContent += lineText;
                // Two cheap gates (token-seen, `{` present) both must hold before we run the heavy O(fullContent) regex; either gate's `continue` shortcuts to the next line.
                if (!sawFootnotetextToken) {
                    if (!consts_1.reFootnotetextToken.test(lineText)) {
                        continue;
                    }
                    sawFootnotetextToken = true;
                }
                // Opening tag requires `{` — skip lines without it (covers `\footnotetext\n…\n{` without rescanning fullContent).
                if (!lineText.includes('{')) {
                    continue;
                }
                if (consts_1.reOpenTagFootnotetextG.test(fullContent)) {
                    hasOpenTag = true;
                    nextLine += 1;
                    break;
                }
            }
            if (!hasOpenTag || nextLine > endLine) {
                return false;
            }
        }
        var dataTags = (0, utils_1.findOpenCloseTags)(fullContent, consts_1.reOpenTagFootnotetext, '', '', true);
        if (!((_a = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _a === void 0 ? void 0 : _a.length)) {
            return false;
        }
        pending = dataTags.pending;
        var openTag = dataTags.arrOpen[dataTags.arrOpen.length - 1].content;
        var matchNumbered = openTag
            .match(consts_1.reOpenTagFootnotetextNumbered);
        if (matchNumbered) {
            numbered = matchNumbered.groups.number;
        }
        var startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
        var startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;
        var content = fullContent.slice(startContent);
        var data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
        if (data === null || data === void 0 ? void 0 : data.res) {
            return false;
        }
        var hasEnd = false;
        var nextLineContent = nextLine;
        var inlineContentAfter = '';
        var openBrackets = 0;
        var contentLength = content.length;
        var terminatedLine = -1;
        for (; nextLine <= endLine; nextLine++) {
            pos = state.bMarks[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (hasEnd) {
                for (var i = 0; i < terminatorRules.length; i++) {
                    if (terminatorRules[i](state, nextLine, endLine, true)) {
                        terminatedLine = nextLine;
                        terminate = true;
                        break;
                    }
                }
                if (terminate) {
                    break;
                }
                if (!lineText || !lineText.trim()) {
                    terminatedLine = nextLine;
                    break;
                }
                if (!(inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length)) {
                    nextLineContent = nextLine;
                }
                inlineContentAfter += '\n';
                inlineContentAfter += lineText;
                var nextLineText = nextLine + 1 <= endLine
                    ? state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
                    : '';
                if (!nextLineText || !nextLineText.trim()) {
                    break;
                }
                continue;
            }
            fullContent += '\n';
            fullContent += lineText;
            if (!lineText || !lineText.trim()) {
                pending = '';
            }
            if (pending) {
                dataTags = (0, utils_1.findOpenCloseTags)(fullContent, consts_1.reOpenTagFootnotetext, '');
                if (!((_b = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _b === void 0 ? void 0 : _b.length)) {
                    break;
                }
            }
            data = (0, common_1.findEndMarker)(lineText, -1, '{', '}', true, openBrackets);
            if (data.res) {
                hasEnd = true;
                nextLineContent = nextLine;
                inlineContentAfter = state.src.slice(startPos + startContent + contentLength + 1 + data.nextPos, state.eMarks[nextLine]);
                content += '\n';
                content += data.content;
                openBrackets = 0;
                continue;
            }
            else {
                if (data.openBrackets) {
                    openBrackets = data.openBrackets;
                }
            }
            content += '\n';
            content += lineText;
            contentLength = content ? content.length : 0;
        }
        if (!data || !data.res) {
            return false;
        }
        /** For validation mode we can terminate immediately */
        if (silent) {
            return true;
        }
        state.line = terminatedLine !== -1
            ? nextLine
            : nextLine + 1;
        var inlineContentBefore = startFootnote > 0 ? state.src.slice(startPos, startPos + startFootnote) : '';
        var needToCreateParagraph = ((inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.length) && ((_c = inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.trim()) === null || _c === void 0 ? void 0 : _c.length))
            || ((inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length) && ((_d = inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.trim()) === null || _d === void 0 ? void 0 : _d.length));
        if (needToCreateParagraph) {
            token = state.push('paragraph_open', 'div', 1);
            token.map = [startLine, state.line];
        }
        if ((inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.length) && ((_e = inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.trim()) === null || _e === void 0 ? void 0 : _e.length)) {
            token = state.push('inline', '', 0);
            token.map = [startLine, startLine];
            token.content = inlineContentBefore;
            token.bMarks = 0;
            token.eMarks = token.bMarks + token.content.length;
            token.bMarksContent = token.bMarks;
            token.eMarksContent = token.eMarks;
            token.lastBreakToSpace = true;
            token.children = [];
        }
        token = openTag.indexOf('blfootnotetext') === -1
            ? state.push('footnotetext_latex', '', 0)
            : state.push('blfootnotetext_latex', '', 0);
        token.numbered = numbered;
        var children = [];
        state.md.block.parse(content, state.md, state.env, children);
        token.children = children;
        if ((inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length) && ((_f = inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.trim()) === null || _f === void 0 ? void 0 : _f.length)) {
            token = state.push('inline', '', 0);
            token.map = [nextLineContent, nextLine + 1];
            token.content = inlineContentAfter;
            token.firstBreakToSpace = true;
            token.children = [];
        }
        if (needToCreateParagraph) {
            token = state.push('paragraph_close', 'div', -1);
        }
        return true;
    }
    catch (e) {
        console.log("[ERROR]=>[latex_footnotetext_block]=>", e);
        return false;
    }
};
exports.latex_footnotetext_block = latex_footnotetext_block;
//# sourceMappingURL=block-rule.js.map
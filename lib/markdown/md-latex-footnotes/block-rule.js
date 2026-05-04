"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latex_footnotetext_block = exports.latex_footnote_block = void 0;
var consts_1 = require("../common/consts");
var common_1 = require("../common");
var utils_1 = require("../utils");
var fence = require("markdown-it/lib/rules_block/fence.js");
var FOOTNOTE_POS_KEY = '__mmd_footnoteSrcPositions';
var FOOTNOTETEXT_POS_KEY = '__mmd_footnotetextSrcPositions';
// `(?![a-zA-Z])` anchors the literal token so `\footnotemark` / `\footnotesize` / `\footnotetext` do not match.
var FOOTNOTE_TOKEN_RE = /\\footnote(?![a-zA-Z])/;
var FOOTNOTE_TOKEN_RE_G = new RegExp(FOOTNOTE_TOKEN_RE.source, 'g');
var FOOTNOTETEXT_TOKEN_RE = /\\(?:bl)?footnotetext(?![a-zA-Z])/;
var FOOTNOTETEXT_TOKEN_RE_G = new RegExp(FOOTNOTETEXT_TOKEN_RE.source, 'g');
// Per-state cache of `pattern` match positions in `state.src`. Fast path: caller passes a /g regex owned by this helper. Defensive fallback lifts non-/g to /g per cache-miss.
var getCachedSrcPositions = function (state, key, pattern) {
    var cached = state[key];
    if (Array.isArray(cached)) {
        return cached;
    }
    // Strip `y` (sticky+global → SyntaxError) and `g` (re-added) from inherited flags.
    var re = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, '') + 'g');
    re.lastIndex = 0;
    var positions = [];
    var m;
    while ((m = re.exec(state.src)) !== null) {
        positions.push(m.index);
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
    }
    state[key] = positions;
    return positions;
};
var getTerminatorRulesForFootnotes = function (ruler) {
    var rules = ruler.__rules__;
    var arr = [
        "table", "smilesDrawerBlock", "collapsible", "fence", "blockquote", "hr",
        "list", "footnote_def", "heading", "svg_block", "html_block", "pageBreaksBlock", "deflist",
        "BeginTable", "BeginAlign", "BeginTabular", "BeginProof",
        "BeginTheorem", "headingSection", "mathMLBlock", "pageBreaksBlock",
        "abstractBlock",
        "image_with_size_block"
    ];
    var res = [];
    if (rules === null || rules === void 0 ? void 0 : rules.length) {
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (rule.enabled && arr.includes(rule.name)) {
                res.push(rule.fn);
            }
        }
    }
    return res;
};
var latex_footnote_block = function (state, startLine, endLine, silent) {
    var _a, _b, _c, _d;
    try {
        var token = void 0, lineText = void 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        // Skip if no `\footnote` token at/after this block.
        var positions = getCachedSrcPositions(state, FOOTNOTE_POS_KEY, FOOTNOTE_TOKEN_RE_G);
        if (positions.length === 0 || positions[positions.length - 1] < state.bMarks[startLine]) {
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
        var sawFootnoteToken = FOOTNOTE_TOKEN_RE.test(lineText);
        if (!sawFootnoteToken || !consts_1.reOpenTagFootnoteG.test(lineText)) {
            // jump line-by-line until empty one or EOF
            for (; nextLine < endLine; nextLine++) {
                if (fence(state, nextLine, endLine, true)) {
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
                // Two cheap gates before the O(fullContent) regex; mutually exclusive — exactly one substring test runs per line.
                if (!sawFootnoteToken) {
                    if (!FOOTNOTE_TOKEN_RE.test(lineText)) {
                        continue;
                    }
                    sawFootnoteToken = true;
                }
                // Opening tag requires `{` — skip lines without it (covers `\footnote\n…\n{` without rescanning fullContent).
                if (lineText.indexOf('{') === -1) {
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
        // Skip if no `\footnotetext` / `\blfootnotetext` token at/after this block.
        var positions = getCachedSrcPositions(state, FOOTNOTETEXT_POS_KEY, FOOTNOTETEXT_TOKEN_RE_G);
        if (positions.length === 0 || positions[positions.length - 1] < state.bMarks[startLine]) {
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
        var terminatorRules = getTerminatorRulesForFootnotes(state.md.block.ruler);
        // Literal token can't span `\n` — gate the O(fullContent) regex on per-line presence.
        var sawFootnotetextToken = FOOTNOTETEXT_TOKEN_RE.test(lineText);
        if (!sawFootnotetextToken || !consts_1.reOpenTagFootnotetextG.test(lineText)) {
            // jump line-by-line until empty one or EOF
            for (; nextLine < endLine; nextLine++) {
                for (var i = 0; i < terminatorRules.length; i++) {
                    if (terminatorRules[i](state, nextLine, endLine, true)) {
                        terminate = true;
                        break;
                    }
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
                // Two cheap gates before the O(fullContent) regex; mutually exclusive — exactly one substring test runs per line.
                if (!sawFootnotetextToken) {
                    if (!FOOTNOTETEXT_TOKEN_RE.test(lineText)) {
                        continue;
                    }
                    sawFootnotetextToken = true;
                }
                // Opening tag requires `{` — skip lines without it (covers `\footnotetext\n…\n{` without rescanning fullContent).
                if (lineText.indexOf('{') === -1) {
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
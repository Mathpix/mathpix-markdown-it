"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetTokensBlockParse = void 0;
var tslib_1 = require("tslib");
// Matches leading markdown block markers on the first line:
//   - up to 3 spaces + "#" heading
//   - or one/many ">" blockquote markers with arbitrary spaces between
//   - or fenced code block (```... or ~~~...)
var MD_BLOCK_LEADING_RE = /^(\s{0,3})(#{1,6}(?=\s|$)|>[\s>]*|(`{3,}|~{3,})[^\n]*)/;
/**
 * If the first line looks like a markdown block (heading, quote, fence),
 * escape the first block marker character (prepend "\") so markdown-it's
 * block rules do not trigger on it. Used only inside SetTokensBlockParse.
 */
var escapeLeadingMarkdownBlockLine = function (content) {
    var _a;
    var lines = content.split('\n');
    if (lines.length === 0)
        return content;
    var first = lines[0];
    var m = first.match(MD_BLOCK_LEADING_RE);
    if (!m) {
        return content;
    }
    var indent = (_a = m[1]) !== null && _a !== void 0 ? _a : ''; // leading spaces (0–3)
    var rest = first.slice(indent.length); // starts with '#', '>', ``` or ~~~
    if (!rest.length) {
        return content;
    }
    // Escape the very first marker character:
    //   "# ..."       -> "\# ..."
    //   "> > > foo"   -> "\> > > foo"
    //   "```code"     -> "\```code"
    //   "~~~code"     -> "\~~~code"
    var escapedRest = '\\' + rest[0] + rest.slice(1);
    lines[0] = indent + escapedRest;
    return lines.join('\n');
};
/**
 * Parses a block of content with markdown-it and pushes the resulting
 * block tokens into the current state, with optional control over
 * line mapping, inline rendering, PPTX-specific behavior and temporary
 * disabling of selected block rules (list/blockquote/fence/heading).
 */
var SetTokensBlockParse = function (state, content, options) {
    var e_1, _a;
    if (options === void 0) { options = {}; }
    var startLine = options.startLine, endLine = options.endLine, _b = options.isInline, isInline = _b === void 0 ? false : _b, _c = options.contentPositions, contentPositions = _c === void 0 ? null : _c, _d = options.forPptx, forPptx = _d === void 0 ? false : _d, _e = options.disableBlockRules, disableBlockRules = _e === void 0 ? false : _e;
    var children = [];
    // When block rules are disabled, neutralize leading markdown block markers
    // on the first line so markdown-it does not treat them as real block syntax.
    var safeContent = disableBlockRules
        ? escapeLeadingMarkdownBlockLine(content)
        : content;
    if (disableBlockRules) {
        var blockRuler = state.md.block.ruler;
        var rulesToTouch = ['list'];
        // 1. Let's remember which of these rules were included
        var rulesToReEnable = [];
        if (blockRuler.__rules__) {
            var _loop_1 = function (name_1) {
                var rule = blockRuler.__rules__.find(function (r) { return r.name === name_1; });
                if (rule && rule.enabled) {
                    rulesToReEnable.push(name_1);
                }
            };
            try {
                for (var rulesToTouch_1 = tslib_1.__values(rulesToTouch), rulesToTouch_1_1 = rulesToTouch_1.next(); !rulesToTouch_1_1.done; rulesToTouch_1_1 = rulesToTouch_1.next()) {
                    var name_1 = rulesToTouch_1_1.value;
                    _loop_1(name_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (rulesToTouch_1_1 && !rulesToTouch_1_1.done && (_a = rulesToTouch_1.return)) _a.call(rulesToTouch_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        // 2. Temporarily disable only those that were actually enabled.
        blockRuler.disable(rulesToReEnable, true);
        try {
            state.md.block.parse(safeContent, state.md, state.env, children);
        }
        finally {
            // 3. Only restore what we turned off ourselves.
            blockRuler.enable(rulesToReEnable, true);
        }
    }
    else {
        state.md.block.parse(safeContent, state.md, state.env, children);
    }
    var isFirst = true;
    for (var j = 0; j < children.length; j++) {
        var child = children[j];
        // Push token to state
        state.tokens.push(child);
        var token = child;
        if (isInline && j === 0 && token.type === "paragraph_open") {
            if (token.attrs) {
                var style = token.attrGet('style');
                if (style) {
                    token.attrSet('style', "display: inline; " + style);
                }
                else {
                    token.attrs.push(['style', "display: inline;"]);
                }
            }
            else {
                token.attrSet('style', "display: inline;");
            }
            token.attrSet('data-display', 'inline');
        }
        if (startLine && endLine) {
            token.map = [startLine, endLine];
        }
        if ((contentPositions === null || contentPositions === void 0 ? void 0 : contentPositions.hasOwnProperty('startLine')) && child.map) {
            token.map = [contentPositions.startLine + child.map[0], contentPositions.startLine + child.map[1]];
            if (j === 1 && child.type === "inline") {
                token.bMarks = contentPositions.bMarks;
            }
        }
        if (forPptx && isInline && isFirst && token.type === "paragraph_close") {
            state.push('paragraph_close', 'div', -1);
            isFirst = false;
        }
    }
};
exports.SetTokensBlockParse = SetTokensBlockParse;
//# sourceMappingURL=helper.js.map
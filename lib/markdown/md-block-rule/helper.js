"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetTokensBlockParse = void 0;
var tslib_1 = require("tslib");
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
    var token;
    var children = [];
    if (disableBlockRules) {
        var blockRuler = state.md.block.ruler;
        var rulesToTouch = ['list', 'blockquote', 'fence', 'heading'];
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
            state.md.block.parse(content, state.md, state.env, children);
        }
        finally {
            // 3. Only restore what we turned off ourselves.
            blockRuler.enable(rulesToReEnable, true);
        }
    }
    else {
        state.md.block.parse(content, state.md, state.env, children);
    }
    var isFirst = true;
    for (var j = 0; j < children.length; j++) {
        var child = children[j];
        token = state.push(child.type, child.tag, child.nesting);
        token = Object.assign(token, {
            attrs: child.attrs,
            content: child.content,
            children: child.children,
            info: child.info,
            markup: child.markup,
            meta: child.meta,
        });
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
            token = state.push('paragraph_close', 'div', -1);
            isFirst = false;
        }
    }
};
exports.SetTokensBlockParse = SetTokensBlockParse;
//# sourceMappingURL=helper.js.map
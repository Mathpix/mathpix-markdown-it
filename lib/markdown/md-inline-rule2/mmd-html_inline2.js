"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mmdHtmlInline2 = void 0;
var tslib_1 = require("tslib");
var html_re_1 = require("../common/html-re");
var mmdHtmlInline2 = function (state) {
    var _a;
    if (!((_a = state.tokens) === null || _a === void 0 ? void 0 : _a.length)) {
        return;
    }
    var stack = [];
    var closeStack = [];
    // Helper function to hide soft breaks before a token
    var hideSoftBreakBefore = function (tokens, index) {
        if (index > 0 && tokens[index - 1].type === 'softbreak') {
            tokens[index - 1].hidden = true;
        }
    };
    for (var i = 0; i < state.tokens.length; i++) {
        var token = state.tokens[i];
        if (token.type === 'html_inline') {
            var matchOpen = token.content.match(html_re_1.HTML_OPEN_TAG_RE);
            if (matchOpen) {
                var tag = matchOpen[1] || '';
                var isClose = matchOpen[2] === '/';
                if (tag && !html_re_1.selfClosingTags.includes(tag) && !isClose && !token.isSvg) {
                    stack.push({
                        token: token,
                        content: token.content,
                        tag: tag,
                        idx: i,
                    });
                }
                continue;
            }
            var matchClose = token.content.match(html_re_1.HTML_CLOSE_TAG_RE);
            if (matchClose) {
                var closeTag = matchClose[1];
                if (stack.length === 0) {
                    console.log("Mismatched closing tag: </".concat(closeTag, ">"));
                    closeStack.push({ token: token, content: token.content, tag: closeTag });
                    continue;
                }
                var lastOpenTag = stack[stack.length - 1].tag;
                if (lastOpenTag === closeTag || html_re_1.selfClosingTags.includes(lastOpenTag)) {
                    var pStack = stack.pop();
                    hideSoftBreakBefore(state.tokens, pStack.idx);
                    hideSoftBreakBefore(state.tokens, i);
                    continue;
                }
                console.log("Mismatched closing tag: </".concat(closeTag, ">"));
                closeStack.push({ token: token, content: token.content, tag: closeTag });
            }
        }
    }
    // Convert unmatched opening and closing tags to text type
    var convertToTextType = function (tokens) {
        var e_1, _a;
        try {
            for (var tokens_1 = tslib_1.__values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
                var item = tokens_1_1.value;
                item.token.type = 'text';
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) _a.call(tokens_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    if (stack.length) {
        convertToTextType(stack);
    }
    if (closeStack.length) {
        convertToTextType(closeStack);
    }
};
exports.mmdHtmlInline2 = mmdHtmlInline2;
//# sourceMappingURL=mmd-html_inline2.js.map
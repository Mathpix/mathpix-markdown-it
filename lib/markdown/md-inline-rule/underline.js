"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textUnderline = void 0;
var isSpace = require('markdown-it/lib/common/utils').isSpace;
var common_1 = require("../common");
exports.textUnderline = function (state) {
    var _a;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startPos)
        .match(/^(?:underline)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startPos += match[0].length;
    var type = 'underline';
    //skipping spaces in begin
    for (; startPos < state.src.length; startPos++) {
        var code = state.src.charCodeAt(startPos);
        if (!isSpace(code) && code !== 0x0A) {
            break;
        }
    }
    var _b = common_1.findEndMarker(state.src, startPos), _c = _b.res, res = _c === void 0 ? false : _c, _d = _b.content, content = _d === void 0 ? '' : _d, _e = _b.nextPos, nextPos = _e === void 0 ? 0 : _e, _f = _b.endPos, endPos = _f === void 0 ? 0 : _f;
    if (!res) {
        return false;
    }
    var children = [];
    state.md.inline.parse(content.trim(), state.md, state.env, children);
    var underlineType = 'inline';
    var underlineLevel;
    if (children === null || children === void 0 ? void 0 : children.find(function (item) { return item.type === "underline"; })) {
        var childLevel_1 = 0;
        children.map(function (item) {
            if (item.type === "underline_open" || item.type === "underline_close") {
                item.isSubUnderline = true;
            }
            if (item.type === "underline") {
                if (!item.underlineLevel) {
                    item.underlineLevel = 1;
                }
                if (item.underlineLevel > childLevel_1) {
                    childLevel_1 = item.underlineLevel;
                }
            }
        });
        underlineLevel = childLevel_1 + 1;
    }
    else {
        underlineLevel = 1;
    }
    var token = state.push(type + '_open', "", 0);
    token.inlinePos = {
        start: state.pos,
        end: startPos + 1
    };
    token.nextPos = startPos + 1;
    token.attrSet('data-underline', underlineLevel);
    token.underlineLevel = underlineLevel;
    token.isSubUnderline = false;
    token.underlineType = underlineType;
    token = state.push(type, "", 0);
    if ((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx) {
        token.attrSet('data-underline', underlineLevel);
    }
    token.content = content;
    token.inlinePos = {
        start: startPos + 1,
        end: endPos,
    };
    token.nextPos = endPos;
    token.children = children;
    token.underlineLevel = underlineLevel;
    token.underlineType = underlineType;
    token = state.push(type + '_close', "", 0);
    token.underlineLevel = underlineLevel;
    token.isSubUnderline = false;
    token.underlineType = underlineType;
    state.pos = nextPos;
    state.nextPos = nextPos;
    return true;
};
//# sourceMappingURL=underline.js.map
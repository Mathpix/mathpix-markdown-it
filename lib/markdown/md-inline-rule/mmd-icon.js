"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineMmdIcon = void 0;
var icons_1 = require("../../helpers/icons");
var inlineMmdIcon = function (state, silent) {
    var _a, _b;
    try {
        var pos = state.pos, src = state.src;
        var match = void 0;
        if (src.charCodeAt(pos) !== 0x5c /* \ */) {
            return false;
        }
        var reIcon = /^(?:\\icon\{([^}]*)\})/;
        match = src.slice(pos).match(reIcon);
        if (!match)
            return false;
        if (silent)
            return true;
        var iconName = ((_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        var token = void 0;
        if (!iconName) {
            token = state.push('text', '', 0);
            token.content = '';
            token.latex = match[0];
            state.pos = pos + match.index + match[0].length;
            return true;
        }
        var _c = (0, icons_1.findIcon)(iconName), _d = _c.icon, icon = _d === void 0 ? null : _d, _e = _c.name, name_1 = _e === void 0 ? '' : _e, _f = _c.color, color = _f === void 0 ? '' : _f, _g = _c.isSquared, isSquared = _g === void 0 ? false : _g;
        if (!name_1) {
            token = state.push('text', '', 0);
            token.content = '';
            token.latex = match[0];
            state.pos = pos + match.index + match[0].length;
            return true;
        }
        if (!icon) {
            token = state.push('text_error', '', 0);
            token.content = "The icon name \"".concat(iconName, "\" can't be found.");
            state.pos = pos + match.index + match[0].length;
            return true;
        }
        if (isSquared) {
            token = state.push('text_icon', '', 0);
            token.attrJoin('style', "border: 1px solid; width: 1em; height: 1em; display: inline-block; text-align: center; line-height: 1em;");
            if (color) {
                token.attrJoin('style', "color: ".concat(color, ";"));
            }
            token.content = icon.symbol;
            token.latex = match[0];
            state.pos = pos + match.index + match[0].length;
            return true;
        }
        token = state.push('text_icon', '', 0);
        token.content = icon.symbol;
        if (color) {
            token.attrJoin('style', "color: ".concat(color, ";"));
        }
        if (((_b = icon.name) === null || _b === void 0 ? void 0 : _b.indexOf('fa_')) !== -1) {
            token.attrJoin('style', 'vertical-align: middle;');
        }
        token.latex = match[0];
        state.pos = pos + match.index + match[0].length;
        return true;
    }
    catch (err) {
        console.error("[ERROR]=>[inlineMmdIcon]=>", err);
        return false;
    }
};
exports.inlineMmdIcon = inlineMmdIcon;
//# sourceMappingURL=mmd-icon.js.map
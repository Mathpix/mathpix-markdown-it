"use strict";
//export const itemizeLevel = ['•', '–', '*', '·'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearItemizeLevelTokens = exports.ChangeLevel = exports.GetItemizeLevelTokensByState = exports.GetItemizeLevelTokens = exports.SetItemizeLevelTokensByIndex = exports.SetItemizeLevelTokens = exports.GetEnumerateLevel = exports.GetItemizeLevel = exports.SetDefaultEnumerateLevel = exports.SetDefaultItemizeLevel = exports.itemizeLevelTokens = exports.enumerateLevel = exports.itemizeLevel = exports.enumerateLevelDef = exports.itemizeLevelDef = exports.AvailableStyles = exports.LevelsItem = exports.LevelsEnum = void 0;
var tslib_1 = require("tslib");
var reEnum = /(?:\\alph|\\Alph|\\arabic|\\roman|\\Roman\s{0,}\{(enumi|enumii|enumiii|enumiv)\})/;
var reEnumL = /^(?:alph|Alph|arabic|roman|Roman)/;
exports.LevelsEnum = ["labelenumi", "labelenumii", "labelenumiii", "labelenumiv"];
exports.LevelsItem = ["labelitemi", "labelitemii", "labelitemiii", "labelitemiv"];
exports.AvailableStyles = {
    "alph": "lower-alpha",
    "Alph": "upper-alpha",
    "arabic": "decimal",
    "roman": "lower-roman",
    "Roman": "upper-roman",
};
exports.itemizeLevelDef = ['\\textbullet', '\\textendash', '\\textasteriskcentered', '\\textperiodcentered'];
exports.enumerateLevelDef = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha'];
exports.itemizeLevel = [];
exports.enumerateLevel = [];
exports.itemizeLevelTokens = [];
var SetDefaultItemizeLevel = function () {
    exports.itemizeLevel = [].concat(exports.itemizeLevelDef);
    return exports.itemizeLevel;
};
exports.SetDefaultItemizeLevel = SetDefaultItemizeLevel;
var SetDefaultEnumerateLevel = function () {
    exports.enumerateLevel = [].concat(exports.enumerateLevelDef);
    return exports.enumerateLevel;
};
exports.SetDefaultEnumerateLevel = SetDefaultEnumerateLevel;
var GetItemizeLevel = function (data) {
    if (data === void 0) { data = null; }
    if (!data || data.length === 0) {
        if (!exports.itemizeLevel || exports.itemizeLevel.length === 0) {
            return (0, exports.SetDefaultItemizeLevel)();
        }
        else {
            return [].concat(exports.itemizeLevel);
        }
    }
    else {
        return [].concat(data);
    }
};
exports.GetItemizeLevel = GetItemizeLevel;
var GetEnumerateLevel = function (data) {
    if (data === void 0) { data = null; }
    if (!data || data.length === 0) {
        if (!exports.enumerateLevel || exports.enumerateLevel.length === 0) {
            return (0, exports.SetDefaultEnumerateLevel)();
        }
        else {
            return [].concat(exports.enumerateLevel);
        }
    }
    else {
        return [].concat(data);
    }
};
exports.GetEnumerateLevel = GetEnumerateLevel;
//SetItemizeLevelTokens
var SetItemizeLevelTokens = function (state) {
    var beforeOptions = tslib_1.__assign({}, state.md.options);
    if (state.md.options.forDocx) {
        state.md.options = Object.assign({}, state.md.options, {
            outMath: {
                include_svg: true,
                include_mathml_word: false,
            }
        });
    }
    for (var i = 0; i < exports.itemizeLevel.length; i++) {
        var children = [];
        state.md.inline.parse(exports.itemizeLevel[i], state.md, state.env, children);
        exports.itemizeLevelTokens[i] = children;
    }
    state.md.options = beforeOptions;
    return {
        tokens: [].concat(exports.itemizeLevelTokens),
        contents: [].concat(exports.itemizeLevel)
    };
};
exports.SetItemizeLevelTokens = SetItemizeLevelTokens;
var SetItemizeLevelTokensByIndex = function (state, index) {
    var beforeOptions = tslib_1.__assign({}, state.md.options);
    if (state.md.options.forDocx) {
        state.md.options = Object.assign({}, state.md.options, {
            outMath: {
                include_svg: true,
                include_mathml_word: false,
            }
        });
    }
    var children = [];
    state.md.inline.parse(exports.itemizeLevel[index], state.md, state.env, children);
    exports.itemizeLevelTokens[index] = children;
    state.md.options = beforeOptions;
};
exports.SetItemizeLevelTokensByIndex = SetItemizeLevelTokensByIndex;
var GetItemizeLevelTokens = function (data) {
    if (data === void 0) { data = null; }
    if (!data || data.length === 0) {
        if (exports.itemizeLevelTokens && exports.itemizeLevelTokens.length > 0) {
            return [].concat(exports.itemizeLevelTokens);
        }
        else {
            return [];
        }
    }
    else {
        return [].concat(data);
    }
};
exports.GetItemizeLevelTokens = GetItemizeLevelTokens;
var GetItemizeLevelTokensByState = function (state) {
    if (exports.itemizeLevelTokens && exports.itemizeLevelTokens.length > 0) {
        return {
            contents: [].concat(exports.itemizeLevel),
            tokens: [].concat(exports.itemizeLevelTokens)
        };
    }
    else {
        return (0, exports.SetItemizeLevelTokens)(state);
    }
};
exports.GetItemizeLevelTokensByState = GetItemizeLevelTokensByState;
var ChangeLevel = function (state, data) {
    if (!data) {
        return false;
    }
    var _a = data.command, command = _a === void 0 ? '' : _a, _b = data.params, params = _b === void 0 ? '' : _b;
    if (!command || !params) {
        return false;
    }
    var index = exports.LevelsEnum.indexOf(command);
    if (index >= 0) {
        var matchL = params.match(reEnum);
        if (matchL) {
            var matchE = matchL[0].slice(1).match(reEnumL);
            if (matchE) {
                var newStyle = exports.AvailableStyles[matchE[0]];
                exports.enumerateLevel[index] = newStyle;
                return true;
            }
        }
        return false;
    }
    index = exports.LevelsItem.indexOf(command);
    if (index >= 0) {
        exports.itemizeLevel[index] = params;
        (0, exports.SetItemizeLevelTokensByIndex)(state, index);
        return true;
    }
    return false;
};
exports.ChangeLevel = ChangeLevel;
var clearItemizeLevelTokens = function () {
    exports.itemizeLevelTokens = [];
};
exports.clearItemizeLevelTokens = clearItemizeLevelTokens;
//# sourceMappingURL=re-level.js.map
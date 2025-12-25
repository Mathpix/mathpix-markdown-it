"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.centeringLatex = exports.captionSetupLatex = exports.captionLatex = exports.labelLatex = exports.newCommandQedSymbol = exports.setCounterTheorem = exports.newTheorem = exports.theoremStyle = void 0;
var tslib_1 = require("tslib");
var isSpace = require('markdown-it/lib/common/utils').isSpace;
var consts_1 = require("../common/consts");
var helper_1 = require("./helper");
var common_1 = require("../common");
var labels_1 = require("../common/labels");
/**
 * \theoremstyle{definition} | \theoremstyle{plain} | \theoremstyle{remark}
 * The command \theoremstyle{ } sets the styling for the numbered environment defined right below it
 *   {definition} - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
 *   {plain} - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
 *   {remark} - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
 * */
var theoremStyle = function (state, silent) {
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var nextPos = startPos;
    var content = "";
    var latex = "";
    var match = state.src
        .slice(startPos)
        .match(consts_1.reTheoremStyle);
    if (!match) {
        return false;
    }
    latex = match[0];
    content = match[1];
    nextPos += match[0].length;
    if (!silent) {
        state.env.theoremstyle = content;
        var token = state.push("theoremstyle", "", 0);
        token.content = "";
        token.children = [];
        token.hidden = true;
        token.inlinePos = {
            start: state.pos,
            end: nextPos
        };
        if (state.md.options.forLatex) {
            token.latex = latex;
            token.hidden = false;
        }
    }
    state.pos = nextPos;
    return true;
};
exports.theoremStyle = theoremStyle;
/**
 * \newtheorem{name}{print}[numbered]
 *   {name} - is the name of the environment
 *   {print} is the word to be shown in the document
 *   [numbered] - is the sectional unit based on which the environments is to be numbered (this is optional
 * */
var newTheorem = function (state, silent) {
    var _a, _b, _c;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var max = state.posMax;
    var envName = "";
    var envPrint = "";
    var numbered = "";
    var nextPos = startPos;
    var content = "";
    var isNumbered = true;
    var useCounter = "";
    /** \newtheorem{name} - numbered theorem */
    var match = state.src
        .slice(startPos)
        .match(consts_1.reNewTheoremInit);
    if (!match) {
        isNumbered = false;
        /** \newtheorem*{name} - unnumbered theorem */
        match = state.src
            .slice(startPos)
            .match(consts_1.reNewTheoremUnNumberedInit);
    }
    if (!match) {
        return false;
    }
    envName = ((_a = match.groups) === null || _a === void 0 ? void 0 : _a.name) ? match.groups.name : match[1];
    if (!envName) {
        return false;
    }
    nextPos += match[0].length;
    // \newtheorem{name}  {print}[numbered]
    //                  ^^ skipping these spaces
    for (; nextPos < max; nextPos++) {
        var code = state.src.charCodeAt(nextPos);
        if (!isSpace(code) && code !== 0x0A) {
            break;
        }
    }
    if (nextPos >= max) {
        return false;
    }
    // \newtheorem*{name}{print}
    //                  ^^ should be { 
    if (!isNumbered && state.src.charCodeAt(nextPos) !== 123 /* { */) {
        return false;
    }
    // \newtheorem{name}{print}[numbered] or \newtheorem{name}[numbered]{print}
    //                  ^^ should be {                        ^^ should be [
    if (state.src.charCodeAt(nextPos) !== 123 /* { */ && state.src.charCodeAt(nextPos) !== 0x5B /* [ */) {
        return false;
    }
    var data = null;
    var dataNumbered = null;
    /**
     * \newtheorem{corollary}{Corollary}[theorem]
     * An environment called corollary is created,
     * the counter of this new environment will be reset every time a new theorem environment is used.
     * */
    if (state.src.charCodeAt(nextPos) === 123 /* { */) {
        data = (0, common_1.findEndMarker)(state.src, nextPos);
        if (!data || !data.res) {
            return false; /** can not find end marker */
        }
        envPrint = data.content;
        nextPos = data.nextPos;
        if (nextPos < max) {
            // \newtheorem{name}{print}  [numbered]
            //                         ^^ skipping these spaces
            for (; nextPos < max; nextPos++) {
                var code = state.src.charCodeAt(nextPos);
                if (!isSpace(code) && code !== 0x0A) {
                    break;
                }
            }
        }
        if (nextPos < max && state.src.charCodeAt(nextPos) === 0x5B /* [ */) {
            // \newtheorem{name}{print}[numbered]
            //                         ^^ get numbered
            dataNumbered = (0, common_1.findEndMarker)(state.src, nextPos, "[", "]");
            if (!dataNumbered || !dataNumbered.res) {
                return false; /** can not find end marker */
            }
            numbered = dataNumbered.content;
            nextPos = dataNumbered.nextPos;
        }
    }
    else {
        /**
         * \newtheorem{lemma}[theorem]{Lemma}
         * In this case, the even though a new environment called lemma is created,
         * it will use the same counter as the theorem environment.
         * */
        if (state.src.charCodeAt(nextPos) === 0x5B /* [ */) {
            dataNumbered = (0, common_1.findEndMarker)(state.src, nextPos, "[", "]");
            if (!dataNumbered || !dataNumbered.res) {
                return false; /** can not find end marker */
            }
            numbered = dataNumbered.content;
            nextPos = dataNumbered.nextPos;
            useCounter = numbered;
            if (nextPos < max) {
                // \newtheorem{name}[numbered]  {print}
                //                            ^^ skipping these spaces
                for (; nextPos < max; nextPos++) {
                    var code = state.src.charCodeAt(nextPos);
                    if (!isSpace(code) && code !== 0x0A) {
                        break;
                    }
                }
            }
            if (nextPos < max && state.src.charCodeAt(nextPos) === 123 /* { */) {
                // \newtheorem{name}[numbered]{print}
                //                            ^^ get print
                data = (0, common_1.findEndMarker)(state.src, nextPos);
                if (!data || !data.res) {
                    return false; /** can not find end marker */
                }
                envPrint = data.content;
                nextPos = data.nextPos;
            }
        }
    }
    content = state.src.slice(startPos, nextPos);
    if (!silent) {
        (0, helper_1.addTheoremEnvironment)({
            name: envName,
            print: envPrint,
            counter: 0,
            isNumbered: isNumbered,
            counterName: numbered,
            parents: [],
            useCounter: useCounter,
            style: ((_b = state.env) === null || _b === void 0 ? void 0 : _b.theoremstyle) ? (_c = state.env) === null || _c === void 0 ? void 0 : _c.theoremstyle : consts_1.defTheoremStyle
        });
        if (isNumbered) {
            (0, helper_1.addEnvironmentsCounter)({
                environment: envName,
                counter: 0
            });
        }
        var token = state.push("newtheorem", "", 0);
        token.content = "";
        token.children = [];
        token.hidden = true;
        token.inlinePos = {
            start: state.pos,
            end: nextPos
        };
        if (state.md.options.forLatex) {
            token.latex = content;
            token.hidden = false;
        }
    }
    state.pos = nextPos;
    return true;
};
exports.newTheorem = newTheorem;
var setCounterTheorem = function (state, silent) {
    var _a, _b;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var envName = "";
    var numStr = "";
    var nextPos = startPos;
    var content = "";
    var match = state.src
        .slice(startPos)
        .match(consts_1.reSetCounter);
    if (!match) {
        return false;
    }
    content = match[0];
    nextPos += match[0].length;
    if (!silent) {
        envName = ((_a = match.groups) === null || _a === void 0 ? void 0 : _a.name) ? match.groups.name : match[1];
        if (!envName) {
            return false;
        }
        numStr = ((_b = match.groups) === null || _b === void 0 ? void 0 : _b.number) ? match.groups.number : match[2];
        numStr = numStr ? numStr.trim() : '';
        var num = numStr && consts_1.reNumber.test(numStr)
            ? Number(match[2].trim()) : 0;
        var res = (0, helper_1.setCounterTheoremEnvironment)(envName, num);
        if (!res) {
            return false;
        }
        var token = state.push("theorem_setcounter", "", 0);
        token.content = "";
        token.children = [];
        token.hidden = true;
        token.inlinePos = {
            start: state.pos,
            end: nextPos
        };
        if (state.md.options.forLatex) {
            token.latex = content;
            token.hidden = false;
        }
    }
    state.pos = nextPos;
    return true;
};
exports.setCounterTheorem = setCounterTheorem;
/**
 * \renewcommand\qedsymbol{$\blacksquare$}
 * \renewcommand\qedsymbol{QED}
 */
var newCommandQedSymbol = function (state, silent) {
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var nextPos = startPos;
    var content = "";
    var latex = "";
    var match = state.src
        .slice(startPos)
        .match(consts_1.reNewCommandQedSymbol);
    if (!match) {
        return false;
    }
    latex = match[0];
    content = match[1];
    nextPos += match[0].length;
    if (!silent) {
        state.env.qedsymbol = content;
        var token = state.push("renewcommand_qedsymbol", "", 0);
        token.content = "";
        token.children = [];
        token.hidden = true;
        token.inlinePos = {
            start: state.pos,
            end: nextPos
        };
        if (state.md.options.forLatex) {
            token.latex = latex;
            token.hidden = false;
        }
    }
    state.pos = nextPos;
    return true;
};
exports.newCommandQedSymbol = newCommandQedSymbol;
var labelLatex = function (state, silent) {
    var _a;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var nextPos = startPos;
    var match = state.src
        .slice(startPos)
        .match(/^\\label\s{0,}\{([^}]*)\}/);
    if (!match) {
        return false;
    }
    var labelKey = match[1];
    var label = null;
    nextPos += match[0].length;
    if (!silent) {
        /** Add a reference to the theorem to the global labelsList */
        if (state.env.currentTag) {
            label = {
                key: labelKey,
                id: encodeURIComponent(labelKey),
                tag: state.env.currentTag.number,
                type: state.env.currentTag.type,
                tokenUuidInParentBlock: state.env.currentTag.tokenUuidInParentBlock
            };
            (0, labels_1.addIntoLabelsList)(label);
        }
        var latex = match[0];
        var token = state.push("label", "", 0);
        token.content = labelKey;
        token.children = [];
        token.latex = latex;
        token.currentTag = ((_a = state.env) === null || _a === void 0 ? void 0 : _a.currentTag) ? tslib_1.__assign({}, state.env.currentTag) : {};
        token.hidden = true; /** Ignore this element when rendering to HTML */
    }
    state.pos = nextPos;
    return true;
};
exports.labelLatex = labelLatex;
var captionLatex = function (state, silent) {
    var _a;
    var captionTag = /^\\caption\s{0,}\{([^}]*)\}/;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var nextPos = startPos;
    var match = state.src
        .slice(startPos)
        .match(captionTag);
    if (!match) {
        return false;
    }
    var latex = match[0];
    nextPos += match[0].length;
    if (!silent) {
        var token = state.push("caption", "", 0);
        token.content = match[1];
        token.children = [];
        token.latex = latex;
        token.currentTag = ((_a = state.env) === null || _a === void 0 ? void 0 : _a.currentTag) ? tslib_1.__assign({}, state.env.currentTag) : {};
        token.hidden = true; /** Ignore this element when rendering to HTML */
    }
    state.pos = nextPos;
    return true;
};
exports.captionLatex = captionLatex;
var captionSetupLatex = function (state, silent) {
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var nextPos = startPos;
    var match = state.src
        .slice(startPos)
        .match(consts_1.RE_CAPTION_SETUP);
    if (!match) {
        return false;
    }
    var latex = match[0];
    nextPos += match[0].length;
    if (!silent) {
        var token = state.push("captionsetup", "", 0);
        token.content = match[1];
        token.children = [];
        token.latex = latex;
        token.hidden = true; /** Ignore this element when rendering to HTML */
    }
    state.pos = nextPos;
    return true;
};
exports.captionSetupLatex = captionSetupLatex;
var centeringLatex = function (state, silent) {
    var _a;
    var alignTagG = /^\\centering/;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var nextPos = startPos;
    var match = state.src
        .slice(startPos)
        .match(alignTagG);
    if (!match) {
        return false;
    }
    var latex = match[0];
    nextPos += match[0].length;
    if (!silent) {
        var token = state.push("centering", "", 0);
        token.content = '';
        token.children = [];
        token.latex = latex;
        token.currentTag = ((_a = state.env) === null || _a === void 0 ? void 0 : _a.currentTag) ? tslib_1.__assign({}, state.env.currentTag) : {};
        token.hidden = true; /** Ignore this element when rendering to HTML */
    }
    state.pos = nextPos;
    return true;
};
exports.centeringLatex = centeringLatex;
//# sourceMappingURL=inline-rule.js.map
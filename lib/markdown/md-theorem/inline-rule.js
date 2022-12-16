"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelLatex = exports.newCommandQedSymbol = exports.newTheorem = exports.theoremStyle = void 0;
var consts_1 = require("../common/consts");
var helper_1 = require("./helper");
/**
 * \theoremstyle{definition} | \theoremstyle{plain} | \theoremstyle{remark}
 * The command \theoremstyle{ } sets the styling for the numbered environment defined right below it
 *   {definition} - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
 *   {plain} - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
 *   {remark} - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
 * */
exports.theoremStyle = function (state) {
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
    state.env.theoremstyle = content;
    var token = state.push("theoremstyle", "", 0);
    token.content = "";
    token.children = [];
    if (state.md.options.forLatex) {
        token.latex = latex;
    }
    state.pos = nextPos;
    return true;
};
/**
 * \newtheorem{name}{print}[numbered]
 *   {name} - is the name of the environment
 *   {print} is the word to be shown in the document
 *   [numbered] - is the sectional unit based on which the environments is to be numbered (this is optional
 * */
exports.newTheorem = function (state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var envName = "";
    var envPrint = "";
    var numbered = "";
    var nextPos = startPos;
    var content = "";
    var isNumbered = true;
    var match = state.src
        .slice(startPos)
        .match(consts_1.reNewTheoremNumbered);
    if (match) {
        envName = ((_a = match.groups) === null || _a === void 0 ? void 0 : _a.name) ? match.groups.name : match[1];
        envPrint = ((_b = match.groups) === null || _b === void 0 ? void 0 : _b.print) ? match.groups.print : match[2];
        numbered = ((_c = match.groups) === null || _c === void 0 ? void 0 : _c.numbered) ? match.groups.numbered : match[3];
        nextPos += match[0].length;
        content = match[0];
    }
    else {
        match = state.src
            .slice(startPos)
            .match(consts_1.reNewTheoremNumbered2);
        if (match) {
            envName = ((_d = match.groups) === null || _d === void 0 ? void 0 : _d.name) ? match.groups.name : match[1];
            numbered = ((_e = match.groups) === null || _e === void 0 ? void 0 : _e.numbered) ? match.groups.numbered : match[2];
            envPrint = ((_f = match.groups) === null || _f === void 0 ? void 0 : _f.print) ? match.groups.print : match[3];
            nextPos += match[0].length;
            content = match[0];
        }
        else {
            match = state.src
                .slice(startPos)
                .match(consts_1.reNewTheorem);
            if (match) {
                envName = ((_g = match.groups) === null || _g === void 0 ? void 0 : _g.name) ? match.groups.name : match[1];
                envPrint = ((_h = match.groups) === null || _h === void 0 ? void 0 : _h.print) ? match.groups.print : match[2];
                nextPos += match[0].length;
                content = match[0];
            }
            else {
                match = state.src
                    .slice(startPos)
                    .match(consts_1.reNewTheoremUnNumbered);
                if (match) {
                    envName = ((_j = match.groups) === null || _j === void 0 ? void 0 : _j.name) ? match.groups.name : match[1];
                    envPrint = ((_k = match.groups) === null || _k === void 0 ? void 0 : _k.print) ? match.groups.print : match[2];
                    nextPos += match[0].length;
                    content = match[0];
                    isNumbered = false;
                }
                else {
                    return false;
                }
            }
        }
    }
    if (!envName || !envPrint) {
        return false;
    }
    helper_1.addTheoremEnvironment({
        name: envName,
        print: envPrint,
        counter: 0,
        isNumbered: isNumbered,
        counterName: numbered,
        style: ((_l = state.env) === null || _l === void 0 ? void 0 : _l.theoremstyle) ? (_m = state.env) === null || _m === void 0 ? void 0 : _m.theoremstyle : consts_1.defTheoremStyle
    });
    var token = state.push("newtheorem", "", 0);
    token.content = "";
    token.children = [];
    if (state.md.options.forLatex) {
        token.latex = content;
    }
    state.pos = nextPos;
    return true;
};
/**
 * \renewcommand\qedsymbol{$\blacksquare$}
 * \renewcommand\qedsymbol{QED}
 */
exports.newCommandQedSymbol = function (state) {
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
    state.env.qedsymbol = content;
    var token = state.push("renewcommand_qedsymbol", "", 0);
    token.content = "";
    token.children = [];
    if (state.md.options.forLatex) {
        token.latex = latex;
    }
    state.pos = nextPos;
    return true;
};
exports.labelLatex = function (state) {
    if (!state.md.options.forLatex) {
        return false;
    }
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var nextPos = startPos;
    var latex = "";
    var match = state.src
        .slice(startPos)
        .match(consts_1.labelTag);
    if (!match) {
        return false;
    }
    latex = match[0];
    nextPos += match[0].length;
    var token = state.push("label", "", 0);
    token.content = "";
    token.children = [];
    token.latex = latex;
    state.pos = nextPos;
    return true;
};
//# sourceMappingURL=inline-rule.js.map
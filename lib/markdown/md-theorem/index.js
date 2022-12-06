"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTheorems = exports.mappingTheorems = exports.BeginEnvironmentBlock = exports.newTheorem = exports.newTheoremBlock = exports.getTheoremNumberByLabel = exports.resetTheoremEnvironments = exports.getTheoremEnvironmentIndex = exports.getTheoremEnvironment = exports.addTheoremEnvironment = exports.openTagDescription = exports.openTag = exports.theorems = exports.envNumbers = void 0;
var helper_1 = require("../md-block-rule/helper");
var consts_1 = require("../common/consts");
var utils_1 = require("../utils");
var theoremEnvironments = [];
exports.envNumbers = [];
exports.theorems = [];
var reNewTheorem = /\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\{(?<print>[\w\s]+)\}/;
var reNewTheoremNumbered = /\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\{(?<print>[\w\s]+)\}\s{0,}\[(?<numbered>[\w\s]+)\]/;
var reNewTheoremNumbered2 = /\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\[(?<numbered>[\w\s]+)\]\s{0,}\{(?<print>[\w\s]+)\}/;
exports.openTag = /\\begin\s{0,}\{(?<name>[\w\s]+)\}/;
exports.openTagDescription = /\\begin\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\[(?<description>[\w\s]+)\]/;
exports.addTheoremEnvironment = function (data) {
    var index = theoremEnvironments.findIndex(function (item) { return item.name === data.name; });
    if (index === -1) {
        theoremEnvironments.push(data);
    }
};
exports.getTheoremEnvironment = function (name) {
    return (theoremEnvironments === null || theoremEnvironments === void 0 ? void 0 : theoremEnvironments.length) ? theoremEnvironments.find(function (item) { return item.name === name; })
        : null;
};
exports.getTheoremEnvironmentIndex = function (name) {
    return (theoremEnvironments === null || theoremEnvironments === void 0 ? void 0 : theoremEnvironments.length) ? theoremEnvironments.findIndex(function (item) { return item.name === name; })
        : -1;
};
exports.resetTheoremEnvironments = function () {
    theoremEnvironments = [];
};
exports.getTheoremNumberByLabel = function (envLabel) {
    var index = exports.envNumbers.findIndex(function (item) { return item.label === envLabel; });
    if (index === -1) {
        return '';
    }
    return exports.envNumbers[index].number;
};
exports.newTheoremBlock = function (state, startLine) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var endLine = state.lineMax;
    var lineText = state.src.slice(pos, max);
    var testNewTheorem = /\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}/;
    if (!testNewTheorem.test(lineText)) {
        if (state.isEmpty(nextLine)) {
            return false;
        }
    }
    else {
        /** Get current rule */
        var children = [];
        state.md.inline.parse(lineText, state.md, state.env, children);
    }
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (!testNewTheorem.test(lineText)) {
            if (nextLine + 1 === endLine || state.isEmpty(nextLine + 1)) {
                break;
            }
        }
        else {
            /** Get current rule */
            var children = [];
            state.md.inline.parse(lineText, state.md, state.env, children);
        }
    }
    return false;
};
/**
 * \newtheorem{name}{print}[numbered]
 *   {name} - is the name of the environment
 *   {print} is the word to be shown in the document
 *   [numbered] - is the sectional unit based on which the environments is to be numbered (this is optional
 * */
exports.newTheorem = function (state) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var envName = "";
    var envPrint = "";
    var numbered = "";
    var nextPos = startPos;
    var content = "";
    var match = state.src
        .slice(startPos)
        .match(reNewTheoremNumbered);
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
            .match(reNewTheoremNumbered2);
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
                .match(reNewTheorem);
            if (match) {
                envName = ((_g = match.groups) === null || _g === void 0 ? void 0 : _g.name) ? match.groups.name : match[1];
                envPrint = ((_h = match.groups) === null || _h === void 0 ? void 0 : _h.print) ? match.groups.print : match[2];
                nextPos += match[0].length;
                content = match[0];
            }
            else {
                return false;
            }
        }
    }
    if (!envName || !envPrint) {
        return false;
    }
    exports.addTheoremEnvironment({
        name: envName,
        print: envPrint,
        counter: 0,
        isNumbered: true,
        counterName: numbered
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
exports.BeginEnvironmentBlock = function (state, startLine, endLine) {
    var _a, _b;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var token;
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    var strBefore = "";
    var match = lineText.match(exports.openTagDescription);
    if (!match) {
        match = lineText.match(exports.openTag);
    }
    if (!match) {
        return false;
    }
    var envName = ((_a = match.groups) === null || _a === void 0 ? void 0 : _a.name) ? match.groups.name : match[1];
    envName = envName ? envName.trim() : '';
    var envDescription = ((_b = match.groups) === null || _b === void 0 ? void 0 : _b.description) ? match.groups.description
        : match[2] ? match[2] : '';
    envDescription = envDescription ? envDescription.trim() : '';
    if (!envName) {
        return false;
    }
    if (consts_1.latexEnvironments.includes(envName) || consts_1.mathEnvironments.includes(envName)) {
        /** Ignore already defined LaTeX environments */
        return false;
    }
    /** Inline content before theorem block */
    strBefore = match.index > 0 ? lineText.slice(0, match.index) : '';
    var closeTag = utils_1.endTag(envName);
    // let content: string = '';
    var resText = '';
    var isCloseTagExist = false;
    if (closeTag.test(lineText)) {
        /**TODO: inline rule*/
        // if (InlineBlockBeginTable(state, startLine)) {
        //   return true;
        // }
    }
    if (match.index + match[0].length < lineText.trim().length) {
        resText = lineText.slice(match.index + match[0].length);
    }
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (closeTag.test(lineText)) {
            isCloseTagExist = true;
            lineText += '\n';
            break;
        }
        if (resText && lineText) {
            resText += '\n' + lineText;
        }
        else {
            resText += lineText;
        }
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
        }
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) {
            continue;
        }
    }
    if (!isCloseTagExist) {
        return false;
    }
    var matchE = lineText.match(closeTag);
    if (matchE) {
        resText += lineText.slice(0, matchE.index);
        // pE = matchE.index
    }
    state.line = nextLine + 1;
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, state.line];
    if (strBefore && (strBefore === null || strBefore === void 0 ? void 0 : strBefore.trim())) {
        token = state.push('inline', '', 0);
        token.children = [];
        token.content = strBefore;
    }
    /** Get label from theorem content */
    var label = "";
    match = resText.match(consts_1.labelTag);
    if (match) {
        label = match[1];
        resText = resText.replace(consts_1.labelTagG, '');
    }
    var envIndex = envName
        ? exports.getTheoremEnvironmentIndex(envName)
        : -1;
    var number = getTheoremNumber(envIndex, state.env);
    token = state.push('theorem_open', 'div', 1);
    token.environment = envName;
    token.envDescription = envDescription;
    token.envLabel = label;
    token.envNumber = number;
    state.env.theorem = {
        name: envName,
        label: label,
        number: number
    };
    exports.theorems.push({
        id: utils_1.uid(),
        name: envName,
        description: envDescription,
        label: label,
        number: number
    });
    if (label) {
        var index = exports.envNumbers.findIndex(function (item) { return item.label === label; });
        if (index === -1) {
            exports.envNumbers.push({
                label: label,
                number: number
            });
        }
    }
    helper_1.SetTokensBlockParse(state, resText, 0, 0, true);
    // token = state.push('inline', '', 0);
    // token.content = resText;
    // token.map = [startLine, state.line];
    // token.children = [];
    token = state.push('theorem_close', 'div', -1);
    token = state.push('paragraph_close', 'div', -1);
    return true;
};
var getTheoremNumber = function (envIndex, env) {
    var envItem = theoremEnvironments[envIndex];
    if (envItem.counterName) {
        var parentNum = "";
        switch (envItem.counterName) {
            case "section":
                parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
                break;
            case "subsection":
                parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
                parentNum += ".";
                parentNum += (env === null || env === void 0 ? void 0 : env.subsection) ? env.subsection.toString() : "0";
                break;
            case "subsubsection":
                parentNum = (env === null || env === void 0 ? void 0 : env.section) ? env.section.toString() : "0";
                parentNum += ".";
                parentNum += (env === null || env === void 0 ? void 0 : env.subsection) ? env.subsection.toString() : "0";
                parentNum += ".";
                parentNum += (env === null || env === void 0 ? void 0 : env.subsubsection) ? env.subsubsection.toString() : "0";
                break;
        }
        if (!parentNum) {
            /** Find new env */
            var counterItem = exports.getTheoremEnvironment(envItem.counterName);
            if (counterItem) {
                parentNum = counterItem.lastNumber;
            }
        }
        if (parentNum) {
            if (envItem.parentNumber !== parentNum) {
                envItem.parentNumber = parentNum;
                envItem.counter = 1;
            }
            else {
                envItem.counter += 1;
            }
            envItem.lastNumber = envItem.parentNumber + '.' + envItem.counter.toString();
            return envItem.lastNumber;
        }
    }
    envItem.counter += 1;
    envItem.lastNumber = envItem.counter.toString();
    return envItem.counter;
};
var renderTheoremOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var envName = token.environment;
    var envDescription = token.envDescription;
    var envLabel = token.envLabel;
    var envNumber = token.envNumber;
    var envIndex = envName
        ? exports.getTheoremEnvironmentIndex(envName)
        : -1;
    if (envIndex !== -1) {
        var envItem = theoremEnvironments[envIndex];
        var labelRef = envLabel ? encodeURIComponent(envLabel) : '';
        var description = envDescription
            ? "<span style=\"font-weight: 600; font-style: normal; margin-right: 10px\">(" + envDescription + ")</span>"
            : '';
        var print_1 = envItem.isNumbered
            ? "<span style=\"font-weight: 600; font-style: normal; margin-right: " + (description ? "6px" : "10px") + "\">" + envItem.print + " " + envNumber + "</span>"
            : "<span style=\"font-weight: 600; font-style: normal; margin-right: " + (description ? "6px" : "10px") + "\">" + envItem.print + "</span>";
        return labelRef
            ? "<div id=\"" + labelRef + "\" class=\"theorem\" style=\"font-style: italic;\">" + print_1 + description
            : '<div class="theorem" style="font-style: italic;">' + print_1 + description;
    }
    return "<div class=\"theorem\" style=\"font-style: italic;\">";
};
exports.mappingTheorems = {
    newtheorem: "newtheorem",
    theorem_open: "theorem_open",
    theorem_close: "theorem_close"
};
exports.renderTheorems = function (md) {
    Object.keys(exports.mappingTheorems).forEach(function (key) {
        md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
            if (env === void 0) { env = {}; }
            switch (tokens[idx].type) {
                case "newtheorem":
                    return '';
                case "theorem_open":
                    return renderTheoremOpen(tokens, idx, options, env, slf);
                case "theorem_close":
                    return "</div>";
                default:
                    return '';
            }
        };
    });
};
//# sourceMappingURL=index.js.map
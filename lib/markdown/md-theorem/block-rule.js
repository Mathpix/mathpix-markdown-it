"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeginProof = exports.BeginTheorem = exports.newTheoremBlock = void 0;
var helper_1 = require("../md-block-rule/helper");
var utils_1 = require("../utils");
var consts_1 = require("../common/consts");
var helper_2 = require("./helper");
var mdPluginText_1 = require("../mdPluginText");
var labels_1 = require("../common/labels");
var newTheoremBlock = function (state, startLine, endLine, silent) {
    var nextLine = startLine + 1;
    var terminate, i, l;
    var terminatorRules = [].concat(state.md.block.ruler.getRules('paragraph'), state.md.block.ruler.getRules('newTheoremBlock'));
    terminatorRules.push(mdPluginText_1.headingSection);
    var content = '';
    var oldParentType = state.parentType;
    state.parentType = 'paragraph';
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, startLine, nextLine, true)) {
            terminate = true;
            break;
        }
    }
    if (terminate) {
        return false;
    }
    for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
        if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
        }
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) {
            continue;
        }
        // Some tags can terminate paragraph without empty line.
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
            }
        }
        if (terminate) {
            break;
        }
    }
    content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
    if (!consts_1.reNewTheoremG.test(content)
        && !consts_1.reNewCommandQedSymbolG.test(content)
        && !consts_1.reTheoremStyleG.test(content)
        && !consts_1.reSetCounterG.test(content)) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    var children = [];
    state.md.inline.parse(content, state.md, state.env, children);
    var token;
    var newTheoremIndex = (children === null || children === void 0 ? void 0 : children.length)
        ? children.findIndex(function (item) { return (item.type === "newtheorem"
            || item.type === "theoremstyle"
            || item.type === "renewcommand_qedsymbol"
            || item.type === "theorem_setcounter"
            || item.type === "section_setcounter"); })
        : -1;
    if (newTheoremIndex === -1) {
        return false;
    }
    var childrenFiltered = children.filter(function (item) { return (item.type !== "newtheorem"
        && item.type !== "theoremstyle"
        && item.type !== "softbreak"
        && item.type !== "renewcommand_qedsymbol"
        && item.type !== "theorem_setcounter"
        && item.type !== "section_setcounter"); });
    state.line = nextLine;
    token = state.push('paragraph_open', 'div', 1);
    if (childrenFiltered.length) {
        token.attrSet('style', 'margin-top: 0; margin-bottom: 1rem;');
    }
    else {
        token.attrSet('style', 'margin-top: 0; margin-bottom: 0;');
    }
    token.map = [startLine, state.line];
    token.children = [];
    token = state.push('inline', '', 0);
    token.content = "";
    token.children = [];
    token.map = [startLine, state.line];
    var itemBefore = null;
    for (var j = 0; j < children.length; j++) {
        var item = children[j];
        if (((itemBefore === null || itemBefore === void 0 ? void 0 : itemBefore.type) === "newtheorem" || (itemBefore === null || itemBefore === void 0 ? void 0 : itemBefore.type) === "theoremstyle"
            || (itemBefore === null || itemBefore === void 0 ? void 0 : itemBefore.type) === "renewcommand_qedsymbol"
            || (itemBefore === null || itemBefore === void 0 ? void 0 : itemBefore.type) === "theorem_setcounter" || (itemBefore === null || itemBefore === void 0 ? void 0 : itemBefore.type) === "section_setcounter")
            && item.type === "softbreak") {
            item.hidden = true;
            itemBefore = item;
            if (state.md.options.forLatex) {
                item.hidden = false;
            }
            token.children.push(item);
            continue;
        }
        token.children.push(item);
        itemBefore = item;
    }
    token = state.push('paragraph_close', 'div', -1);
    state.parentType = oldParentType;
    return true;
};
exports.newTheoremBlock = newTheoremBlock;
var BeginTheorem = function (state, startLine, endLine, silent) {
    var _a, _b;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var token;
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    var strBefore = "";
    var match = lineText.match(consts_1.openTagDescription);
    if (!match) {
        match = lineText.match(consts_1.openTag);
    }
    if (!match) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    var envName = ((_a = match.groups) === null || _a === void 0 ? void 0 : _a.name) ? match.groups.name : match[1];
    envName = envName ? envName.trim() : '';
    var envDescription = ((_b = match.groups) === null || _b === void 0 ? void 0 : _b.description)
        ? match.groups.description
        : match[2] ? match[2] : '';
    var indexName = envName && match[1] ? lineText.indexOf(match[1]) : -1;
    var namePositions = envName && indexName >= 0 ? {
        startLine: startLine,
        endLine: startLine,
        bMarks: indexName,
        eMarks: indexName + match[1].length,
    } : null;
    var indexDescriptiont = envDescription && match[2] ? lineText.lastIndexOf(match[2]) : -1;
    var descriptiontPositions = envDescription && indexDescriptiont >= 0 ? {
        startLine: startLine,
        endLine: startLine,
        bMarks: indexDescriptiont,
        eMarks: indexDescriptiont + match[2].length,
    } : null;
    if (!envName) {
        return false;
    }
    if (consts_1.latexEnvironments.includes(envName) || consts_1.mathEnvironments.includes(envName)) {
        /** Ignore already defined LaTeX environments */
        return false;
    }
    /** Inline content before theorem block */
    strBefore = match.index > 0 ? lineText.slice(0, match.index) : '';
    var closeTag = (0, utils_1.endTag)(envName);
    if (!closeTag) {
        return false;
    }
    // let content: string = '';
    var resText = '';
    var isCloseTagExist = false;
    if (closeTag.test(lineText)) {
        /**TODO: inline rule*/
        // if (InlineBlockBeginTable(state, startLine)) {
        //   return true;
        // }
    }
    var contentPositions = {
        startLine: startLine,
        endLine: startLine,
        bMarks: 0
    };
    if (match.index + match[0].length < lineText.trim().length) {
        resText = lineText.slice(match.index + match[0].length);
        contentPositions.startLine = startLine;
        contentPositions.bMarks = match.index + match[0].length;
    }
    else {
        contentPositions.startLine = nextLine;
        contentPositions.bMarks = 0;
    }
    var latexBegin = match[0];
    var latexEnd = "";
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
        latexEnd = matchE[0];
        // pE = matchE.index
    }
    state.line = nextLine + 1;
    token = state.push('paragraph_open', 'div', 1);
    token.attrSet('class', 'theorem_block');
    token.map = [startLine, state.line];
    if (strBefore && (strBefore === null || strBefore === void 0 ? void 0 : strBefore.trim())) {
        token = state.push('inline', '', 0);
        token.children = [];
        token.content = strBefore;
    }
    var envIndex = envName
        ? (0, helper_2.getTheoremEnvironmentIndex)(envName)
        : -1;
    if (envIndex === -1) {
        return false;
    }
    var theoremNumber = (0, helper_2.getTheoremNumber)(envIndex, state.env);
    token = state.push('theorem_open', 'div', 1);
    token.environment = envName;
    token.envDescription = envDescription;
    token.envNumber = theoremNumber;
    token.uuid = (0, utils_1.uid)();
    token.currentTag = {
        type: labels_1.eLabelType.theorem,
        number: theoremNumber,
        tokenUuidInParentBlock: token.uuid
    };
    token.map = [startLine, state.line];
    token.bMarks = strBefore ? strBefore.length : 0;
    var envItem = helper_2.theoremEnvironments[envIndex];
    token.envStyle = envItem.style;
    if (state.md.options.forLatex) {
        token.latex = latexBegin;
    }
    if (!state.md.options.forLatex) {
        token = state.push("theorem_print_open", "", 0);
        token.envStyle = envItem.style;
        token.latex = envItem.print;
        token.content = "";
        token.children = [];
        if (namePositions) {
            token.map = [namePositions.startLine, namePositions.endLine];
            token.bMarks = namePositions.bMarks;
            token.eMarks = namePositions.eMarks;
        }
        token = state.push("inline", "", 0);
        token.content = envItem.print;
        token.children = [];
        if (state.md.options.forDocx) {
            token.meta = {
                isMathInText: true
            };
        }
        if (namePositions) {
            token.map = [namePositions.startLine, namePositions.endLine];
            token.bMarks = namePositions.bMarks;
            token.eMarks = namePositions.eMarks;
        }
        token = state.push("theorem_print_close", "", 0);
        token.envNumber = theoremNumber;
        token.envStyle = envItem.style;
        token.envDescription = envDescription;
        token.environment = envName;
        token.content = "";
        token.children = [];
        if (namePositions) {
            token.map = [namePositions.startLine, namePositions.endLine];
            token.bMarks = namePositions.bMarks;
            token.eMarks = namePositions.eMarks;
        }
        if (envDescription) {
            token = state.push("theorem_description_open", "", 0);
            token.envStyle = envItem.style;
            token.envDescription = envDescription;
            token.latex = envDescription;
            token.content = "";
            token.children = [];
            if (descriptiontPositions) {
                token.map = [descriptiontPositions.startLine, descriptiontPositions.endLine];
                token.bMarks = descriptiontPositions.bMarks;
                token.eMarks = descriptiontPositions.eMarks;
            }
            token = state.push("inline", "", 0);
            token.content = envDescription;
            token.children = [];
            if (state.md.options.forDocx) {
                token.meta = {
                    isMathInText: true
                };
            }
            if (descriptiontPositions) {
                token.map = [descriptiontPositions.startLine, descriptiontPositions.endLine];
                token.bMarks = descriptiontPositions.bMarks;
                token.eMarks = descriptiontPositions.eMarks;
            }
            token = state.push("theorem_description_close", "", 0);
            token.envStyle = envItem.style;
            token.envDescription = envDescription;
            token.content = "";
            token.children = [];
            if (descriptiontPositions) {
                token.map = [descriptiontPositions.startLine, descriptiontPositions.endLine];
                token.bMarks = descriptiontPositions.bMarks;
                token.eMarks = descriptiontPositions.eMarks;
            }
        }
    }
    (0, helper_1.SetTokensBlockParse)(state, resText, 0, 0, true, contentPositions);
    token = state.push('theorem_close', 'div', -1);
    token.envStyle = envItem.style;
    if (state.md.options.forLatex) {
        token.latex = latexEnd;
    }
    token = state.push('paragraph_close', 'div', -1);
    token.currentTag = state.env.lastTag ? state.env.lastTag : {};
    return true;
};
exports.BeginTheorem = BeginTheorem;
var BeginProof = function (state, startLine, endLine, silent) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var token;
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    var strBefore = "";
    var match = lineText.match(consts_1.openTagProof);
    if (!match) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    var envName = match[1] ? match[1].trim() : '';
    if (!envName) {
        return false;
    }
    /** Inline content before proof block */
    strBefore = match.index > 0 ? lineText.slice(0, match.index) : '';
    var closeTag = (0, utils_1.endTag)(envName);
    if (!closeTag) {
        return false;
    }
    // let content: string = '';
    var resText = '';
    var isCloseTagExist = false;
    if (closeTag.test(lineText)) {
        /**TODO: inline rule*/
        // if (InlineBlockBeginTable(state, startLine)) {
        //   return true;
        // }
    }
    var contentPositions = {
        startLine: startLine,
        endLine: startLine,
        bMarks: 0
    };
    if (match.index + match[0].length < lineText.trim().length) {
        resText = lineText.slice(match.index + match[0].length);
        contentPositions.startLine = startLine;
        contentPositions.bMarks = match.index + match[0].length;
    }
    else {
        contentPositions.startLine = nextLine;
        contentPositions.bMarks = 0;
    }
    var latexBegin = match[0];
    var latexEnd = "";
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
            resText += state.isEmpty(nextLine) ? '\n' : lineText;
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
        latexEnd = matchE[0];
        // pE = matchE.index
    }
    state.line = nextLine + 1;
    token = state.push('paragraph_open', 'div', 1);
    token.attrSet('class', 'proof_block');
    token.map = [startLine, state.line];
    if (strBefore && (strBefore === null || strBefore === void 0 ? void 0 : strBefore.trim())) {
        token = state.push('inline', '', 0);
        token.children = [];
        token.content = strBefore;
    }
    var proofNumber = (0, helper_2.getNextCounterProof)();
    token = state.push('proof_open', 'div', 1);
    token.envNumber = proofNumber;
    token.uuid = (0, utils_1.uid)();
    token.currentTag = {
        type: labels_1.eLabelType.theorem,
        number: proofNumber,
        tokenUuidInParentBlock: token.uuid
    };
    token.map = [startLine, state.line];
    token.bMarks = strBefore ? strBefore.length : 0;
    if (state.md.options.forLatex) {
        token.latex = latexBegin;
    }
    var contentQED = state.env.qedsymbol ? state.env.qedsymbol : consts_1.defQED;
    var children = [];
    state.md.block.parse(resText, state.md, state.env, children);
    for (var j = 0; j < children.length; j++) {
        var child = children[j];
        if ((j === children.length - 1) && !state.md.options.forLatex) {
            token = state.push("qedsymbol_open", "", 0);
            token.content = "";
            token.children = [];
            token = state.push("inline", "", 0);
            token.content = contentQED;
            token.children = [];
            token = state.push("qedsymbol_close", "", 0);
            token.content = "";
            token.children = [];
        }
        token = state.push(child.type, child.tag, child.nesting);
        token.attrs = child.attrs;
        if (j === 0 && token.type === "paragraph_open") {
            if (token.attrs) {
                var style = token.attrGet('style');
                if (style) {
                    token.attrSet('style', "display: inline; " + style);
                }
                else {
                    token.attrs.push(['style', "display: inline"]);
                }
            }
            else {
                token.attrSet('style', "display: inline");
            }
            token.attrSet('data-display', 'inline');
        }
        if ((contentPositions === null || contentPositions === void 0 ? void 0 : contentPositions.hasOwnProperty('startLine')) && child.map) {
            token.map = [contentPositions.startLine + child.map[0], contentPositions.startLine + child.map[1]];
            if (j === 1 && child.type === "inline") {
                token.bMarks = contentPositions.bMarks;
            }
        }
        token.content = child.content;
        token.children = child.children;
    }
    token = state.push('proof_close', 'div', -1);
    if (state.md.options.forLatex) {
        token.latex = latexEnd;
    }
    token = state.push('paragraph_close', 'div', -1);
    token.currentTag = state.env.lastTag ? state.env.lastTag : {};
    return true;
};
exports.BeginProof = BeginProof;
//# sourceMappingURL=block-rule.js.map
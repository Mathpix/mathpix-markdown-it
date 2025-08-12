"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mathMLBlock = exports.collectTerminatorRules = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("../common/consts");
var validate_mathML_1 = require("../common/validate-mathML");
var ALT_GROUP_FOR_MATHML = 'mathMLBlock';
var baseTerminatorsCache = new WeakMap();
/** Builds a basic list of terminator rules for a MathML block: paragraph + alt=ALT_GROUP_FOR_MATHML */
function collectBaseTerminators(md, altGroup) {
    var e_1, _a;
    var _b, _c;
    if (altGroup === void 0) { altGroup = ALT_GROUP_FOR_MATHML; }
    // 1) Standard "paragraph" terminators
    var paragraphRules = (_b = md.block.ruler.getRules('paragraph')) !== null && _b !== void 0 ? _b : [];
    // 2) Alternative rules from private __rules__ (soft checks)
    var raw = (_c = md.block.ruler.__rules__) !== null && _c !== void 0 ? _c : [];
    var altGroupRules = raw
        .filter(function (r) { return (r === null || r === void 0 ? void 0 : r.enabled) && Array.isArray(r.alt) && r.alt.includes(altGroup); })
        .map(function (r) { return r.fn; });
    // 3) Glue and remove duplicates, maintaining order
    var seen = new Set();
    var merged = [];
    try {
        for (var _d = tslib_1.__values(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(paragraphRules), false), tslib_1.__read(altGroupRules), false)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var fn = _e.value;
            if (!seen.has(fn)) {
                seen.add(fn);
                merged.push(fn);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return merged;
}
/**
 * Returns terminator rules for the MathML block excluding the current rule (selfRule).
 * The base list is cached at the MarkdownIt instance level.
 */
function collectTerminatorRules(md, selfRule, altGroup) {
    if (altGroup === void 0) { altGroup = ALT_GROUP_FOR_MATHML; }
    // Take from cache or collect the database
    var base = baseTerminatorsCache.get(md);
    if (!base) {
        base = collectBaseTerminators(md, altGroup);
        baseTerminatorsCache.set(md, base);
    }
    // Exclude selfRule on each call (it may differ)
    return base.filter(function (fn) { return fn !== selfRule; });
}
exports.collectTerminatorRules = collectTerminatorRules;
var mathMLBlock = function (state, startLine, endLine, silent) {
    try {
        var pos = state.bMarks[startLine] + state.tShift[startLine];
        var max = state.eMarks[startLine];
        // Early exit if the first character is not '<'
        if (state.src.charCodeAt(pos) !== 0x3C /* < */)
            return false;
        // Extract current line text and check for the opening tag
        var lineText = state.src.slice(pos, max);
        if (!consts_1.openTagMML.test(lineText))
            return false;
        if (consts_1.mathMLInlineRegex.test(lineText))
            return false;
        var nextLine_1 = startLine + 1;
        var hasCloseTag = false;
        if (consts_1.closeTagMML.test(lineText)) {
            hasCloseTag = true;
            nextLine_1 = startLine + 1; // the entire content is on the first line
        }
        else {
            var terminatorRules = collectTerminatorRules(state.md, exports.mathMLBlock);
            // Iterate through lines until the closing tag or end of file
            while (nextLine_1 < endLine) {
                pos = state.bMarks[nextLine_1] + state.tShift[nextLine_1];
                max = state.eMarks[nextLine_1];
                // Check for terminator rules
                if (terminatorRules.some(function (rule) { return rule(state, nextLine_1, endLine, true); }))
                    break;
                lineText = state.src.slice(pos, max);
                // Check for closing tag
                if (consts_1.closeTagMML.test(lineText)) {
                    nextLine_1++;
                    hasCloseTag = true;
                    break;
                }
                nextLine_1++;
            }
        }
        // If there is no closing tag, return false
        if (!hasCloseTag)
            return false;
        // Get the content between the matched lines
        var content = state.getLines(startLine, nextLine_1, state.blkIndent, false);
        var validationMathML = (0, validate_mathML_1.validateMathMLShallow)(content);
        if (!validationMathML.ok) {
            return false;
        }
        // If in validation mode, return true
        if (silent)
            return true;
        // Update the state line
        state.line = nextLine_1;
        // Create the tokens for the MathML block
        var token = state.push('paragraph_open', 'div', 1);
        token.map = [startLine, nextLine_1];
        token = state.push('inline', '', 0);
        token.content = content;
        token.map = [startLine, nextLine_1];
        token.children = [];
        token = state.push('paragraph_close', 'div', -1);
        return true;
    }
    catch (err) {
        console.error("[ERROR]=>[mathMLBlock]=>", err);
        return false;
    }
};
exports.mathMLBlock = mathMLBlock;
//# sourceMappingURL=mathml-block.js.map
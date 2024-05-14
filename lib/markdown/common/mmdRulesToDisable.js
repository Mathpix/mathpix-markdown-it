"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListToDisableByOptions = exports.applyFootnoteRulesToDisableRules = exports.applyRefRulesToDisableRules = exports.applyRulesToDisableRules = exports.getListRulesToDisable = void 0;
var mmdRules_1 = require("./mmdRules");
var consts_1 = require("./consts");
var findRule = function (md, rule) {
    var mdBlock = md.block;
    var mdInline = md.inline;
    var mdCore = md.core;
    var blockRuler = mdBlock.ruler;
    var inlineRuler = mdInline.ruler;
    var inlineRuler2 = mdInline.ruler2;
    var coreRuler = mdCore.ruler;
    switch (rule.rule) {
        case mmdRules_1.eRule.block:
            return blockRuler.__find__(rule.name) >= 0;
        case mmdRules_1.eRule.inline:
            return inlineRuler.__find__(rule.name) >= 0;
        case mmdRules_1.eRule.inline2:
            return inlineRuler2.__find__(rule.name) >= 0;
        case mmdRules_1.eRule.core:
            return coreRuler.__find__(rule.name) >= 0;
        default:
            return false;
    }
};
var getDisableRuleTypes = function (renderOptions) {
    var _a = renderOptions.disableRulesGroup, disableRulesGroup = _a === void 0 ? null : _a, _b = renderOptions.enable_markdown, enable_markdown = _b === void 0 ? true : _b, _c = renderOptions.enable_latex, enable_latex = _c === void 0 ? true : _c, _d = renderOptions.enable_markdown_mmd_extensions, enable_markdown_mmd_extensions = _d === void 0 ? true : _d;
    var disableRuleTypes = [];
    if (!enable_markdown) {
        disableRuleTypes = [
            mmdRules_1.eMmdRuleType.markdown,
            mmdRules_1.eMmdRuleType.chem,
            mmdRules_1.eMmdRuleType.html,
            mmdRules_1.eMmdRuleType.asciiMath,
            mmdRules_1.eMmdRuleType.mathML
        ];
    }
    else {
        if (!enable_markdown_mmd_extensions) {
            disableRuleTypes = [
                mmdRules_1.eMmdRuleType.chem,
                mmdRules_1.eMmdRuleType.asciiMath,
                mmdRules_1.eMmdRuleType.mathML
            ];
        }
    }
    if (!enable_latex) {
        disableRuleTypes.push(mmdRules_1.eMmdRuleType.latex);
        disableRuleTypes.push(mmdRules_1.eMmdRuleType.math);
    }
    if (disableRulesGroup) {
        if (disableRulesGroup.markdown && disableRuleTypes.indexOf(mmdRules_1.eMmdRuleType.markdown) === -1) {
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.markdown);
        }
        if (disableRulesGroup.latex && disableRuleTypes.indexOf(mmdRules_1.eMmdRuleType.latex) === -1) {
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.latex);
        }
        if (disableRulesGroup.chem && disableRuleTypes.indexOf(mmdRules_1.eMmdRuleType.chem) === -1) {
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.chem);
        }
        if (disableRulesGroup.html && disableRuleTypes.indexOf(mmdRules_1.eMmdRuleType.html) === -1) {
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.html);
        }
        if (disableRulesGroup.asciiMath && disableRuleTypes.indexOf(mmdRules_1.eMmdRuleType.asciiMath) === -1) {
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.asciiMath);
        }
        if (disableRulesGroup.math && disableRuleTypes.indexOf(mmdRules_1.eMmdRuleType.math) === -1) {
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.math);
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.simpleMath);
        }
        if (disableRulesGroup.simpleMath && disableRuleTypes.indexOf(mmdRules_1.eMmdRuleType.simpleMath) === -1) {
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.simpleMath);
        }
        if (disableRulesGroup.mathML && disableRuleTypes.indexOf(mmdRules_1.eMmdRuleType.mathML) === -1) {
            disableRuleTypes.push(mmdRules_1.eMmdRuleType.mathML);
        }
    }
    return disableRuleTypes;
};
var getListRulesToDisable = function (md, renderOptions) {
    var rules = [];
    var disableRuleTypes = getDisableRuleTypes(renderOptions);
    if (!(disableRuleTypes === null || disableRuleTypes === void 0 ? void 0 : disableRuleTypes.length)) {
        return rules;
    }
    for (var i = 0; i < mmdRules_1.mmdRuleList.length; i++) {
        var rule = mmdRules_1.mmdRuleList[i];
        if (!findRule(md, rule)) {
            continue;
        }
        if (disableRuleTypes.includes(rule.type)) {
            rules.push(rule.name);
        }
    }
    return rules;
};
exports.getListRulesToDisable = getListRulesToDisable;
var getMmdRuleByName = function (name) {
    return mmdRules_1.mmdRuleList === null || mmdRules_1.mmdRuleList === void 0 ? void 0 : mmdRules_1.mmdRuleList.find(function (item) { return item.name === name; });
};
var applyRulesToDisableRules = function (md, rules, disableRules) {
    for (var i = 0; i < rules.length; i++) {
        var rule = getMmdRuleByName(rules[i]);
        if (rule && findRule(md, rule)) {
            if (disableRules.indexOf(rule.name) === -1) {
                disableRules.push(rule.name);
            }
        }
    }
    return disableRules;
};
exports.applyRulesToDisableRules = applyRulesToDisableRules;
var applyRefRulesToDisableRules = function (md, disableRules) {
    var refRules = ['refs', 'refsInline'];
    return (0, exports.applyRulesToDisableRules)(md, refRules, disableRules);
};
exports.applyRefRulesToDisableRules = applyRefRulesToDisableRules;
var applyFootnoteRulesToDisableRules = function (md, disableRules) {
    var footnoteRules = [
        'mmd_footnote_tail',
        'latex_footnote_block',
        'latex_footnotetext_block',
        'latex_footnote',
        'latex_footnotemark',
        'latex_footnotetext',
        'grab_footnote_ref',
        'footnote_tail',
        'footnote_def',
        'footnote_inline',
        'footnote_ref'
    ];
    return (0, exports.applyRulesToDisableRules)(md, footnoteRules, disableRules);
};
exports.applyFootnoteRulesToDisableRules = applyFootnoteRulesToDisableRules;
var getListToDisableByOptions = function (md, options) {
    var _a = options.renderOptions, renderOptions = _a === void 0 ? null : _a, _b = options.isDisableRefs, isDisableRefs = _b === void 0 ? false : _b, _c = options.isDisableFootnotes, isDisableFootnotes = _c === void 0 ? false : _c;
    renderOptions = Object.assign({}, consts_1.renderOptionsDef, renderOptions);
    var disableRules = [];
    if (renderOptions) {
        disableRules = (0, exports.getListRulesToDisable)(md, renderOptions);
    }
    if (isDisableRefs) {
        disableRules = (0, exports.applyRefRulesToDisableRules)(md, disableRules);
    }
    if (isDisableFootnotes) {
        disableRules = (0, exports.applyFootnoteRulesToDisableRules)(md, disableRules);
    }
    return disableRules;
};
exports.getListToDisableByOptions = getListToDisableByOptions;
//# sourceMappingURL=mmdRulesToDisable.js.map
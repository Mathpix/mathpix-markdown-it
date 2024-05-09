"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListCoreRulesToDisable = exports.getListInlineRules2ToDisable = exports.getListInlineRulesToDisable = exports.getListBlockRulesToDisable = void 0;
var tslib_1 = require("tslib");
var mmdRulesList_1 = require("./common/mmdRulesList");
var getListBlockRulesToDisable = function (md, renderOptions) {
    var rules = [];
    var mdBlock = md.block;
    var blockRuler = mdBlock.ruler;
    for (var i = 0; i < mmdRulesList_1.mmdBlockRulesList.length; i++) {
        var rule = mmdRulesList_1.mmdBlockRulesList[i];
        if (blockRuler.__find__(rule.name) === -1) {
            continue;
        }
        if (rule.type === mmdRulesList_1.eMmdRuleType.common) {
            continue;
        }
        if (rule.type === mmdRulesList_1.eMmdRuleType.markdown && (renderOptions === null || renderOptions === void 0 ? void 0 : renderOptions.disableMarkdown)) {
            rules.push(rule.name);
        }
    }
    return rules;
};
exports.getListBlockRulesToDisable = getListBlockRulesToDisable;
var getListInlineRulesToDisable = function (md, renderOptions) {
    var rules = [];
    var mdInline = md.inline;
    var inlineRuler = mdInline.ruler;
    for (var i = 0; i < mmdRulesList_1.mmdInlineRuleList.length; i++) {
        var rule = mmdRulesList_1.mmdInlineRuleList[i];
        if (inlineRuler.__find__(rule.name) === -1) {
            continue;
        }
        if (rule.type === mmdRulesList_1.eMmdRuleType.common) {
            continue;
        }
        if (rule.type === mmdRulesList_1.eMmdRuleType.markdown && (renderOptions === null || renderOptions === void 0 ? void 0 : renderOptions.disableMarkdown)) {
            rules.push(rule.name);
        }
    }
    return rules;
};
exports.getListInlineRulesToDisable = getListInlineRulesToDisable;
var getListInlineRules2ToDisable = function (md, renderOptions) {
    var rules = [];
    var mdInline = md.inline;
    var inlineRuler2 = mdInline.ruler2;
    for (var i = 0; i < mmdRulesList_1.mmdInlineRule2List.length; i++) {
        var rule = mmdRulesList_1.mmdInlineRule2List[i];
        if (inlineRuler2.__find__(rule.name) === -1) {
            continue;
        }
        if (rule.type === mmdRulesList_1.eMmdRuleType.common) {
            continue;
        }
        if (rule.type === mmdRulesList_1.eMmdRuleType.markdown && (renderOptions === null || renderOptions === void 0 ? void 0 : renderOptions.disableMarkdown)) {
            rules.push(rule.name);
        }
    }
    return rules;
};
exports.getListInlineRules2ToDisable = getListInlineRules2ToDisable;
var getListCoreRulesToDisable = function (md, renderOptions) {
    var rules = [];
    var mdCore = md.core;
    var coreRuler = mdCore.ruler;
    for (var i = 0; i < mmdRulesList_1.mmdCoreRuleList.length; i++) {
        var rule = mmdRulesList_1.mmdCoreRuleList[i];
        if (coreRuler.__find__(rule.name) === -1) {
            continue;
        }
        if (rule.type === mmdRulesList_1.eMmdRuleType.common) {
            continue;
        }
        if (rule.type === mmdRulesList_1.eMmdRuleType.markdown && (renderOptions === null || renderOptions === void 0 ? void 0 : renderOptions.disableMarkdown)) {
            rules.push(rule.name);
        }
    }
    return rules;
};
exports.getListCoreRulesToDisable = getListCoreRulesToDisable;
exports.default = (function (md, renderOptions) {
    var blockRules = (0, exports.getListBlockRulesToDisable)(md, renderOptions);
    var inlineRules = (0, exports.getListInlineRulesToDisable)(md, renderOptions);
    var inlineRules2 = (0, exports.getListInlineRules2ToDisable)(md, renderOptions);
    var coreRules = (0, exports.getListCoreRulesToDisable)(md, renderOptions);
    var disableRules = [];
    if (blockRules === null || blockRules === void 0 ? void 0 : blockRules.length) {
        disableRules = disableRules.concat(tslib_1.__spreadArray([], tslib_1.__read(blockRules), false));
    }
    if (inlineRules === null || inlineRules === void 0 ? void 0 : inlineRules.length) {
        disableRules = disableRules.concat(tslib_1.__spreadArray([], tslib_1.__read(inlineRules), false));
    }
    if (inlineRules2 === null || inlineRules2 === void 0 ? void 0 : inlineRules2.length) {
        disableRules = disableRules.concat(tslib_1.__spreadArray([], tslib_1.__read(inlineRules2), false));
    }
    if (coreRules === null || coreRules === void 0 ? void 0 : coreRules.length) {
        disableRules = disableRules.concat(tslib_1.__spreadArray([], tslib_1.__read(coreRules), false));
    }
    if (disableRules === null || disableRules === void 0 ? void 0 : disableRules.length) {
        md.disable(disableRules);
    }
});
//# sourceMappingURL=mdDisableRulesForRendering.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMmdGlobalState = void 0;
var mdPluginText_1 = require("../mdPluginText");
var helper_1 = require("../md-theorem/helper");
var utils_1 = require("../md-latex-footnotes/utils");
var mdPluginTOC_1 = require("../mdPluginTOC");
var parse_error_1 = require("../md-block-rule/parse-error");
var labels_1 = require("./labels");
var re_level_1 = require("../md-latex-lists-env/re-level");
var list_state_1 = require("../md-latex-lists-env/list-state");
var counters_1 = require("./counters");
var mathjax_1 = require("../../mathjax");
/** Reset per-parse module-level state. Auto-invoked at parse start via the
 *  reset_mmd_global_state core-ruler hook; export exists for one-shot
 *  converters to release state after render. */
var resetMmdGlobalState = function () {
    (0, mdPluginTOC_1.clearSlugsTocItems)();
    (0, parse_error_1.ClearParseErrorList)();
    (0, helper_1.resetTheoremEnvironments)();
    (0, labels_1.clearLabelsList)();
    (0, utils_1.rest_mmd_footnotes_list)();
    (0, re_level_1.clearItemizeLevelTokens)();
    (0, list_state_1.resetListState)();
    (0, mdPluginText_1.resetTextCounter)();
    (0, counters_1.resetSizeCounter)();
    mathjax_1.MathJax.Reset();
};
exports.resetMmdGlobalState = resetMmdGlobalState;
//# sourceMappingURL=reset-mmd-state.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTheorems = exports.mappingTheorems = void 0;
var helper_1 = require("./helper");
var labels_1 = require("../common/labels");
var common_1 = require("../highlight/common");
var renderTheoremOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var envNumber = token.envNumber;
    var envStyle = token.envStyle;
    /**
     * definition - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
     * plain - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
     * remark - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
     * */
    var styleBody = "";
    switch (envStyle) {
        case "definition":
            styleBody = "font-style: normal;";
            break;
        case "plain":
            styleBody = "font-style: italic;";
            break;
        case "remark":
            styleBody = "font-style: normal;";
            break;
    }
    styleBody += " padding: 10px 0;";
    var label = token.uuid ? (0, labels_1.getLabelByUuidFromLabelsList)(token.uuid) : null;
    var labelRef = label ? label.id : '';
    return labelRef
        ? "<div id=\"".concat(labelRef, "\" class=\"theorem\" number=\"").concat(envNumber, "\" style=\"").concat(styleBody, "\">")
        : "<div class=\"theorem\" style=\"".concat(styleBody, "\">");
};
var renderTheoremPrintOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var envStyle = token.envStyle;
    var styleTile = "";
    /**
     * definition - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
     * plain - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
     * remark - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
     * */
    switch (envStyle) {
        case "definition":
            styleTile = "font-weight: bold; font-style: normal;";
            break;
        case "plain":
            styleTile = "font-weight: bold; font-style: normal;";
            break;
        case "remark":
            styleTile = "font-style: italic;";
            break;
    }
    if (options.forDocx) {
        styleTile += 'display: inline;';
        return "<div style=\"".concat(styleTile, "\" class=\"theorem-title\">");
    }
    return "<span style=\"".concat(styleTile, "\" class=\"theorem-title\">");
};
var renderTheoremPrintClose = function (tokens, idx, options, env, slf) {
    var _a;
    var token = tokens[idx];
    var envName = token.environment;
    var envDescription = token.envDescription;
    var envNumber = token.envNumber;
    var envStyle = token.envStyle;
    var envIndex = envName
        ? (0, helper_1.getTheoremEnvironmentIndex)(envName)
        : -1;
    if (envIndex !== -1) {
        var envItem = helper_1.theoremEnvironments[envIndex];
        var htmlPrint = envItem.isNumbered
            ? ' ' + envNumber
            : '';
        htmlPrint += envStyle === "plain" ? '.' : envDescription ? '' : '.';
        if (((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length) && token.highlightAll) {
            var dataAttrsStyle = (0, common_1.getStyleFromHighlight)(token.highlights[0]);
            htmlPrint = "<span style=\"".concat(dataAttrsStyle, "\">") + htmlPrint + '</span>';
        }
        htmlPrint += options.forDocx ? "</div>" : "</span>";
        var htmlSpaceMin = options.forDocx
            ? '<span>&nbsp;</span>'
            : '<span style="margin-right: 10px"></span>';
        var htmlSpace = options.forDocx
            ? '<span>&nbsp;&nbsp;</span>'
            : '<span style="margin-right: 16px"></span>';
        htmlPrint += envDescription ? htmlSpaceMin : htmlSpace;
        return htmlPrint;
    }
    return options.forDocx ? "</div>" : "</span>";
};
var renderTheoremDescriptionOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var envStyle = token.envStyle;
    var styleDescription = "";
    /**
     * definition - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
     * plain - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
     * remark - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
     * */
    switch (envStyle) {
        case "definition":
            styleDescription = "font-style: normal;";
            break;
        case "plain":
            styleDescription = "font-weight: bold; font-style: normal;";
            break;
        case "remark":
            styleDescription = "font-style: normal;";
            break;
    }
    return "<span style=\"".concat(styleDescription, "\">(");
};
var renderTheoremDescriptionClose = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var envStyle = token.envStyle;
    var envDescription = token.envDescription;
    var point = envDescription && envStyle === "plain" ? '' : '.';
    var htmlSpace = options.forDocx
        ? '<span>&nbsp;&nbsp;</span>'
        : '<span style="margin-right: 16px"></span>';
    return ')' + point + '</span>' + htmlSpace;
};
var renderProofOpen = function (tokens, idx, options, env, slf) {
    var _a;
    var token = tokens[idx];
    var label = token.uuid ? (0, labels_1.getLabelByUuidFromLabelsList)(token.uuid) : null;
    var labelRef = label ? label.id : '';
    var styleTile = "font-style: italic;";
    var styleBody = "font-style: normal; padding: 10px 0;";
    var dataAttrsStyle = ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length) && token.highlightAll
        ? (0, common_1.getStyleFromHighlight)(token.highlights[0])
        : '';
    var htmlTitle = "<span style=\"".concat(styleTile).concat(dataAttrsStyle, "\">Proof.</span>");
    var htmlSpaceMin = options.forDocx
        ? '<span>&nbsp;</span>'
        : '<span style="margin-right: 10px"></span>';
    htmlTitle += htmlSpaceMin;
    return labelRef
        ? "<div id=\"".concat(labelRef, "\" class=\"proof\" style=\"").concat(styleBody, "\">") + htmlTitle
        : "<div class=\"proof\" style=\"".concat(styleBody, "\">") + htmlTitle;
};
exports.mappingTheorems = {
    newtheorem: "newtheorem",
    theoremstyle: "theoremstyle",
    theorem_open: "theorem_open",
    theorem_close: "theorem_close",
    proof_open: "proof_open",
    proof_close: "proof_close",
    qedsymbol: "qedsymbol",
    qedsymbol_open: "qedsymbol_open",
    qedsymbol_close: "qedsymbol_close",
    renewcommand_qedsymbol: "renewcommand_qedsymbol",
    theorem_description_open: "theorem_description_open",
    theorem_description_close: "theorem_description_close",
    theorem_print_open: "theorem_print_open",
    theorem_print_close: "theorem_print_close",
    theorem_setcounter: "theorem_setcounter",
};
var renderTheorems = function (md) {
    Object.keys(exports.mappingTheorems).forEach(function (key) {
        md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
            if (env === void 0) { env = {}; }
            switch (tokens[idx].type) {
                case "newtheorem":
                case "theoremstyle":
                case "renewcommand_qedsymbol":
                case "theorem_setcounter":
                    return '';
                case "theorem_open":
                    return renderTheoremOpen(tokens, idx, options, env, slf);
                case "proof_open":
                    return renderProofOpen(tokens, idx, options, env, slf);
                case "theorem_close":
                case "proof_close":
                    return "</div>";
                case "qedsymbol_open":
                    return "<span style=\"float: right\">";
                case "qedsymbol_close":
                    return "</span>";
                case "theorem_print_open":
                    return renderTheoremPrintOpen(tokens, idx, options, env, slf);
                case "theorem_print_close":
                    return renderTheoremPrintClose(tokens, idx, options, env, slf);
                case "theorem_description_open":
                    return renderTheoremDescriptionOpen(tokens, idx, options, env, slf);
                case "theorem_description_close":
                    return renderTheoremDescriptionClose(tokens, idx, options, env, slf);
                default:
                    return '';
            }
        };
    });
};
exports.renderTheorems = renderTheorems;
//# sourceMappingURL=index.js.map
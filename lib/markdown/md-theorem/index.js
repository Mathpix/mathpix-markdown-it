"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTheorems = exports.mappingTheorems = void 0;
var helper_1 = require("./helper");
var renderTheoremOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var envLabel = token.envLabel;
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
    var labelRef = envLabel ? encodeURIComponent(envLabel) : '';
    return labelRef
        ? "<div id=\"" + labelRef + "\" class=\"theorem\" style=\"" + styleBody + "\">"
        : "<div class=\"theorem\" style=\"" + styleBody + "\">";
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
    return "<span style=\"" + styleTile + "\" class=\"theorem-title\">";
};
var renderTheoremPrintClose = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var envName = token.environment;
    var envDescription = token.envDescription;
    var envNumber = token.envNumber;
    var envStyle = token.envStyle;
    var envIndex = envName
        ? helper_1.getTheoremEnvironmentIndex(envName)
        : -1;
    if (envIndex !== -1) {
        var envItem = helper_1.theoremEnvironments[envIndex];
        var htmlPrint = envItem.isNumbered
            ? ' ' + envNumber
            : '';
        htmlPrint += envStyle === "plain" ? '.' : envDescription ? '' : '.';
        htmlPrint += "</span>";
        var htmlSpaceMin = options.forDocx
            ? '<span>&nbsp;</span>'
            : '<span style="margin-right: 10px"></span>';
        var htmlSpace = options.forDocx
            ? '<span>&nbsp;&nbsp;</span>'
            : '<span style="margin-right: 16px"></span>';
        htmlPrint += envDescription ? htmlSpaceMin : htmlSpace;
        return htmlPrint;
    }
    return "</span>";
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
    return "<span style=\"" + styleDescription + "\">(";
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
    var token = tokens[idx];
    var envLabel = token.envLabel;
    var labelRef = envLabel ? encodeURIComponent(envLabel) : '';
    var styleTile = "font-style: italic;";
    var styleBody = "font-style: normal; padding: 10px 0;";
    var htmlTitle = "<span style=\"" + styleTile + "\">Proof.</span>";
    var htmlSpaceMin = options.forDocx
        ? '<span>&nbsp;</span>'
        : '<span style="margin-right: 10px"></span>';
    htmlTitle += htmlSpaceMin;
    return labelRef
        ? "<div id=\"" + labelRef + "\" class=\"proof\" style=\"" + styleBody + "\">" + htmlTitle
        : "<div class=\"proof\" style=\"" + styleBody + "\">" + htmlTitle;
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
exports.renderTheorems = function (md) {
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
//# sourceMappingURL=index.js.map
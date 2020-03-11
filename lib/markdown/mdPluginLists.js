"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lists_1 = require("./md-block-rule/lists");
var rules_1 = require("./rules");
var mapping = {
    itemize_list_open: "itemize_list_open",
    enumerate_list_open: "enumerate_list_open",
    itemize_list_close: "itemize_list_close",
    enumerate_list_close: "enumerate_list_close",
    list_item_open: "list_item_open",
    item_inline: "item_inline"
};
var level_itemize = 0;
var level_enumerate = 0;
var itemizeLevel = ['•', '–', '*', '·'];
var enumerateLevel = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha'];
var list_injectLineNumbers = function (tokens, idx, className) {
    if (className === void 0) { className = ''; }
    var line, endLine, listLine;
    if (tokens[idx].map) {
        line = tokens[idx].map[0];
        endLine = tokens[idx].map[1];
        listLine = [];
        for (var i = line; i < endLine; i++) {
            listLine.push(i);
        }
        tokens[idx].attrJoin("class", className + ' ' + rules_1.PREVIEW_PARAGRAPH_PREFIX + String(line)
            + ' ' + rules_1.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
        tokens[idx].attrJoin("data_line_start", "" + String(line));
        tokens[idx].attrJoin("data_line_end", "" + String(endLine));
        tokens[idx].attrJoin("data_line", "" + String([line, endLine]));
        tokens[idx].attrJoin("count_line", "" + String(endLine - line + 1));
    }
};
var render_itemize_list_open = function (tokens, index, renderer) {
    if (tokens[index].level === 0) {
        level_itemize = 0;
    }
    level_itemize++;
    list_injectLineNumbers(tokens, index, "itemize");
    return "<ul " + renderer.renderAttrs(tokens[index]) + " style=\"list-style-type: none\">";
};
var render_enumerate_list_open = function (tokens, index, renderer) {
    if (tokens[index].level === 0) {
        level_enumerate = 0;
    }
    level_enumerate++;
    var str = enumerateLevel.length >= level_enumerate ? enumerateLevel[level_enumerate - 1] : 'decimal';
    list_injectLineNumbers(tokens, index, "enumerate " + str);
    return "<ol " + renderer.renderAttrs(tokens[index]) + " style=\" list-style-type: " + str + "\" >";
};
var render_list_item_open = function (tokens, index, renderer) {
    if (tokens[index].parentType === "itemize") {
        var str = level_itemize > 0 && itemizeLevel.length >= level_itemize ? itemizeLevel[level_itemize - 1] : '.';
        list_injectLineNumbers(tokens, index, "li_itemize");
        return "<li " + renderer.renderAttrs(tokens[index]) + "  ><span>" + str + "</span>";
    }
    else {
        list_injectLineNumbers(tokens, index, "li_enumerate");
        return "<li " + renderer.renderAttrs(tokens[index]) + "  >";
    }
};
var render_item_inline = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    var sContent = '';
    var content = '';
    for (var i = 0; i < token.children.length; i++) {
        var tok = token.children[i];
        if (tok.children) {
            content = slf.renderInline(tok.children, options);
        }
        else {
            content = slf.renderInline([tok], options);
        }
        sContent += content;
    }
    if (tokens[index].parentType !== "itemize" && tokens[index].parentType !== "enumerate") {
        return "<li>" + sContent + "</li>";
    }
    if (tokens[index].parentType === "enumerate") {
        list_injectLineNumbers(tokens, index, "li_enumerate");
        return "<li " + slf.renderAttrs(tokens[index]) + " >" + sContent + "</li>";
    }
    else {
        var str = level_itemize > 0 && itemizeLevel.length >= level_itemize ? itemizeLevel[level_itemize - 1] : '.';
        list_injectLineNumbers(tokens, index, "li_itemize");
        return "<li " + slf.renderAttrs(tokens[index]) + " ><span class=\"li_level\">" + str + "</span>" + sContent + "</li>";
    }
};
var render_itemize_list_close = function () {
    level_itemize--;
    return "</ul>";
};
var render_enumerate_list_close = function () {
    level_enumerate--;
    return "</ol>";
};
var textModeObj = {
    "textasciicircum": "\u02C6",
    "textless": "\u003C",
    "textasciitilde": "\u0303",
    "textordfeminine": "\u00AA",
    "textasteriskcentered": "\u2217",
    "textordmasculine": "\u00B0",
    "textbackslash": "\u005C",
    "textparagraph": "\u00B6",
    "textbar": "\u007C",
    "textperiodcentered": "\u00B7",
    "textbraceleft": "\u007B",
    "textquestiondown": "\u00BF",
    "textbraceright": "\u007D",
    "textquotedblleft": "\u201C",
    "textbullet": "\u2022",
    "textquotedblright": "\u201D",
    "textcopyright": "\u00A9",
    "textquoteleft": "\u2018",
    "textdagger": "\u2020",
    "textquoteright": "\u2019",
    "textdaggerdbl": "\u2021",
    "textregistered": "\u00AE",
    "textdollar": "\u0024",
    "textsection": "\u00A7",
    "textellipsis": "\u00B7\u00B7\u00B7",
    "ldots": "\u00B7\u00B7\u00B7",
    "textsterling": "\u00A3",
    "textemdash": "\u2014",
    "texttrademark": "TM",
    "textendash": "\u2013",
    "textunderscore": "\u002D",
    "textexclamdown": "\u00A1",
    "textvisiblespace": "\u02FD",
    "textgreater": "\u003E",
};
var textMode = function (state, silent) {
    var token;
    var match;
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    var textModeRegexp = new RegExp(Object.keys(textModeObj).join('|'));
    match = state.src
        .slice(++startMathPos)
        .match(textModeRegexp);
    if (!match) {
        return false;
    }
    token = state.push('text', '', 0);
    token.content = textModeObj[match[0]];
    state.pos = startMathPos + match.index + match[0].length;
    return true;
};
var listItemInline = function (state, silent) {
    var token;
    var match;
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    match = state.src
        .slice(++startMathPos)
        .match(/^(?:item)/);
    if (!match) {
        return false;
    }
    var endIndex = state.src.indexOf('\\item', startMathPos + match.index + match[0].length);
    var content = endIndex > 0
        ? state.src.slice(startMathPos + match.index + match[0].length, endIndex)
        : state.src.slice(startMathPos + match.index + match[0].length);
    token = state.push('item_inline', 'li', 0);
    token.parentType = state.parentType;
    var children = [];
    state.md.inline.parse(content.trim(), state.md, state.env, children);
    token.children = children;
    state.pos = startMathPos + match.index + match[0].length + content.length;
    return true;
};
exports.default = (function (md, options) {
    Object.assign(md.options, options);
    md.block.ruler.after("list", "Lists", lists_1.Lists, options);
    md.inline.ruler.before('escape', 'list_item_inline', listItemInline);
    md.inline.ruler.after('list_item_inline', 'textMode', textMode);
    Object.keys(mapping).forEach(function (key) {
        md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
            switch (tokens[idx].type) {
                case "itemize_list_open":
                    return render_itemize_list_open(tokens, idx, slf);
                case "enumerate_list_open":
                    return render_enumerate_list_open(tokens, idx, slf);
                case "list_item_open":
                    return render_list_item_open(tokens, idx, slf);
                case "item_inline":
                    return render_item_inline(tokens, idx, options, env, slf);
                case "itemize_list_close":
                    return render_itemize_list_close();
                case "enumerate_list_close":
                    return render_enumerate_list_close();
                default:
                    return '';
            }
        };
    });
});
//# sourceMappingURL=mdPluginLists.js.map
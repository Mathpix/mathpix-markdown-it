"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render_footnotetext = exports.render_footnote_anchor = exports.render_footnote_close = exports.render_footnote_open = exports.render_footnote_list_close = exports.render_footnote_list_open = exports.render_footnote_block_close = exports.render_footnote_block_open = exports.render_footnote_ref = exports.render_footnote_caption = exports.render_footnote_anchor_name = void 0;
var utils_1 = require("./utils");
var render_footnote_anchor_name = function (tokens, idx, options, env /*, slf*/) {
    var n = tokens[idx].meta.hasOwnProperty('footnoteId') && tokens[idx].meta.footnoteId !== undefined
        ? Number(tokens[idx].meta.footnoteId + 1).toString()
        : Number(tokens[idx].meta.id + 1).toString();
    var prefix = '';
    if (typeof env.docId === 'string') {
        prefix = '-' + env.docId + '-';
    }
    return prefix + n;
};
exports.render_footnote_anchor_name = render_footnote_anchor_name;
var render_footnote_caption = function (tokens, idx, options, env, slf) {
    var id = tokens[idx].meta.hasOwnProperty('footnoteId') && tokens[idx].meta.footnoteId !== undefined
        ? tokens[idx].meta.footnoteId
        : tokens[idx].meta.id;
    var n = Number(id + 1).toString();
    var footnote = (0, utils_1.getFootnoteItem)(env, tokens[idx].meta);
    if (footnote) {
        if (footnote.numbered !== undefined) {
            n = Number(footnote.numbered).toString();
        }
        else {
            if (footnote.hasOwnProperty('counter_footnote') && footnote.counter_footnote !== undefined) {
                n = Number(footnote.counter_footnote).toString();
            }
        }
    }
    if (tokens[idx].meta.subId > 0) {
        n += ':' + tokens[idx].meta.subId;
    }
    return '[' + n + ']';
};
exports.render_footnote_caption = render_footnote_caption;
var render_footnote_ref = function (tokens, idx, options, env, slf) {
    try {
        var footnote = (0, utils_1.getFootnoteItem)(env, tokens[idx].meta);
        var notFootnoteText = tokens[idx].meta.type === "footnotemark"
            && !Boolean(footnote === null || footnote === void 0 ? void 0 : footnote.hasContent);
        var id = slf.rules.mmd_footnote_anchor_name(tokens, idx, options, env, slf);
        var caption = slf.rules.mmd_footnote_caption(tokens, idx, options, env, slf);
        var refid = id;
        if (tokens[idx].meta.subId > 0) {
            refid += ':' + tokens[idx].meta.subId;
        }
        return notFootnoteText
            ? '<sup class="footnote-ref">' + caption + '</sup>'
            : options.forDocx
                ? '<a href="#fn' + id + '" id="fnref' + refid + '"><sup class="footnote-ref">' + caption + '</sup></a>'
                : '<sup class="footnote-ref"><a href="#fn' + id + '" id="fnref' + refid + '">' + caption + '</a></sup>';
    }
    catch (e) {
        return tokens[idx].content;
    }
};
exports.render_footnote_ref = render_footnote_ref;
var render_footnote_block_open = function (tokens, idx, options) {
    return (options.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') +
        '<section class="footnotes" style="margin-bottom: 1em; font-size: 85%">\n';
};
exports.render_footnote_block_open = render_footnote_block_open;
var render_footnote_block_close = function () {
    return '</section>\n';
};
exports.render_footnote_block_close = render_footnote_block_close;
var render_footnote_list_open = function (tokens, idx, options) {
    var _a;
    if ((_a = tokens[idx].meta) === null || _a === void 0 ? void 0 : _a.nonumbers) {
        return '<ol class="footnotes-list" style="padding-left: 20px; margin-bottom: 0;">\n';
    }
    return '<ol class="footnotes-list" style="margin-bottom: 0;">\n';
};
exports.render_footnote_list_open = render_footnote_list_open;
var render_footnote_list_close = function () {
    return '</ol>\n';
};
exports.render_footnote_list_close = render_footnote_list_close;
var render_footnote_open = function (tokens, idx, options, env, slf) {
    var id = slf.rules.mmd_footnote_anchor_name(tokens, idx, options, env, slf);
    if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
    }
    if (tokens[idx].meta.nonumbers) {
        return '<li id="fn' + id + '" class="footnote-item" style="list-style-type: none;">';
    }
    if (tokens[idx].meta.numbered !== undefined) {
        return '<li id="fn' + id + '" class="footnote-item" value="' + tokens[idx].meta.numbered + '">';
    }
    return '<li id="fn' + id + '" class="footnote-item">';
};
exports.render_footnote_open = render_footnote_open;
var render_footnote_close = function () {
    return '</li>\n';
};
exports.render_footnote_close = render_footnote_close;
var render_footnote_anchor = function (tokens, idx, options, env, slf) {
    var footnote = (0, utils_1.getFootnoteItem)(env, tokens[idx].meta);
    var notFootnoteMarker = (tokens[idx].meta.type === "footnotetext"
        && Boolean((footnote === null || footnote === void 0 ? void 0 : footnote.footnoteId) === -1)) || tokens[idx].meta.type === "blfootnotetext";
    if (notFootnoteMarker) {
        return '';
    }
    var id = slf.rules.mmd_footnote_anchor_name(tokens, idx, options, env, slf);
    if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
    }
    /* ↩ with escape code to prevent display as Apple Emoji on iOS */
    return ' <a href="#fnref' + id + '" class="footnote-backref">\u21a9\uFE0E</a>';
};
exports.render_footnote_anchor = render_footnote_anchor;
var render_footnotetext = function () {
    return '';
};
exports.render_footnotetext = render_footnotetext;
//# sourceMappingURL=render-rule.js.map
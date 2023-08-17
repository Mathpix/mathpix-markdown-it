"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render_footnotetext = exports.render_footnote_anchor = exports.render_footnote_close = exports.render_footnote_open = exports.render_footnote_block_close = exports.render_footnote_block_open = exports.render_footnote_ref = exports.render_footnote_caption = exports.render_footnote_anchor_name = void 0;
var render_footnote_anchor_name = function (tokens, idx, options, env /*, slf*/) {
    var n = Number(tokens[idx].meta.id + 1).toString();
    var prefix = '';
    if (typeof env.docId === 'string') {
        prefix = '-' + env.docId + '-';
    }
    return prefix + n;
};
exports.render_footnote_anchor_name = render_footnote_anchor_name;
var render_footnote_caption = function (tokens, idx, options, env, slf) {
    var _a, _b, _c, _d;
    var n = Number(tokens[idx].meta.id + 1).toString();
    if (tokens[idx].meta.numbered !== undefined) {
        n = Number(tokens[idx].meta.numbered).toString();
    }
    else {
        if (tokens[idx].meta.hasOwnProperty('lastNumber')) {
            n = Number(tokens[idx].meta.lastNumber + 1).toString();
        }
        else {
            if (((_b = (_a = env.footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length) && ((_d = (_c = env.footnotes) === null || _c === void 0 ? void 0 : _c.list[tokens[idx].meta.id]) === null || _d === void 0 ? void 0 : _d.lastNumber)) {
                n = Number(env.footnotes.list[tokens[idx].meta.id].lastNumber + 1).toString();
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
    var _a, _b, _c, _d;
    var notFootnoteText = ((_b = (_a = env.footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length) > tokens[idx].meta.id
        && !Boolean((_c = env.footnotes) === null || _c === void 0 ? void 0 : _c.list[tokens[idx].meta.id].hasContent)
        && ((_d = env.footnotes) === null || _d === void 0 ? void 0 : _d.list[tokens[idx].meta.id].type) === "footnotemark";
    var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    var caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
    var refid = id;
    if (tokens[idx].meta.subId > 0) {
        refid += ':' + tokens[idx].meta.subId;
    }
    return notFootnoteText
        ? '<sup class="footnote-ref">' + caption + '</sup>'
        : options.forDocx
            ? '<a href="#fn' + id + '" id="fnref' + refid + '"><sup class="footnote-ref">' + caption + '</sup></a>'
            : '<sup class="footnote-ref"><a href="#fn' + id + '" id="fnref' + refid + '">' + caption + '</a></sup>';
};
exports.render_footnote_ref = render_footnote_ref;
var render_footnote_block_open = function (tokens, idx, options) {
    return (options.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') +
        '<section class="footnotes">\n' +
        '<ol class="footnotes-list">\n';
};
exports.render_footnote_block_open = render_footnote_block_open;
var render_footnote_block_close = function () {
    return '</ol>\n</section>\n';
};
exports.render_footnote_block_close = render_footnote_block_close;
var render_footnote_open = function (tokens, idx, options, env, slf) {
    var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
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
    var _a, _b, _c, _d;
    var notFootnoteMarker = ((_b = (_a = env.footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length) > tokens[idx].meta.id
        && Boolean(((_c = env.footnotes) === null || _c === void 0 ? void 0 : _c.list[tokens[idx].meta.id].footnoteId) === -1)
        && ((_d = env.footnotes) === null || _d === void 0 ? void 0 : _d.list[tokens[idx].meta.id].type) === "footnotetext";
    if (notFootnoteMarker) {
        return '';
    }
    var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
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
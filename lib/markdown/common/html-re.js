"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selfClosingTags = exports.HTML_SEQUENCES = exports.HTML_OPEN_TAG = exports.HTML_CLOSE_TAG_RE = exports.HTML_OPEN_TAG_RE = void 0;
var block_names = require('markdown-it/lib/common/html_blocks');
// var HTML_OPEN_CLOSE_TAG_RE = require('markdown-it/lib/common/html_re').HTML_OPEN_CLOSE_TAG_RE;
var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var unquoted = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';
var attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';
var attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';
var open_tag = '<([A-Za-z][A-Za-z0-9\\-]*)' + attribute + '*\\s*(\\/)?>';
var close_tag = '<\\/([A-Za-z][A-Za-z0-9\\-]*)\\s*>';
var comment = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
var processing = '<[?].*?[?]>';
var declaration = '<![A-Z]+\\s+[^>]*>';
var cdata = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';
//var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
//                         '|' + processing + '|' + declaration + '|' + cdata + ')');
exports.HTML_OPEN_TAG_RE = new RegExp('^(?:' + open_tag + '|' + comment +
    '|' + processing + '|' + declaration + '|' + cdata + ')');
exports.HTML_CLOSE_TAG_RE = new RegExp('^(?:' + close_tag + ')');
exports.HTML_OPEN_TAG = new RegExp('^(?:' + open_tag + ')');
// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//
exports.HTML_SEQUENCES = [
    [/^<(script)(?=(\s|>|$))/i, /<\/(script)>/i, true],
    [/^<(pre)(?=(\s|>|$))/i, /<\/(pre)>/i, true],
    [/^<(style)(?=(\s|>|$))/i, /<\/(style)>/i, true],
    [/^<!--/, /-->/, true],
    [/^<\?/, /\?>/, true],
    [/^<![A-Z]/, />/, true],
    [/^<!\[CDATA\[/, /\]\]>/, true],
    [new RegExp('^<(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), '', true],
    [new RegExp(exports.HTML_OPEN_TAG.source + '\\s*$'), '', false]
    // [ new RegExp('^</?(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true ],
    // [ new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + '\\s*$'),  /^$/, false ]
];
exports.selfClosingTags = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
];
//# sourceMappingURL=html-re.js.map
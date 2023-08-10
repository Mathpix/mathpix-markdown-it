"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render_footnote_open = void 0;
var render_footnote_open = function (tokens, idx, options, env, slf) {
    var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
    }
    if (tokens[idx].meta.numbered) {
        return '<li id="fn' + id + '" class="footnote-item" value="' + tokens[idx].meta.numbered + '">';
    }
    return '<li id="fn' + id + '" class="footnote-item">';
};
exports.render_footnote_open = render_footnote_open;
//# sourceMappingURL=render-rule.js.map
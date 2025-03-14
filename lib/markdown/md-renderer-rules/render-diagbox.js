"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDiagbox = exports.renderDiagBoxItem = void 0;
var tslib_1 = require("tslib");
var render_table_cell_content_1 = require("../common/render-table-cell-content");
var renderDiagBoxItem = function (tokens, idx, options, env, slf) {
    if (options === void 0) { options = {}; }
    if (env === void 0) { env = {}; }
    var token = tokens[idx];
    var attrs = slf.renderAttrs(token);
    var _a = (0, render_table_cell_content_1.renderTableCellContent)(token, true, options, env, slf), content = _a.content, tsv = _a.tsv, csv = _a.csv, tableMd = _a.tableMd;
    Object.assign(token, { tsv: tsv, csv: csv, tableMd: tableMd });
    return "<div ".concat(attrs, ">").concat(content, "</div>");
};
exports.renderDiagBoxItem = renderDiagBoxItem;
var renderDiagbox = function (tokens, idx, options, env, slf) {
    var e_1, _a;
    var _b, _c, _d, _e;
    if (env === void 0) { env = {}; }
    var token = tokens[idx];
    var styles = ((_b = token.meta) === null || _b === void 0 ? void 0 : _b.isBlock)
        ? ['display: grid;']
        : ['display: inline-grid;',
            'background-size: 100% 100%;', "background-image: linear-gradient(to bottom ".concat(token.type === 'backslashbox' ? 'left' : 'right', ", transparent calc(50% - 0.5px), black 50%, black 50%, transparent calc(50% + 0.5px));")
        ];
    token.attrJoin('style', styles.join(' '));
    var attrs = slf.renderAttrs(token);
    var res = slf.renderInline((_c = token.children) !== null && _c !== void 0 ? _c : [], options, env);
    var dataKeys = ["tsv", "csv", "tableMd"];
    var _loop_1 = function (key) {
        token[key] = (_e = (_d = token.children) === null || _d === void 0 ? void 0 : _d.map(function (child) { return child[key]; })) !== null && _e !== void 0 ? _e : [];
    };
    try {
        for (var dataKeys_1 = tslib_1.__values(dataKeys), dataKeys_1_1 = dataKeys_1.next(); !dataKeys_1_1.done; dataKeys_1_1 = dataKeys_1.next()) {
            var key = dataKeys_1_1.value;
            _loop_1(key);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dataKeys_1_1 && !dataKeys_1_1.done && (_a = dataKeys_1.return)) _a.call(dataKeys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return "<div ".concat(attrs, ">").concat(res, "</div>");
};
exports.renderDiagbox = renderDiagbox;
//# sourceMappingURL=render-diagbox.js.map
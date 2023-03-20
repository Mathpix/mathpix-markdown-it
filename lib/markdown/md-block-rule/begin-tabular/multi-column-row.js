"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultiColumnMultiRow = exports.getCurrentMC = exports.getMC = void 0;
var tabular_td_1 = require("./tabular-td");
var sub_tabular_1 = require("./sub-tabular");
var sub_math_1 = require("./sub-math");
var common_1 = require("./common");
var consts_1 = require("../../common/consts");
exports.getMC = function (cell) {
    cell = cell.trim();
    var match = cell
        .match(/(?:\\multicolumn\s{0,}\{([^}]*)\})/);
    if (match) {
        var mc = Number(match[1]);
        return mc >= 1 ? mc - 1 : 0;
    }
    else
        return 0;
};
exports.getCurrentMC = function (cells, i) {
    var res = 0;
    for (var j = 0; j <= i; j++) {
        if (!cells[j]) {
            res += j > 0 ? 1 : 0;
            continue;
        }
        var cell = cells[j].trim();
        var match = cell
            .match(/(?:\\multicolumn\s{0,}\{([^}]*)\})/);
        if (match) {
            var mc = Number(match[1]);
            res += j > 0 ? mc : mc > 1 ? mc - 1 : 0;
        }
        else {
            res += j > 0 ? 1 : 0;
        }
    }
    return res;
};
exports.getMultiColumnMultiRow = function (str, params, forLatex) {
    var _a, _b, _c, _d, _e;
    if (forLatex === void 0) { forLatex = false; }
    var attrs = [];
    var content = '';
    var mr = 0;
    var mc = 0;
    str = str.trim();
    var matchMC = str
        .match(/(?:\\multicolumn\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/);
    if (matchMC) {
        mc = Number(matchMC[1]);
        var align = matchMC[2];
        var cLines = common_1.getColumnLines(align);
        var cAlign = common_1.getColumnAlign(align);
        var cLeft = cLines && cLines[0] ? cLines[0] : '';
        var cRight = cLines && cLines[1] ? cLines[1] : '';
        attrs.push(tabular_td_1.setColumnLines({ h: cAlign ? cAlign[0] : '' }, { left: cLeft, right: cRight }));
        attrs.push(['colspan', mc.toString()]);
        str = str.slice(0, matchMC.index) + str.slice(matchMC.index + matchMC[0].length);
    }
    var vpos = '', nrows = '', width = '';
    var matchMR = str
        .match(consts_1.reMultiRowWithVPos);
    if (matchMR) {
        vpos = ((_a = matchMR.groups) === null || _a === void 0 ? void 0 : _a.vpos) ? matchMR.groups.vpos : matchMR[1];
        nrows = ((_b = matchMR.groups) === null || _b === void 0 ? void 0 : _b.nrows) ? matchMR.groups.nrows : matchMR[2];
        width = ((_c = matchMR.groups) === null || _c === void 0 ? void 0 : _c.width) ? matchMR.groups.width : matchMR[3];
    }
    else {
        matchMR = str.match(consts_1.reMultiRow);
        if (matchMR) {
            nrows = ((_d = matchMR.groups) === null || _d === void 0 ? void 0 : _d.nrows) ? matchMR.groups.nrows : matchMR[1];
            width = ((_e = matchMR.groups) === null || _e === void 0 ? void 0 : _e.width) ? matchMR.groups.width : matchMR[2];
        }
    }
    if (matchMR) {
        mr = Number(nrows);
        var w = width || '';
        vpos = vpos ? vpos.trim() : '';
        if (!matchMC) {
            attrs.push(tabular_td_1.setColumnLines({
                h: params.align ? params.align : '',
                v: vpos === 't' ? 'top' : vpos === 'b' ? 'bottom' : '',
            }, { left: params.lLines, right: params.rLines }));
        }
        if (mr > 0) {
            attrs.push(['rowspan', mr.toString()]);
        }
        w = w.trim().replace('*', 'auto');
        if (w && w.length > 0) {
            attrs = tabular_td_1.addStyle(attrs, "width: " + w + "; ");
        }
        str = str.slice(0, matchMR.index) + str.slice(matchMR.index + matchMR[0].length);
    }
    if (!matchMC && !matchMR) {
        return null;
    }
    var latex = '';
    if (matchMC) {
        latex += matchMC[0].trim();
    }
    if (matchMR) {
        latex += latex
            ? "{" + matchMR[0].trim() + "}"
            : matchMR[0].trim();
    }
    var parseSub = sub_tabular_1.getSubTabular(str, 0, true, forLatex);
    if (parseSub) {
        return { mr: mr, mc: mc, attrs: attrs, content: '', subTable: parseSub, latex: latex };
    }
    var parseMath = sub_math_1.getMathTableContent(str, 0);
    if (parseMath && parseMath.length > 0) {
        content = parseMath;
    }
    else {
        content = common_1.getContent(str);
    }
    return { mr: mr, mc: mc, attrs: attrs, content: content, subTable: null, latex: latex };
};
//# sourceMappingURL=multi-column-row.js.map
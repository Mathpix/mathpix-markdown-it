"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultiColumnMultiRow = exports.getCurrentMC = exports.getMC = void 0;
var tabular_td_1 = require("./tabular-td");
var sub_tabular_1 = require("./sub-tabular");
var sub_math_1 = require("./sub-math");
var common_1 = require("./common");
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
exports.getMultiColumnMultiRow = function (str, params) {
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
    var matchMR = str
        .match(/(?:\\multirow\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/);
    if (matchMR) {
        mr = Number(matchMR[1]);
        var w = matchMR[2] || '';
        if (!matchMC) {
            attrs.push(tabular_td_1.setColumnLines({ h: params.align ? params.align : '' }, { left: params.lLines, right: params.rLines }));
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
    var parseSub = sub_tabular_1.getSubTabular(str, 0);
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chemisrty_drawer_1 = require("./chemisrty-drawer");
var rules_1 = require("../rules");
function injectLineNumbersSmiles(tokens, idx, options, env, slf) {
    var line, endLine, listLine;
    var token = tokens[idx];
    if (token.map && token.level === 0) {
        line = token.map[0];
        endLine = token.map[1];
        listLine = [];
        for (var i = line; i < endLine; i++) {
            listLine.push(i);
        }
        token.attrJoin("class", rules_1.PREVIEW_PARAGRAPH_PREFIX + String(line)
            + ' ' + rules_1.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
        token.attrJoin("data_line_start", "" + String(line));
        token.attrJoin("data_line_end", "" + String(endLine - 1));
        token.attrJoin("data_line", "" + String([line, endLine]));
        token.attrJoin("count_line", "" + String(endLine - line));
    }
    return slf.renderAttrs(token);
}
var slimesDrawerBlock = function (state, startLine, endLine, silent) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var haveEndMarker;
    var token;
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
    }
    if (pos + 3 > max) {
        return false;
    }
    var marker = state.src.charCodeAt(pos);
    if (marker !== 0x60 /* ` */) {
        return false;
    }
    // scan marker length
    var mem = pos;
    pos = state.skipChars(pos, marker);
    var len = pos - mem;
    if (len < 3) {
        return false;
    }
    var markup = state.src.slice(mem, pos);
    var params = state.src.slice(pos, max);
    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
        return false;
    }
    if (params !== 'smiles') {
        return false;
    }
    // Since start is found, we can report success here in validation mode
    if (silent) {
        return true;
    }
    // search end of block
    var nextLine = startLine;
    for (;;) {
        nextLine++;
        if (nextLine >= endLine) {
            // unclosed block should be autoclosed by end of document.
            // also block seems to be autoclosed by end of parent
            break;
        }
        pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (pos < max && state.sCount[nextLine] < state.blkIndent) {
            // non-empty line with negative indent should stop the list:
            // - ```
            //  test
            break;
        }
        if (state.src.charCodeAt(pos) !== marker) {
            continue;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
            // closing fence should be indented less than 4 spaces
            continue;
        }
        pos = state.skipChars(pos, marker);
        // closing code fence must be at least as long as the opening one
        if (pos - mem < len) {
            continue;
        }
        // make sure tail has spaces only
        pos = state.skipSpaces(pos);
        if (pos < max) {
            continue;
        }
        haveEndMarker = true;
        // found!
        break;
    }
    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];
    state.line = nextLine + (haveEndMarker ? 1 : 0);
    token = state.push('slimes', 'div', 0);
    token.info = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state.line];
    return true;
};
var renderSlimesDrawerBlock = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    if (!token.content) {
        return '';
    }
    var id = "f" + (+new Date).toString(16);
    var resSvg = chemisrty_drawer_1.ChemistryDrawer.drawSvgSync(token.content.trim(), id, options);
    if (!resSvg) {
        return '';
    }
    var attrs = (options === null || options === void 0 ? void 0 : options.lineNumbering) ? injectLineNumbersSmiles(tokens, idx, options, env, slf)
        : '';
    if (attrs) {
        return "<div " + attrs + ">" + resSvg + "</div>";
    }
    return "<div>" + resSvg + "</div>";
};
exports.default = (function (md, options) {
    Object.assign(md.options, options);
    md.block.ruler.before('fence', 'slimesDrawerBlock', slimesDrawerBlock);
    md.renderer.rules.slimes = function (tokens, idx, options, env, slf) {
        return renderSlimesDrawerBlock(tokens, idx, options, env, slf);
    };
});
//# sourceMappingURL=index.js.map
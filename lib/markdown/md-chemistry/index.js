"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chemistry_drawer_1 = require("./chemistry-drawer");
var rules_1 = require("../rules");
var utils_1 = require("../utils");
var convert_scv_to_base64_1 = require("../md-svg-to-base64/convert-scv-to-base64");
var consts_1 = require("../common/consts");
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
var smilesDrawerBlock = function (state, startLine, endLine, silent) {
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
    token = state.push('smiles', 'div', 0);
    token.info = params;
    var content = state.getLines(startLine + 1, nextLine, len, true);
    content = content.trim();
    content = content.replace(/\r|\n|\s+/g, '');
    token.content = content;
    token.markup = markup;
    token.map = [startLine, state.line];
    return true;
};
var smilesDrawerInline = function (state) {
    var startPos = state.pos;
    var beginMarker = consts_1.reOpenTagSmiles;
    var endMarker = '</smiles>';
    if (state.src.charCodeAt(startPos) !== 0x3C /* < */) {
        return false;
    }
    if (!beginMarker.test(state.src.slice(startPos))) {
        return false;
    }
    var match = state.src
        .slice(startPos)
        .match(beginMarker);
    if (!match) {
        return false;
    }
    startPos += match[0].length;
    var endPos = state.src.indexOf(endMarker, startPos);
    if (endPos === -1) {
        return false;
    }
    var nextPos = endPos + endMarker.length;
    var content = state.src.slice(startPos, endPos);
    content = content.trim();
    content = content.replace(/\s+/g, '');
    var token = state.push('smiles_inline', "", 0);
    token.content = content.trim();
    state.pos = nextPos;
    return true;
};
var renderSmilesDrawerBlock = function (tokens, idx, options, env, slf) {
    var _a = options.outMath, outMath = _a === void 0 ? {} : _a;
    var _b = outMath.include_smiles, include_smiles = _b === void 0 ? false : _b, _c = outMath.include_svg, include_svg = _c === void 0 ? true : _c;
    var token = tokens[idx];
    if (!token.content) {
        return '';
    }
    var id = !options.isTesting
        ? utils_1.uid()
        : '';
    var resSvg = include_svg || options.forDocx
        ? chemistry_drawer_1.ChemistryDrawer.drawSvgSync(token.content.trim(), id, options)
        : '';
    if (resSvg && (options.forDocx || options.forLatex)) {
        var imgId = options.forLatex ? id : '';
        resSvg = convert_scv_to_base64_1.default(resSvg, imgId);
    }
    var attrs = (options === null || options === void 0 ? void 0 : options.lineNumbering) ? injectLineNumbersSmiles(tokens, idx, options, env, slf)
        : '';
    var outputSmiles = include_smiles
        ? '<smiles style="display: none">' + token.content.trim() + '</smiles>'
        : '';
    var maxWidth = options.maxWidth ? " max-width: " + options.maxWidth + "; overflow-x: auto;" : '';
    if (attrs) {
        return maxWidth
            ? "<div " + attrs + "><div class=\"smiles\" style=\"" + maxWidth + "\">" + outputSmiles + resSvg + "</div></div>"
            : "<div " + attrs + "><div class=\"smiles\">" + outputSmiles + resSvg + "</div></div>";
    }
    return maxWidth
        ? "<div><div class=\"smiles\" style=\"" + maxWidth + "\">" + outputSmiles + resSvg + "</div></div>"
        : "<div><div class=\"smiles\">" + outputSmiles + resSvg + "</div></div>";
};
var renderSmilesDrawerInline = function (tokens, idx, options, env, slf) {
    var _a = options.outMath, outMath = _a === void 0 ? {} : _a;
    var _b = outMath.include_smiles, include_smiles = _b === void 0 ? false : _b, _c = outMath.include_svg, include_svg = _c === void 0 ? true : _c;
    var token = tokens[idx];
    if (!token.content) {
        return '';
    }
    var id = !options.isTesting
        ? utils_1.uid()
        : '';
    var resSvg = include_svg || options.forDocx
        ? chemistry_drawer_1.ChemistryDrawer.drawSvgSync(token.content.trim(), id, options)
        : '';
    if (resSvg && (options.forDocx || options.forLatex)) {
        var imgId = options.forLatex ? id : '';
        resSvg = convert_scv_to_base64_1.default(resSvg, imgId);
    }
    var outputSmiles = include_smiles
        ? '<smiles style="display: none">' + token.content.trim() + '</smiles>'
        : '';
    var maxWidth = options.maxWidth ? " max-width: " + options.maxWidth + "; overflow-x: auto;" : '';
    return maxWidth
        ? "<div class=\"smiles-inline\" style=\"display: inline-block;" + maxWidth + "\">" + outputSmiles + resSvg + "</div>"
        : "<div class=\"smiles-inline\" style=\"display: inline-block\">" + outputSmiles + resSvg + "</div>";
};
exports.default = (function (md, options) {
    Object.assign(md.options, options);
    md.block.ruler.before('fence', 'smilesDrawerBlock', smilesDrawerBlock, {
        alt: ["paragraph", "reference", "blockquote", "list"]
    });
    md.inline.ruler.before('html_inline', 'smilesDrawerInline', smilesDrawerInline);
    md.renderer.rules.smiles = function (tokens, idx, options, env, slf) {
        return renderSmilesDrawerBlock(tokens, idx, options, env, slf);
    };
    md.renderer.rules.smiles_inline = function (tokens, idx, options, env, slf) {
        return renderSmilesDrawerInline(tokens, idx, options, env, slf);
    };
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var gstate;
var defaults = {
    includeLevel: [1, 2, 3, 4, 5, 6]
};
var toc = function (state, silent) {
    var token;
    var match;
    var matchFilter;
    if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    match = common_1.tocRegexp.exec(state.src.substr(state.pos));
    matchFilter = !match ? [] : match.filter(function (m) { return m; });
    if (matchFilter.length < 1) {
        return false;
    }
    var newline = state.src.indexOf('\n', state.pos);
    token = state.push('toc_open', 'toc', 1);
    token.markup = '[[toc]]';
    token = state.push('toc_body', '', 0);
    token = state.push('toc_close', 'toc', -1);
    state.pos = newline !== -1 ? newline : state.pos + state.posMax + 1;
    return true;
};
var tocHide = function (state, silent) {
    // let token: Token;
    var match;
    var matchFilter;
    if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    match = common_1.tocRegexp.exec(state.src.substr(state.pos));
    matchFilter = !match ? [] : match.filter(function (m) { return m; });
    if (matchFilter.length < 1) {
        return false;
    }
    var newline = state.src.indexOf('\n', state.pos);
    state.pos = newline !== -1 ? newline : state.pos + state.posMax + 1;
    return true;
};
var renderTocOpen = function () {
    return "<div class=\"table-of-contents\" style=\"display: none\"}}>";
};
var renderTocClose = function () {
    return "</div>";
};
var renderTocBody = function (tokens, index, options) {
    return renderChildsTokens(0, gstate.tokens, options)[1];
};
var types = [
    'inline',
    'title',
    'section',
    'subsection',
    'subsubsection'
];
var renderChildsTokens = function (pos, tokens, options) {
    var slugs = {};
    var headings = [], buffer = '', currentLevel, subHeadings, size = tokens.length, i = pos;
    while (i < size) {
        var token = tokens[i];
        var heading = tokens[i - 1];
        var heading_open = tokens[i - 2];
        var level = token.tag && parseInt(token.tag.substr(1, 1));
        if (token.type !== 'heading_close' || options.includeLevel.indexOf(level) == -1 || !types.includes(heading.type)) {
            i++;
            continue;
        }
        var heading_id = '';
        if (heading_open && heading_open.type === 'heading_open') {
            heading_id = heading_open.attrGet('id');
        }
        if (!currentLevel) {
            currentLevel = level;
        }
        else {
            if (level > currentLevel) {
                subHeadings = renderChildsTokens(i, tokens, options);
                buffer += subHeadings[1];
                i = subHeadings[0];
                continue;
            }
            if (level < currentLevel) {
                // Finishing the sub headings
                buffer += "</li>";
                headings.push(buffer);
                return [i, "<ul>" + headings.join('') + "</ul}>"];
            }
            if (level == currentLevel) {
                // Finishing the sub headings
                buffer += "</li>";
                headings.push(buffer);
            }
        }
        var slugifiedContent = heading_id !== '' ? heading_id : common_1.uniqueSlug(common_1.slugify(heading.content), slugs);
        var link = "#" + slugifiedContent;
        buffer = "<li class=\"toc-title-" + level + "\"><a href=\"" + link + "\" style=\"cursor: pointer; text-decoration: none;\" class=\"toc-link\" value=\"" + slugifiedContent + "\">";
        buffer += heading.content;
        buffer += "</a>";
        i++;
    }
    buffer += buffer === '' ? '' : "</li>";
    headings.push(buffer);
    return [i, "<ul>" + headings.join('') + "</ul>"];
};
var mapping = {
    toc_open: "toc_open",
    toc_close: "toc_close",
    toc_body: "toc_body",
};
exports.default = (function (md, opts) {
    var options = Object.assign({}, defaults, opts);
    // Catch all the tokens for iteration later
    md.core.ruler.push('grab_state', function (state) {
        gstate = state;
    });
    // Insert TOC
    md.inline.ruler.after('emphasis', 'toc', toc);
    md.inline.ruler.push('tocHide', tocHide);
    Object.keys(mapping).forEach(function (key) {
        md.renderer.rules[key] = function (tokens, idx) {
            switch (tokens[idx].type) {
                case "toc_open":
                    return renderTocOpen();
                case "toc_close":
                    return renderTocClose();
                case "toc_body":
                    return renderTocBody(tokens, idx, options);
                default:
                    return '';
            }
        };
    });
});
//# sourceMappingURL=mdPluginTOC.js.map
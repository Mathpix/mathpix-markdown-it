"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSlugsTocItems = void 0;
var common_1 = require("./common");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
var utils_1 = require("./utils");
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
    return "<div class=\"table-of-contents\" style=\"display: none;\">";
};
var renderTocClose = function () {
    return "</div>";
};
var renderTocBody = function (tokens, index, options, env, slf) {
    var _a;
    var res = '';
    var dataToc = getTocList(0, gstate.tokens, options, -1, env, slf);
    if (!dataToc || !((_a = dataToc.tocList) === null || _a === void 0 ? void 0 : _a.length)) {
        return res;
    }
    res = renderList(dataToc.tocList, options, env, slf);
    return res;
};
var types = [
    'inline',
    'title',
    'section',
    'subsection',
    'subsubsection',
    'addcontentsline'
];
/** Generating a nested list for nested headers */
var renderSub = function (renderedParentEl, tocList, parentId, options, env, slf) {
    var _a;
    var res = '';
    if (!tocList || !tocList.length) {
        return res;
    }
    if (((_a = options.toc) === null || _a === void 0 ? void 0 : _a.style) === mathpix_markdown_model_1.TTocStyle.summary) {
        res += parentId
            ? "<details id=\"".concat(parentId, "\"><summary>")
            : "<details><summary>";
        res += renderedParentEl;
        res += '</summary>';
        res += renderList(tocList, options, env, slf);
        res += '</details>';
    }
    else {
        res += renderedParentEl;
        res += renderList(tocList, options, env, slf);
    }
    return res;
};
/** Render tocList to html as unnumbered list <ul>...</ul> */
var renderList = function (tocList, options, env, slf) {
    var _a, _b;
    var res = '';
    if (!tocList || !tocList.length) {
        return res;
    }
    var isSummary = ((_a = options.toc) === null || _a === void 0 ? void 0 : _a.style) === mathpix_markdown_model_1.TTocStyle.summary;
    res += '<ul>';
    for (var i = 0; i < tocList.length; i++) {
        var item = tocList[i];
        var level = item.level, link = item.link, value = item.value, content = item.content, _c = item.children, children = _c === void 0 ? [] : _c;
        res += "<li class=\"toc-title-".concat(level, "\">");
        var parentId = ((_b = options.toc) === null || _b === void 0 ? void 0 : _b.doNotGenerateParentId)
            ? '' : item.subHeadings && isSummary ? (0, utils_1.uid)() : '';
        var dataParentId = parentId
            ? "data-parent-id=\"".concat(parentId, "\" ")
            : '';
        /** To generate a link to the corresponding header in the DOM tree */
        var renderLink = "<a href=\"".concat(link, "\" style=\"cursor: pointer; text-decoration: none;\" class=\"toc-link\" value=\"").concat(value, "\"");
        renderLink += dataParentId ? " " + dataParentId : '';
        renderLink += '>';
        if (children === null || children === void 0 ? void 0 : children.length) {
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                /** Since a link cannot contain a nested link, all nested links should be replaced with <span>...</span> */
                if (child.type === 'link_open') {
                    renderLink += '<span>';
                    continue;
                }
                if (child.type === 'link_close') {
                    renderLink += '</span>';
                    continue;
                }
                renderLink += slf.renderInline([child], options, env);
            }
        }
        else {
            renderLink += content;
        }
        renderLink += '</a>';
        if (item.subHeadings) {
            /** Generating a nested list for nested headers */
            res += renderSub(renderLink, item.subHeadings, parentId, options, env, slf);
        }
        else {
            res += renderLink;
        }
        res += '</li>';
    }
    res += '</ul>';
    return res;
};
var slugsTocItems = {};
var clearSlugsTocItems = function () {
    slugsTocItems = {};
};
exports.clearSlugsTocItems = clearSlugsTocItems;
/**
 * The function loops through an array of tokens and returns the list needed to render toc.
 * The resulting list is grouped by heading nesting levels.
 * */
var getTocList = function (pos, tokens, options, levelSub, env, slf) {
    var _a;
    if (levelSub === void 0) { levelSub = -1; }
    var subHeadings, size = tokens.length, i = pos;
    var tocList = [];
    var tocItem = null;
    var currentLevel = 0;
    while (i < size) {
        var token = tokens[i];
        var heading = tokens[i - 1];
        var heading_open = tokens[i - 2];
        var level = token.envLevel
            ? token.envLevel
            : token.tag && parseInt(token.tag.substr(1, 1));
        if ((token.type !== 'heading_close' && token.type !== 'addcontentsline_close')
            || options.includeLevel.indexOf(level) == -1 || !types.includes(heading.type)) {
            i++;
            continue;
        }
        var heading_id = '';
        /** Unnumbered sections will not go into the table of contents */
        if (token.type === 'heading_close' && token.isUnNumbered) {
            i++;
            continue;
        }
        if (heading_open && heading_open.type === 'heading_open') {
            heading_id = heading_open.attrGet('id');
        }
        if (!currentLevel) {
            currentLevel = level;
        }
        else {
            if (level > currentLevel) {
                var dataSubToc = getTocList(i, tokens, options, level, env, slf);
                subHeadings = dataSubToc ? dataSubToc.tocList : [];
                i = dataSubToc.index;
                var last = tocList[tocList.length - 1];
                if (last && (subHeadings === null || subHeadings === void 0 ? void 0 : subHeadings.length)) {
                    if ((_a = last.subHeadings) === null || _a === void 0 ? void 0 : _a.length) {
                        last.subHeadings = last.subHeadings.concat(subHeadings);
                    }
                    else {
                        last.subHeadings = subHeadings;
                    }
                }
                subHeadings = [];
                continue;
            }
            if (level < currentLevel) {
                if (levelSub === currentLevel) {
                    break;
                }
            }
        }
        var slugifiedContent = heading_id !== ''
            ? heading_id
            : (0, common_1.uniqueSlug)((0, common_1.slugify)(heading.content), slugsTocItems);
        var link = "#" + slugifiedContent;
        tocItem = {
            level: level,
            link: link,
            value: slugifiedContent,
            content: heading.content,
            children: heading.children
        };
        tocList.push(tocItem);
        currentLevel = level;
        i++;
    }
    return {
        index: i,
        tocList: tocList
    };
};
var mapping = {
    toc_open: "toc_open",
    toc_close: "toc_close",
    toc_body: "toc_body",
};
exports.default = (function (md, opts) {
    (0, exports.clearSlugsTocItems)();
    Object.assign(md.options, defaults, opts);
    // Catch all the tokens for iteration later
    md.core.ruler.push('grab_state', function (state) {
        gstate = state;
    });
    // Insert TOC
    md.inline.ruler.after('emphasis', 'toc', toc);
    md.inline.ruler.push('tocHide', tocHide);
    Object.keys(mapping).forEach(function (key) {
        md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
            switch (tokens[idx].type) {
                case "toc_open":
                    return renderTocOpen();
                case "toc_close":
                    return renderTocClose();
                case "toc_body":
                    return renderTocBody(tokens, idx, options, env, slf);
                default:
                    return '';
            }
        };
    });
});
//# sourceMappingURL=mdPluginTOC.js.map
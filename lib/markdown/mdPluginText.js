"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTextCounter = exports.resetCounter = void 0;
var getAbstractTemplate = function (content) { return "<h4 style=\"text-align: center\">Abstract</h4><p style=\"text-indent: 1em\">" + content + "</p>"; };
var subsectionParentCount = 0;
var sectionCount = 0;
var subCount = 0;
var subSubCount = 0;
var isNewSect = false;
var isNewSubSection = false;
exports.resetCounter = function () {
    subsectionParentCount = 0;
};
exports.resetTextCounter = function () {
    subsectionParentCount = 0;
    sectionCount = 0;
    subCount = 0;
    subSubCount = 0;
};
var headingSection = function (state, startLine /*, endLine*/) {
    var _a;
    sectionCount = 0;
    subCount = 0;
    subSubCount = 0;
    var content, token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    var startPos = 0, type, className = '', is_numerable = false, beginMarker = "{", endMarker = "}", level = 1;
    lineText = state.src.slice(pos, max).trim();
    if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
        return false;
    }
    var match = lineText
        .slice(++startPos)
        .match(/^(?:title|section|subsection|subsubsection)/);
    if (!match) {
        return false;
    }
    var attrStyle = '';
    startPos += match[0].length;
    switch (match[0]) {
        case "title":
            level = 1;
            type = "title";
            className = "main-title";
            attrStyle = 'text-align: center; margin: 0 auto; line-height: 1.2; margin-bottom: 1em;';
            break;
        case "section":
            level = 2;
            type = "section";
            is_numerable = true;
            subsectionParentCount++;
            isNewSect = true;
            className = "section-title";
            attrStyle = 'margin-top: 1.5em;';
            break;
        case "subsection":
            isNewSubSection = true;
            level = 3;
            type = "subsection";
            className = "sub_section-title";
            break;
        case "subsubsection":
            level = 4;
            type = "subsubsection";
            className = "sub_sub_section-title";
            break;
        default:
            break;
    }
    if (lineText[startPos] !== beginMarker) {
        return false;
    }
    var endMarkerPos = lineText.indexOf(endMarker, startPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    content = lineText.slice(startPos + 1, nextPos - endMarker.length);
    state.line = startLine + 1;
    token = state.push('heading_open', 'h' + String(level), 1);
    token.markup = '########'.slice(0, level);
    token.map = [startLine, state.line];
    token.attrJoin('type', type);
    token.attrJoin('class', className);
    if (((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx) && attrStyle) {
        token.attrSet('style', attrStyle);
    }
    token = state.push('inline', '', 0);
    token.content = content;
    token.type = type;
    token.is_numerable = is_numerable;
    token.map = [startLine, state.line];
    token.children = [];
    if (type === "subsection") {
        token.secNumber = subsectionParentCount;
        token.isNewSect = isNewSect;
        isNewSect = false;
    }
    if (type === "subsubsection") {
        token.secNumber = subsectionParentCount;
        token.isNewSubSection = isNewSubSection;
        isNewSubSection = false;
    }
    token = state.push('heading_close', 'h' + String(level), -1);
    token.markup = '########'.slice(0, level);
    return true;
};
var abstractBlock = function (state, startLine) {
    var isBlockOpened = false;
    var token;
    var content;
    var terminate;
    var openTag = /\\begin{abstract}/;
    var closeTag = /\\end{abstract}/;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var endLine = state.lineMax;
    var terminatorRules = state.md.block.ruler.getRules('paragraph');
    var lineText = state.src.slice(pos, max);
    var isCloseTagExist = false;
    if (!openTag.test(lineText)) {
        return false;
    }
    var resString = '';
    var abs = openTag.test(lineText);
    for (; nextLine < endLine; nextLine++) {
        if (closeTag.test(lineText)) {
            lineText += '\\n';
            break;
        }
        isBlockOpened = true;
        if (lineText === '') {
            resString += '\n';
        }
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (abs) {
            if (closeTag.test(lineText)) {
                isBlockOpened = false;
                abs = false;
                isCloseTagExist = true;
            }
            else {
                resString += ' ' + lineText;
            }
        }
        else {
            if (state.isEmpty(nextLine)) {
                break;
            }
        }
        if (openTag.test(lineText)) {
            if (isBlockOpened) {
                return false;
            }
        }
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
        }
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) {
            continue;
        }
        // Some tags can terminate paragraph without empty line.
        terminate = false;
        for (var i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
            }
        }
        if (terminate) {
            break;
        }
    }
    if (!isCloseTagExist) {
        return false;
    }
    content = resString;
    var contentList = content.split('\n');
    var tokenContent = contentList.filter(function (item) {
        return item.trim().length > 0;
    });
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, nextLine];
    token.attrSet('class', 'abstract');
    token.attrSet('style', 'width: 80%; margin: 0 auto; margin-bottom: 1em; font-size: .9em;');
    token = state.push('inline', '', 0);
    token.content = getAbstractTemplate(tokenContent.join("</p><p style=\"text-indent: 1em\">"));
    token.map = [startLine, state.line];
    token.children = [];
    token = state.push('paragraph_close', 'div', -1);
    state.line = nextLine;
    return true;
};
var textTypes = function (state) {
    var _a;
    var startPos = state.pos;
    var type = '', beginMarker = "{", endMarker = "}";
    var arrtStyle = '';
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startPos)
        .match(/^(?:textit|textbf|author)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startPos += match[0].length;
    switch (match[0]) {
        case "textit":
            type = "textit";
            break;
        case "textbf":
            type = "textbf";
            break;
        case "author":
            type = "author";
            arrtStyle = 'text-align: center; margin: 0 auto; display: flex; justify-content: center; flex-wrap: wrap;';
            break;
        default:
            break;
    }
    if (!type || type === '') {
        return false;
    }
    if (state.src[startPos] !== beginMarker) {
        return false;
    }
    var endMarkerPos = state.src.indexOf(endMarker, startPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    var token = state.push(type, "", 0);
    if (((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx) && arrtStyle) {
        token.attrSet('style', arrtStyle);
    }
    token.content = state.src.slice(startPos + 1, nextPos - endMarker.length);
    state.pos = nextPos;
    return true;
};
var linkifyURL = function (state) {
    var urlTag = /(?:(www|http:|https:)+[^\s]+[\w])/;
    var startPos = state.pos;
    var beginMarker = "{", endMarker = "}";
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startPos)
        .match(/^(?:url)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startPos += match[0].length;
    if (state.src[startPos] !== beginMarker) {
        return false;
    }
    var endMarkerPos = state.src.indexOf(endMarker, startPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    var token;
    var text = state.src.slice(startPos + 1, nextPos - endMarker.length);
    if (!text || text.trim().length === 0) {
        state.pos = nextPos;
        return true;
    }
    if (!state.md.linkify.test(text) || !urlTag.test(text)) {
        token = state.push('textUrl', '', 0);
        token.content = text;
        state.pos = nextPos;
        return true;
    }
    var links = state.md.linkify.match(text);
    var level = 1;
    var lastPos = 0;
    var pos;
    state.md.options.linkify = false;
    for (var ln = 0; ln < links.length; ln++) {
        var url = links[ln].url;
        var fullUrl = state.md.normalizeLink(url);
        if (!state.md.validateLink(fullUrl)) {
            continue;
        }
        var urlText = links[ln].text;
        if (!urlTag.test(urlText)) {
            pos = links[ln].index;
            if (pos > lastPos) {
                token = state.push('textUrl', '', 0);
                token.content = text.slice(lastPos, pos);
                token.level = level;
            }
            token = state.push('textUrl', '', 0);
            lastPos = links[ln].lastIndex;
            token.content = text.slice(pos, lastPos);
            token.level = level;
            continue;
        }
        if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
        }
        else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
        }
        else {
            urlText = state.md.normalizeLinkText(urlText);
        }
        pos = links[ln].index;
        if (pos > lastPos) {
            token = state.push('textUrl', '', 0);
            token.content = text.slice(lastPos, pos);
            token.level = level;
        }
        token = state.push('link_open', 'a', 1);
        token.attrs = [['href', fullUrl]];
        token.level = level++;
        token.markup = 'linkify';
        token.info = 'auto';
        token = state.push('text', '', 0);
        token.content = urlText;
        token.level = level;
        token = state.push('link_close', 'a', -1);
        token.level = --level;
        token.markup = 'linkify';
        token.info = 'auto';
        lastPos = links[ln].lastIndex;
    }
    if (lastPos < text.length) {
        token = state.push('textUrl', '', 0);
        token.content = text.slice(lastPos);
        token.level = level;
    }
    state.pos = nextPos;
    return true;
};
var renderDocTitle = function (token) { return ("" + token.content.split('\n').join('<br>')); };
var renderSectionTitle = function (token) {
    var sectionNumber = token.is_numerable
        ? "<span class=\"section-number\">" + ++sectionCount + ". </span>"
        : "";
    return "" + sectionNumber + token.content;
};
var renderSubsectionTitle = function (token) {
    if (token.isNewSect) {
        subCount = 0;
    }
    return "<span class=\"section-number\">" + token.secNumber + ".</span><span class=\"sub_section-number\">" + ++subCount + ".</span> " + token.content;
};
// renderSubSubsectionTitle
var renderSubSubsectionTitle = function (token) {
    if (token.isNewSubSection) {
        subSubCount = 0;
    }
    return "<span class=\"section-number\">" + token.secNumber + ".</span><span class=\"sub_section-number\">" + subCount + "." + ++subSubCount + ".</span> " + token.content;
};
var getAuthorColumnContent = function (content) {
    var res = '';
    content.trim().split('\\\\').forEach(function (item) {
        res += "<span>" + item.trim() + "</span>";
    });
    return res;
};
var renderAuthorToken = function (token, options) {
    var columns = token.content.split('\\and');
    var res = '';
    var attrStyle = options.forDocx
        ? 'min-width: 30%; max-width: 50%; padding: 0 7px;'
        : '';
    var divStyle = options.forDocx
        ? token.attrGet('style')
        : '';
    columns.forEach(function (item) {
        if (attrStyle) {
            res += "<p style=\"" + attrStyle + "\">" + getAuthorColumnContent(item) + "</p>";
        }
        else {
            res += "<p>" + getAuthorColumnContent(item) + "</p>";
        }
    });
    if (divStyle) {
        return "<div class=\"author\" style=\"" + divStyle + "\">\n          " + res + "\n        </div>";
    }
    else {
        return "<div class=\"author\">\n          " + res + "\n        </div>";
    }
};
var renderBoldText = function (token) { return "<strong>" + token.content + "</strong>"; };
var renderItalicText = function (token) { return "<em>" + token.content + "</em>"; };
var renderUrl = function (token) { return "<a href=\"" + token.content + "\">" + token.content + "</a>"; };
var renderTextUrl = function (token) {
    return "<a href=\"#\" class=\"text-url\">" + token.content + "</a>";
};
var mapping = {
    section: "Section",
    title: "Title",
    author: "Author",
    subsection: "Subsection",
    subsubsection: "Subsubsection",
    textbf: "TextBold",
    textit: "TextIt",
    url: "Url",
    textUrl: "textUrl"
};
exports.default = (function () {
    return function (md) {
        exports.resetCounter();
        md.block.ruler.before("heading", "headingSection", headingSection);
        md.block.ruler.before("paragraphDiv", "abstractBlock", abstractBlock);
        md.inline.ruler.before("multiMath", "textTypes", textTypes);
        md.inline.ruler.before('textTypes', 'linkifyURL', linkifyURL);
        Object.keys(mapping).forEach(function (key) {
            md.renderer.rules[key] = function (tokens, idx, options) {
                switch (tokens[idx].type) {
                    case "section":
                        return renderSectionTitle(tokens[idx]);
                    case "subsection":
                        return renderSubsectionTitle(tokens[idx]);
                    case "subsubsection":
                        return renderSubSubsectionTitle(tokens[idx]);
                    case "title":
                        return renderDocTitle(tokens[idx]);
                    case "author":
                        return renderAuthorToken(tokens[idx], options);
                    case "textbf":
                        return renderBoldText(tokens[idx]);
                    case "textit":
                        return renderItalicText(tokens[idx]);
                    case "url":
                        return renderUrl(tokens[idx]);
                    case "textUrl":
                        return renderTextUrl(tokens[idx]);
                    default:
                        return '';
                }
            };
        });
        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
            if (options.openLinkInNewWindow) {
                tokens[idx].attrPush(['target', '_blank']);
                tokens[idx].attrPush(['rel', 'noopener']);
            }
            else {
                tokens[idx].attrPush(['target', '_self']);
            }
            if (!tokens[idx + 1] || !tokens[idx + 1].content) {
                tokens[idx].attrPush([
                    'style', 'word-break: break-word'
                ]);
                return self.renderToken(tokens, idx, options);
            }
            if (tokens[idx + 1].content.length > 40 && !tokens[idx + 1].content.includes(' ')) {
                tokens[idx].attrPush([
                    'style', 'word-break: break-all'
                ]);
            }
            else if (!tokens[idx + 1].content.includes(' ')) {
                tokens[idx].attrPush([
                    'style', 'display: inline-block'
                ]);
            }
            else {
                tokens[idx].attrPush([
                    'style', 'word-break: break-word'
                ]);
            }
            return self.renderToken(tokens, idx, options);
        };
    };
});
//# sourceMappingURL=mdPluginText.js.map
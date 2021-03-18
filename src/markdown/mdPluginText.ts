import { MarkdownIt, RuleBlock, RuleInline, Renderer, Token } from 'markdown-it';
import { renderTabularInline } from "./md-renderer-rules/render-tabular";
// import { escapeHtml }  from 'markdown-it/lib/common/utils';

const getAbstractTemplate = (content) => `<h4 style="text-align: center">Abstract</h4><p style="text-indent: 1em">${content}</p>`;
let subsectionParentCount: number = 0;
let sectionCount: number = 0;
let subCount: number = 0;
let subSubCount: number = 0;
let isNewSect: boolean = false;
let isNewSubSection: boolean = false;

export const resetCounter: RuleInline = () => {
  subsectionParentCount = 0;
};

export const resetTextCounter: RuleInline = () => {
  subsectionParentCount = 0;
  sectionCount = 0;
  subCount = 0;
  subSubCount = 0;
};

const headingSection: RuleBlock = (state, startLine: number/*, endLine*/) => {
  sectionCount = 0;
  subCount = 0;
  subSubCount = 0;

  let token: Token, lineText: string,
    pos: number = state.bMarks[startLine] + state.tShift[startLine],
    max: number = state.eMarks[startLine];

  let startPos: number = 0, type: string, className: string = '',
    is_numerable: boolean = false,
    beginMarker: string = "{",
    endMarker: string = "}", level = 1;

  lineText = state.src.slice(pos, max).trim();
  if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
    return false;
  }

  const match: RegExpMatchArray = lineText
    .slice(++startPos)
    .match(/^(?:title|section|subsection|subsubsection)/);

  if (!match) {
    return false;
  }
  let attrStyle = '';

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
  const endMarkerPos: number = lineText.indexOf(endMarker, startPos);
  if (endMarkerPos === -1) {
    return false;
  }

  let { res = false, content = '' } = findEndMarker(lineText, startPos);

  if ( !res ) {
    return false;
  }

  state.line = startLine + 1;

  token = state.push('heading_open', 'h' + String(level), 1);
  if (state.md.options.forLatex) {
    token.latex = type;
  }
  token.markup = '########'.slice(0, level);
  token.map = [startLine, state.line];
  token.attrJoin('type', type);
  token.attrJoin('class', className);
  if (state.md.options?.forDocx && attrStyle) {
    token.attrSet('style', attrStyle);
  }

  token = state.push('inline', '', 0);
  token.content = content;
  token.type = type;
  token.is_numerable = is_numerable;
  token.map = [startLine, state.line];

  let children = [];
  state.md.inline.parse(content.trim(), state.md, state.env, children);
  token.children = children;

  if (type === "subsection") {
    token.secNumber = subsectionParentCount;
    token.isNewSect = isNewSect;
    isNewSect = false
  }
  if (type === "subsubsection") {
    token.secNumber = subsectionParentCount;
    token.isNewSubSection = isNewSubSection;
    isNewSubSection = false
  }

  token = state.push('heading_close', 'h' + String(level), -1);
  token.markup = '########'.slice(0, level);
  if (state.md.options.forLatex) {
    token.latex = type;
  }
  return true;
};

const abstractBlock: RuleBlock = (state, startLine) => {
  let isBlockOpened = false;
  let token: Token;
  let content: string;
  let terminate: boolean;
  const openTag: RegExp = /\\begin{abstract}/;
  const closeTag: RegExp = /\\end{abstract}/;
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let nextLine: number = startLine + 1;
  const endLine: number = state.lineMax;
  const terminatorRules = state.md.block.ruler.getRules('paragraph');
  let lineText: string = state.src.slice(pos, max);
  let isCloseTagExist = false;

  if (!openTag.test(lineText)) {
    return false;
  }
  let resString = '';
  let abs = openTag.test(lineText);
  for (; nextLine < endLine; nextLine++) {

    if (closeTag.test(lineText)) {
      lineText += '\\n';
      break;
    }

    isBlockOpened = true;
    if (lineText === '') {
      resString += '\n'
    }
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);

    if (abs) {
      if (closeTag.test(lineText)) {
        isBlockOpened = false;
        abs = false;
        isCloseTagExist = true;
      } else {
        resString += resString ? ' ' : '';
        resString += lineText;
      }
    } else {
      if (state.isEmpty(nextLine)) { break }
    }
    if (openTag.test(lineText)) {
      if (isBlockOpened) {
        return false;
      }
    }

    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  if (!isCloseTagExist) {
    return false;
  }
  content = resString;
  const contentList = content.split('\n');
  const tokenContent = contentList.filter(item => {
    return item.trim().length > 0
  });

  token = state.push('paragraph_open', 'div', 1);
  token.map = [startLine, nextLine];
  token.attrSet('class', 'abstract');
  token.attrSet('style', 'width: 80%; margin: 0 auto; margin-bottom: 1em; font-size: .9em;');
  token = state.push('inline', '', 0);
  token.content = getAbstractTemplate(tokenContent.join(`</p><p style="text-indent: 1em">`));
  token.map = [startLine, state.line];
  token.children = [];
  token = state.push('paragraph_close', 'div', -1);
  state.line = nextLine;
  return true;
};

const findEndMarker = (str: string, startPos: number = 0, beginMarker: string = "{", endMarker: string = "}") => {
  let content: string = '';
  let nextPos: number = 0;
  if ( str[startPos] !== beginMarker ) {
    return { res: false }
  }
  let openBrackets = 1;
  let openCode = 0;

  for (let i = startPos + 1; i < str.length; i++) {
    const chr = str[i];
    nextPos = i;

    if ( chr === '`') {
      if (openCode > 0) {
        openCode--;
      } else {
        openCode++;
      }
    }

    if ( chr === beginMarker && openCode === 0) {
      content += chr;
      openBrackets++;
      continue;
    }

    if ( chr === endMarker && openCode === 0) {
      openBrackets--;
      if (openBrackets > 0) {
        content += chr;
        continue;
      }
      break;
    }

    content += chr;
  }
  if ( openBrackets > 0 ) {
    return { res: false }
  }

  return {
    res: true,
    content: content,
    nextPos: nextPos + endMarker.length
  };
};

const textAuthor: RuleInline = (state) => {
  let startPos = state.pos;

  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:author)/); // eslint-disable-line

  if (!match) {
    return false;
  }

  startPos += match[0].length;

  let {res = false, content = '', nextPos = 0 } = findEndMarker(state.src, startPos);

  if ( !res ) {
    return false;
  }

  const type = "author";
  const arrtStyle = 'text-align: center; margin: 0 auto; display: flex; justify-content: center; flex-wrap: wrap;';

  const token = state.push(type, "", 0);
  if (state.md.options?.forDocx && arrtStyle) {
    token.attrSet('style', arrtStyle);
  }
  token.content = content;
  token.children = [];

  const columns = content.split('\\and');
  for (let i = 0; i < columns.length; i++) {
    let colArr = columns[i].trim().split('\\\\');
    let column = colArr.join('\n');

    const newToken: Token = {};

    newToken.type = 'inline';
    newToken.content = column;

    let children = [];
    state.md.inline.parse(column, state.md, state.env, children);
    newToken.children = children;
    newToken.type = 'author_item';

    token.children.push(newToken)
  }

  state.pos = nextPos;
  return true;
};

const textTypes: RuleInline = (state) => {
  let startPos = state.pos;
  let type: string = '';
  let arrtStyle: string = '';

  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:textit|textbf|texttt)/); // eslint-disable-line

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
    case "texttt":
      type = "texttt";
      break;
    default:
      break;
  }

  if (!type || type === '') {
    return false;
  }

  let {res = false, content = '', nextPos = 0 } = findEndMarker(state.src, startPos);

  if ( !res ) {
    return false;
  }

  state.push(type + '_open', "", 0);
  const token = state.push(type, "", 0);
  if (state.md.options?.forDocx && arrtStyle) {
    token.attrSet('style', arrtStyle);
  }
  token.content = content;
  token.children = [];

  let children = [];
  state.md.inline.parse(token.content.trim(), state.md, state.env, children);
  token.children = children;

  state.push(type + '_close', "", 0);
  state.pos = nextPos;
  return true;
};

const linkifyURL: RuleInline = (state) => {
  const urlTag: RegExp = /(?:(www|http:|https:)+[^\s]+[\w])/;
  let startPos = state.pos;
  let
    beginMarker: string = "{",
    endMarker: string = "}";

  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:url)/); // eslint-disable-line

  if (!match) {
    return false;
  }
  startPos += match[0].length;

  if (state.src[startPos] !== beginMarker) {
    return false;
  }
  const endMarkerPos = state.src.indexOf(endMarker, startPos);
  if (endMarkerPos === -1) {
    return false;
  }

  const nextPos = endMarkerPos + endMarker.length;
  let token;
  const text = state.src.slice(startPos + 1, nextPos - endMarker.length);
  if (!text || text.trim().length === 0) {
    state.pos = nextPos;
    return true;
  }

  if (!state.md.linkify.test(text) || !urlTag.test(text)) {
    token         = state.push('textUrl', '', 0);
    token.content = text;
    state.pos = nextPos;
    return true;
  }

  const links = state.md.linkify.match(text);

  let level = 1;
  let lastPos = 0;
  let pos;

  state.md.options.linkify = false

  for (let ln = 0; ln < links.length; ln++) {
    const url = links[ln].url;
    const fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) { continue; }

    let urlText = links[ln].text;

    if (!urlTag.test(urlText)) {
      pos = links[ln].index;
      if (pos > lastPos) {
        token         = state.push('textUrl', '', 0);
        token.content = text.slice(lastPos, pos);
        token.level   = level;
      }
      token         = state.push('textUrl', '', 0);
      lastPos = links[ln].lastIndex;
      token.content = text.slice(pos, lastPos);
      token.level   = level;
      continue;
    }

    if (!links[ln].schema) {
      urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
    } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
      urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
    } else {
      urlText = state.md.normalizeLinkText(urlText);
    }

    pos = links[ln].index;

    if (pos > lastPos) {
      token         = state.push('textUrl', '', 0);
      token.content = text.slice(lastPos, pos);
      token.level   = level;
    }

    token         = state.push('link_open', 'a', 1);
    token.attrs   = [ [ 'href', fullUrl ] ];
    token.level   = level++;
    token.markup  = 'linkify';
    token.info    = 'auto';

    token         = state.push('text', '', 0);
    token.content = urlText;
    token.level   = level;

    token         = state.push('link_close', 'a', -1);
    token.level   = --level;
    token.markup  = 'linkify';
    token.info    = 'auto';

    lastPos = links[ln].lastIndex;
  }

  if (lastPos < text.length) {
    token         = state.push('textUrl', '', 0);
    token.content = text.slice(lastPos);
    token.level   = level;
  }

  state.pos = nextPos;

  return true;
};

const renderDocTitle: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  const content = renderInlineContent(token, options, env, slf);
  return `${content.split('\n').join('<br>')}`
};

const renderInlineContent = (token, options, env, slf) => {
  let sContent = '';
  let content = '';
  if (token.children && token.children.length) {
    for (let i = 0; i < token.children.length; i++) {
      const tok = token.children[i];
      if (tok.children && tok.children.length > 1) {
        if (tok.type === "tabular_inline") {
          content = renderTabularInline(token.children, tok, options, env, slf)
        } else {
          content = slf.renderInline(tok.children, options);
        }
      } else {
        content = slf.renderInline([tok], options);
      }
      sContent +=  content
    }
    return sContent;
  }

  return token.content;
};

const renderSectionTitle: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  const sectionNumber = token.is_numerable
    ? `<span class="section-number">${++sectionCount}. </span>`
    : ``;
  const content = renderInlineContent(token, options, env, slf);
  return `${sectionNumber}${content}`
};

const renderSubsectionTitle: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  if (token.isNewSect) {
    subCount = 0;
  }
  const content = renderInlineContent(token, options, env, slf);
  return `<span class="section-number">${token.secNumber}.</span><span class="sub_section-number">${++subCount}.</span> ${content}`
};

const renderSubSubsectionTitle: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  if (token.isNewSubSection) {
    subSubCount = 0;
  }
  const content = renderInlineContent(token, options, env, slf);
  return `<span class="section-number">${token.secNumber}.</span><span class="sub_section-number">${subCount}.${++subSubCount}.</span> ${content}`
};

const getAuthorItemToken = (tokens, index, options, env, slf) => {
  let res = '';
  const token = tokens[index];
  const content = renderInlineContent(token, options, env, slf);

  let attrStyle = options.forDocx
    ? ' display: block; text-align: center;'
    : '';
  content.trim().split('\\\\').forEach(item => {
    res += attrStyle
      ? `<span style="${attrStyle}">${item.trim()}</span>`
      : `<span>${item.trim()}</span>`
  });
  return res;
};

const renderAuthorToken: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  let res = '';
  let attrStyle = options.forDocx
    ? 'min-width: 30%; max-width: 50%; padding: 0 7px;'
    : '';
  let divStyle: string = options.forDocx
    ? token.attrGet('style')
    : '';
  if (token.children && token.children.length) {
    for (let i = 0; i < token.children.length; i++) {
      const tok = token.children[i];

      const content = renderInlineContent(tok, options, env, slf);
      if (attrStyle) {
        res += `<p style="${attrStyle}">${content}</p>`
      } else {
        res += `<p>${content}</p>`
      }
    }
  }

  if (divStyle) {
    return `<div class="author" style="${divStyle}">
          ${res}
        </div>`;
  } else {
    return `<div class="author">
          ${res}
        </div>`;
  }
};

const renderBoldText = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const content = renderInlineContent(token, options, env, slf);

  return content;
};

const renderItalicText = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const content = renderInlineContent(token, options, env, slf);

  return content;
};

const renderCodeInlineOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  return  '<code' + slf.renderAttrs(token) + '>';
};

const renderCodeInlineClose = () => {
  return  '</code>';
};

const renderCodeInline = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  // return escapeHtml(token.content);
  const content = renderInlineContent(token, options, env, slf);

  return content;
};

const renderUrl = token => `<a href="${token.content}">${token.content}</a>`;

const renderTextUrl = token => {
  return `<a href="#" class="text-url">${token.content}</a>`
};

const mappingTextStyles = {
  textbf: "TextBold",
  textbf_open: "TextBoldOpen",
  textbf_close: "TextBoldClose",

  textit: "TextIt",
  textit_open: "TextItOpen",
  textit_close: "TextItClose",

  texttt: "texttt",
  texttt_open: "texttt_open",
  texttt_close: "texttt_close",
};

const mapping = {
  section: "Section",
  title: "Title",
  author: "Author",
  author_item: "authorItem",
  subsection: "Subsection",
  subsubsection: "Subsubsection",
  url: "Url",
  textUrl: "textUrl"
};

export default () => {
  return (md: MarkdownIt) => {
    resetCounter();
    md.block.ruler.before("heading", "headingSection", headingSection);
    md.block.ruler.before("paragraphDiv", "abstractBlock", abstractBlock);

    md.inline.ruler.before("multiMath", "textTypes", textTypes);
    md.inline.ruler.before("textTypes", "textAuthor", textAuthor);
    md.inline.ruler.before('textTypes', 'linkifyURL', linkifyURL);

    Object.keys(mappingTextStyles).forEach(key => {
      md.renderer.rules[key] = (tokens, idx, options, env, slf) => {
        switch (tokens[idx].type) {
          case "textbf":
            return renderBoldText(tokens, idx, options, env, slf);
          case "textbf_open":
            return '<strong>';
          case "textbf_close":
            return '</strong>';
          case "textit":
            return renderItalicText(tokens, idx, options, env, slf);
          case "textit_open":
            return '<em>';
          case "textit_close":
            return '</em>';
          case "texttt":
            return renderCodeInline(tokens, idx, options, env, slf);
          case "texttt_open":
            return renderCodeInlineOpen(tokens, idx, options, env, slf);
          case "texttt_close":
            return renderCodeInlineClose();
          default:
            return '';
        }
      }
    });

    Object.keys(mapping).forEach(key => {
      md.renderer.rules[key] = (tokens, idx, options, env, slf) => {
        switch (tokens[idx].type) {
          case "section":
            return renderSectionTitle(tokens, idx, options, env, slf);
          case "subsection":
            return renderSubsectionTitle(tokens, idx, options, env, slf);
          case "subsubsection":
            return renderSubSubsectionTitle(tokens, idx, options, env, slf);
          case "title":
            return renderDocTitle(tokens, idx, options, env, slf);
          case "author":
            return renderAuthorToken(tokens, idx, options, env, slf);
          case "author_item":
            return getAuthorItemToken(tokens, idx, options, env, slf);
          case "url":
            return renderUrl(tokens[idx]);
          case "textUrl":
            return renderTextUrl(tokens[idx]);
          default:
            return '';
        }
      }
    });

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      if (options.openLinkInNewWindow) {
        tokens[idx].attrPush(['target', '_blank']);
        tokens[idx].attrPush(['rel', 'noopener']);
      } else {
        tokens[idx].attrPush(['target', '_self']);
      }

      if (!tokens[idx + 1] || !tokens[idx + 1].content) {
          tokens[idx].attrPush([
            'style', 'word-break: break-word'
          ]);
          return self.renderToken(tokens, idx, options)
      }

      if (tokens[idx + 1].content.length > 40 && !tokens[idx + 1].content.includes(' ')) {
        tokens[idx].attrPush([
          'style', 'word-break: break-all'
        ]);
      } else if (!tokens[idx + 1].content.includes(' ')) {
        tokens[idx].attrPush([
          'style', 'display: inline-block'
        ]);
      } else {
        tokens[idx].attrPush([
          'style', 'word-break: break-word'
        ]);
      }
      return self.renderToken(tokens, idx, options)
    }
  };
};

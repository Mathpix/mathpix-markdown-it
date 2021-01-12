import { MarkdownIt, RuleBlock, RuleInline, Renderer, Token } from 'markdown-it';


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

  let content: string, token: Token, lineText: string,
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
  const nextPos: number = endMarkerPos + endMarker.length;
  content = lineText.slice(startPos + 1, nextPos - endMarker.length);

  state.line = startLine + 1;

  token = state.push('heading_open', 'h' + String(level), 1);
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
  token.children = [];
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
        resString += ' ' + lineText;
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

const textTypes: RuleInline = (state) => {
  let startPos = state.pos;
  let type: string = '',
    beginMarker: string = "{",
    endMarker: string = "}";
  let arrtStyle: string = '';

  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
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
  const endMarkerPos = state.src.indexOf(endMarker, startPos);
  if (endMarkerPos === -1) {
    return false;
  }

  const nextPos = endMarkerPos + endMarker.length;

  const token = state.push(type, "", 0);
  if (state.md.options?.forDocx && arrtStyle) {
    token.attrSet('style', arrtStyle);
  }
  token.content = state.src.slice(startPos + 1, nextPos - endMarker.length);
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

const renderDocTitle: Renderer = token => (
  `${token.content.split('\n').join('<br>')}`
);

const renderSectionTitle: Renderer = token => {
  const sectionNumber = token.is_numerable
    ? `<span class="section-number">${++sectionCount}. </span>`
    : ``;
  return `${sectionNumber}${token.content}`
};

const renderSubsectionTitle: Renderer = token => {
  if (token.isNewSect) {
    subCount = 0;
  }
  return `<span class="section-number">${token.secNumber}.</span><span class="sub_section-number">${++subCount}.</span> ${token.content}`
};

// renderSubSubsectionTitle

const renderSubSubsectionTitle: Renderer = token => {
  if (token.isNewSubSection) {
    subSubCount = 0;
  }
  return `<span class="section-number">${token.secNumber}.</span><span class="sub_section-number">${subCount}.${++subSubCount}.</span> ${token.content}`
};

const getAuthorColumnContent = content => {
  let res = '';
  content.trim().split('\\\\').forEach(item => {
    res += `<span>${item.trim()}</span>`
  })
  return res;
}

const renderAuthorToken: Renderer = (token, options) => {
  const columns = token.content.split('\\and');
  let res = '';
  let attrStyle = options.forDocx
    ? 'min-width: 30%; max-width: 50%; padding: 0 7px;'
    : '';
  let divStyle: string = options.forDocx
    ? token.attrGet('style')
    : '';
  columns.forEach(item => {
    if (attrStyle) {
      res += `<p style="${attrStyle}">${getAuthorColumnContent(item)}</p>`
    } else {
      res += `<p>${getAuthorColumnContent(item)}</p>`
    }
  });
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

const renderBoldText = token => `<strong>${token.content}</strong>`;

const renderItalicText = token => `<em>${token.content}</em>`;

const renderUrl = token => `<a href="${token.content}">${token.content}</a>`;

const renderTextUrl = token => {
  return `<a href="#" class="text-url">${token.content}</a>`
};

const mapping = {
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

export default () => {
  return (md: MarkdownIt) => {
    resetCounter();
    md.block.ruler.before("heading", "headingSection", headingSection);
    md.block.ruler.before("paragraphDiv", "abstractBlock", abstractBlock);

    md.inline.ruler.before("multiMath", "textTypes", textTypes);
    md.inline.ruler.before('textTypes', 'linkifyURL', linkifyURL);
    Object.keys(mapping).forEach(key => {
      md.renderer.rules[key] = (tokens, idx, options) => {
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

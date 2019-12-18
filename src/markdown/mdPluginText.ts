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

  startPos += match[0].length;
  switch (match[0]) {
    case "title":
      level = 1;
      type = "title";
      className = "main-title";
      break;
    case "section":
      level = 2;
      type = "section";
      is_numerable = true;
      subsectionParentCount++;
      isNewSect = true;
      className = "section-title";
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
  token.map = [startLine, state.line];
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

  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:url|textit|textbf|author)/); // eslint-disable-line

  if (!match) {
    return false;
  }
  startPos += match[0].length;
  switch (match[0]) {
    case "url":
      type = 'url';
      break;
    case "textit":
      type = "textit";
      break;
    case "textbf":
      type = "textbf";
      break;
    case "author":
      type = "author";
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
  token.content = state.src.slice(startPos + 1, nextPos - endMarker.length);
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

const renderAuthorToken: Renderer = (token) => {
  const columns = token.content.split('\\and');
  let res = '';
  columns.forEach(item => {
    res += `<p>${getAuthorColumnContent(item)}</p>`
  });
  return `<div class="author">
          ${res}
        </div>`;
};

const renderBoldText = token => `<strong>${token.content}</strong>`;

const renderItalicText = token => `<em>${token.content}</em>`;

const renderUrl = token => `<a href="${token.content}">${token.content}</a>`;

const mapping = {
  section: "Section",
  title: "Title",
  author: "Author",
  subsection: "Subsection",
  subsubsection: "Subsubsection",
  textbf: "TextBold",
  textit: "TextIt",
  url: "Url,"
};

export default () => {
  return (md: MarkdownIt) => {
    md.block.ruler.before("heading", "headingSection", headingSection);
    md.block.ruler.before("paragraphDiv", "abstractBlock", abstractBlock);

    md.inline.ruler.before("multiMath", "textTypes", textTypes);
    Object.keys(mapping).forEach(key => {
      md.renderer.rules[key] = (tokens, idx) => {
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
            return renderAuthorToken(tokens[idx]);
          case "textbf":
            return renderBoldText(tokens[idx]);
          case "textit":
            return renderItalicText(tokens[idx]);
          case "url":
            return renderUrl(tokens[idx]);
          default:
            return '';
        }
      }
    });

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      tokens[idx].attrPush(['target', '_blank']);
      tokens[idx].attrPush(['rel', 'noopener']);


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

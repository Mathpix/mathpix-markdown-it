import { MarkdownIt, RuleInline, Token, TokenList, Renderer } from 'markdown-it';
import { slugify, tocRegexp, uniqueSlug } from './common';

let gstate;

const defaults = {
  includeLevel: [ 1, 2, 3, 4, 5, 6 ]
};

const toc: RuleInline = (state, silent) => {
  let token: Token;
  let match: RegExpExecArray;
  let matchFilter: Array<string>;
  if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */ ) {
    return false;
  }

  if (silent) {
    return false;
  }

  match = tocRegexp.exec(state.src.substr(state.pos));
  matchFilter = !match ? [] : match.filter(function(m) { return m; });
  if (matchFilter.length < 1) {
    return false;
  }
  const newline: number = state.src.indexOf('\n', state.pos);

  token        = state.push('toc_open', 'toc', 1);
  token.markup = '[[toc]]';
  token        = state.push('toc_body', '', 0);
  token        = state.push('toc_close', 'toc', -1);
  state.pos    = newline !== -1 ? newline : state.pos + state.posMax + 1;

  return true;
};

const tocHide: RuleInline = (state, silent) => {
 // let token: Token;
  let match: RegExpExecArray;
  let matchFilter: Array<string>;
  if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */ ) {
    return false;
  }

  if (silent) {
    return false;
  }

  match = tocRegexp.exec(state.src.substr(state.pos));
  matchFilter = !match ? [] : match.filter(function(m) { return m; });
  if (matchFilter.length < 1) {
    return false;
  }
  const newline: number = state.src.indexOf('\n', state.pos);

  state.pos = newline !== -1 ? newline : state.pos + state.posMax + 1;
  return true;
};

const renderTocOpen: Renderer = () => {
  return `<div class="table-of-contents" style="display: none"}}>`;
};

const renderTocClose: Renderer = () => {
  return `</div>`;
};

const renderTocBody: Renderer = (tokens, index, options) => {
  return renderChildsTokens(0, gstate.tokens, options)[1];
};

const types: string[] = [
  'inline',
  'title',
  'section',
  'subsection',
  'subsubsection'
];

const renderChildsTokens = (pos: number, tokens: TokenList, options) => {
  const slugs = {};
  let headings: Array<string> = [],
    buffer: string = '',
    currentLevel: number,
    subHeadings,
    size: number = tokens.length,
    i: number = pos;

  while(i < size) {
    let token: Token = tokens[i];

    let heading: Token = tokens[i - 1];
    let heading_open: Token = tokens[i - 2];
    let level: number = token.tag && parseInt(token.tag.substr(1, 1));
    if (token.type !== 'heading_close' || options.includeLevel.indexOf(level) == -1 || !types.includes(heading.type)) {
      i++;
      continue;
    }
    let heading_id: string = '';

    if (heading_open && heading_open.type === 'heading_open') {
      heading_id = heading_open.attrGet('id');
    }

    if (!currentLevel) {
      currentLevel = level;
    } else {
      if (level > currentLevel) {
        subHeadings = renderChildsTokens(i, tokens, options);
        buffer += subHeadings[1];
        i = subHeadings[0];
        continue;
      }
      if (level < currentLevel) {
        // Finishing the sub headings
        buffer += `</li>`;
        headings.push(buffer);
        return [i, `<ul>${headings.join('')}</ul}>`];
      }
      if (level == currentLevel) {
        // Finishing the sub headings
        buffer += `</li>`;
        headings.push(buffer);
      }
    }

    let slugifiedContent: string = heading_id !== '' ? heading_id : uniqueSlug(slugify(heading.content), slugs);
    let link: string = "#"+slugifiedContent;

    buffer = `<li class="toc-title-${level}"><a href="${link}" style="cursor: pointer; text-decoration: none;" class="toc-link" value="${slugifiedContent}">`;
    buffer += heading.content;
    buffer += `</a>`;
    i++;
  }
  buffer += buffer === '' ? '' : `</li>`;
  headings.push(buffer);
  return [i, `<ul>${headings.join('')}</ul>`];
};

const mapping = {
  toc_open: "toc_open",
  toc_close: "toc_close",
  toc_body: "toc_body",
};

export default (md: MarkdownIt, opts) => {
  const options = Object.assign({}, defaults, opts);

  // Catch all the tokens for iteration later
  md.core.ruler.push('grab_state', (state) => {
    gstate = state;
  });

  // Insert TOC
  md.inline.ruler.after('emphasis', 'toc', toc);
  md.inline.ruler.push('tocHide', tocHide);

  Object.keys(mapping).forEach(key => {
    md.renderer.rules[key] = (tokens, idx) => {
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
    }
  });
};

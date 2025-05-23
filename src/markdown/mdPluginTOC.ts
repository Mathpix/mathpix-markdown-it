import { MarkdownIt, RuleInline, Token, TokenList, Renderer } from 'markdown-it';
import { slugify, tocRegexp, uniqueSlug } from './common';
import { TTocStyle } from '../mathpix-markdown-model';
import { uid } from './utils';

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
  return `<div class="table-of-contents" style="display: none;">`;
};

const renderTocClose: Renderer = () => {
  return `</div>`;
};

const renderTocBody: Renderer = (tokens, index, options, env, slf) => {
  let res: string = '';
  const dataToc: ITocData = getTocList(0, gstate.tokens, options,-1, env, slf);

  if (!dataToc || !dataToc.tocList?.length) {
    return res;
  }
  res = renderList(dataToc.tocList, options, env, slf);
  return res;
};

const types: string[] = [
  'inline',
  'title',
  'section',
  'subsection',
  'subsubsection',
  'addcontentsline'
];

/** Generating a nested list for nested headers */
const renderSub = (renderedParentEl: string, tocList: Array<ITocItem>, parentId, options, env, slf) => {
  let res = '';
  if (!tocList || !tocList.length) {
    return res;
  }
  if (options.toc?.style === TTocStyle.summary) {
    res += parentId
      ? `<details id="${parentId}"><summary>`
      : `<details><summary>`;
    res += renderedParentEl;
    res += '</summary>';
    res += renderList(tocList, options, env, slf);
    res += '</details>';
  } else {
    res += renderedParentEl;
    res += renderList(tocList, options, env, slf);
  }
  return res;
}; 

/** Render tocList to html as unnumbered list <ul>...</ul> */
const renderList = (tocList: Array<ITocItem>, options, env, slf) => {
  let res = '';
  if (!tocList || !tocList.length) {
    return res;
  }
  const isSummary = options.toc?.style === TTocStyle.summary;
  res += '<ul>';
  for (let i = 0; i < tocList.length; i++) {
    const item = tocList[i];
    const { level, link, value, content, children = []} = item;
    res += `<li class="toc-title-${level}">`;
    const parentId = options.toc?.doNotGenerateParentId 
      ? '' : item.subHeadings && isSummary ? uid() : '';
    const dataParentId = parentId 
      ? `data-parent-id="${parentId}" ` 
      : '';
    /** To generate a link to the corresponding header in the DOM tree */
    let renderLink = `<a href="${link}" style="cursor: pointer; text-decoration: none;" class="toc-link" value="${value}"`;
    renderLink += dataParentId ? " " + dataParentId : '';
    renderLink += '>';
    if (children?.length) {
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        /** Since a link cannot contain a nested link, all nested links should be replaced with <span>...</span> */
        if (child.type === 'link_open') {
          renderLink += '<span>';
          continue;
        }
        if (child.type === 'link_close') {
          renderLink += '</span>';
          continue;
        }
        renderLink += slf.renderInline([child], options, env)
      }
    } else {
      renderLink += content;
    }
    renderLink += '</a>';
    if (item.subHeadings) {
      /** Generating a nested list for nested headers */
      res += renderSub(renderLink, item.subHeadings, parentId, options, env, slf)
    } else {
      res += renderLink;
    }
    res += '</li>';
  }
  res += '</ul>';
  return res;
};

export interface ITocItem {
  level: number,
  link: string,
  value: string,
  content: string,
  children?: Array<Token>,
  subHeadings?: Array<Token>
}

export interface ITocData {
  index: number, /** Index of the token in the array of tokens for building nested headers */
  tocList: Array<ITocItem>
}

let slugsTocItems = {};
export const clearSlugsTocItems = () => {
  slugsTocItems = {};
};
/**
 * The function loops through an array of tokens and returns the list needed to render toc.
 * The resulting list is grouped by heading nesting levels.
 * */
const getTocList = (pos: number, tokens: TokenList, options, levelSub = -1, env, slf): ITocData => {
  let 
    subHeadings: Array<ITocItem>,
    size: number = tokens.length,
    i: number = pos;
  const tocList: Array<ITocItem> = [];
  let tocItem: ITocItem = null;
  let currentLevel = 0;
  while(i < size) {
    let token: Token = tokens[i];
    let heading: Token = tokens[i - 1];
    let heading_open: Token = tokens[i - 2];
    let level: number = token.envLevel 
      ? token.envLevel 
      : token.tag && parseInt(token.tag.substr(1, 1));
    if ((token.type !== 'heading_close' && token.type !== 'addcontentsline_close') 
      || options.includeLevel.indexOf(level) == -1 || !types.includes(heading.type)) {
      i++;
      continue;
    }
    let heading_id: string = '';
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
    } else {
      if (level > currentLevel) {
        const dataSubToc: ITocData = getTocList(i, tokens, options, level, env, slf);
        subHeadings = dataSubToc ? dataSubToc.tocList : [];
        i = dataSubToc.index;
        const last: ITocItem = tocList[tocList.length - 1];
        if (last && subHeadings?.length) {
          if (last.subHeadings?.length) {
            last.subHeadings = last.subHeadings.concat(subHeadings)
          } else {
            last.subHeadings = subHeadings
          }
        }
        subHeadings = [];
        continue;
      }
      if (level < currentLevel) {
        if (levelSub === currentLevel) {
          break
        }
      }
    }

    let slugifiedContent: string = heading_id !== '' 
      ? heading_id 
      : uniqueSlug(slugify(heading.content), slugsTocItems);
    let link: string = "#" + slugifiedContent;

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
    index: i, /** Index of the token in the array of tokens for building nested headers */
    tocList: tocList
  };
};

const mapping = {
  toc_open: "toc_open",
  toc_close: "toc_close",
  toc_body: "toc_body",
};

export default (md: MarkdownIt, opts) => {
  clearSlugsTocItems();
  Object.assign(md.options, defaults, opts);
  // Catch all the tokens for iteration later
  md.core.ruler.push('grab_state', (state) => {
    gstate = state;
  });

  // Insert TOC
  md.inline.ruler.after('emphasis', 'toc', toc);
  md.inline.ruler.push('tocHide', tocHide);

  Object.keys(mapping).forEach(key => {
    md.renderer.rules[key] = (tokens, idx, options, env, slf) => {
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
    }
  });
};

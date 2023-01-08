// import { MarkdownIt, RuleInline, Token, TokenList, Renderer } from 'markdown-it';
// import { slugify, tocRegexp, uniqueSlug } from './common';
// import { TTocStyle } from '../mathpix-markdown-model';
// import { uid } from './utils';
//
// let gstate;
//
// const defaults = {
//   includeLevel: [ 1, 2, 3, 4, 5, 6 ]
// };
//
// const toc: RuleInline = (state, silent) => {
//   let token: Token;
//   let match: RegExpExecArray;
//   let matchFilter: Array<string>;
//   if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */ ) {
//     return false;
//   }
//
//   if (silent) {
//     return false;
//   }
//
//   match = tocRegexp.exec(state.src.substr(state.pos));
//   matchFilter = !match ? [] : match.filter(function(m) { return m; });
//   if (matchFilter.length < 1) {
//     return false;
//   }
//   const newline: number = state.src.indexOf('\n', state.pos);
//
//   token        = state.push('toc_open', 'toc', 1);
//   token.markup = '[[toc]]';
//   token        = state.push('toc_body', '', 0);
//   token        = state.push('toc_close', 'toc', -1);
//   state.pos    = newline !== -1 ? newline : state.pos + state.posMax + 1;
//
//   return true;
// };
//
// const tocHide: RuleInline = (state, silent) => {
//   // let token: Token;
//   let match: RegExpExecArray;
//   let matchFilter: Array<string>;
//   if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */ ) {
//     return false;
//   }
//
//   if (silent) {
//     return false;
//   }
//
//   match = tocRegexp.exec(state.src.substr(state.pos));
//   matchFilter = !match ? [] : match.filter(function(m) { return m; });
//   if (matchFilter.length < 1) {
//     return false;
//   }
//   const newline: number = state.src.indexOf('\n', state.pos);
//
//   state.pos = newline !== -1 ? newline : state.pos + state.posMax + 1;
//   return true;
// };
//
// const renderTocOpen: Renderer = () => {
//   return `<div class="table-of-contents" style="display: none"}}>`;
// };
//
// const renderTocClose: Renderer = () => {
//   return `</div>`;
// };
//
// const renderTocBody: Renderer = (tokens, index, options, env, slf) => {
//   const { toc = {} } = options;
//   const { style = 'list' } = toc;
//   const isSummary = style === TTocStyle.summary;
//
//   return isSummary
//     ? renderTocAsSummary(0, gstate.tokens, options, env, slf)
//     : renderChildsTokens(0, gstate.tokens, options, -1, env, slf)[1];
// };
//
// const types: string[] = [
//   'inline',
//   'title',
//   'section',
//   'subsection',
//   'subsubsection'
// ];
//
// const renderSub = (content, sunList, parentId, options, env, slf) => {
//   let res = '';
//   if (!sunList || !sunList.length) {
//     return res;
//   }
//   res += parentId
//     ? `<details id="${parentId}"><summary>`
//     : `<details><summary>`;
//   res += content;
//   res += '</summary>';
//   res += renderList(sunList, options, env, slf);
//   res += '</details>';
//   return res;
// };
//
// const renderList = (tocList, options, env, slf) => {
//   let res = '';
//   if (!tocList || !tocList.length) {
//     return res;
//   }
//   console.log("[MMD]=>tocList=>", [...tocList]);
//   res += '<ul>';
//   for ( let i = 0; i < tocList.length; i++) {
//     const item = tocList[i];
//     const { level, link, value, content, children = []} = item;
//
//     res += `<li class="toc-title-${level}">`;
//
//     const parentId = options.toc?.doNotGenerateParentId
//       ? ''
//       : item.subHeadings ? uid() : '';
//     const dataParentId = parentId
//       ? `data-parent-id="${parentId}" `
//       : '';
//     console.log("[MMD]=>renderList=>options=>", {...options})
//     console.log("[MMD]=>children=>", [...children]);
//     let renderLink = `<a href="${link}" style="cursor: pointer; text-decoration: none;" class="toc-link" value="${value}" ${dataParentId}>`;
//     // renderLink += children?.length ?  slf.renderInline(children, options, env) : content;
//     if (children?.length) {
//       for (let j = 0; j < children.length; j++) {
//         const child = children[j];
//         if (child.type === 'link_open') {
//           renderLink += '<span>';
//           continue;
//         }
//         if (child.type === 'link_close') {
//           renderLink += '</span>';
//           continue;
//         }
//         renderLink += slf.renderInline([child], options, env)
//       }
//     } else {
//       renderLink += content;
//     }
//
//     renderLink += '</a>';
//
//     if (item.subHeadings) {
//       res += renderSub(renderLink, item.subHeadings, parentId, options, env, slf)
//     } else {
//       res += renderLink;
//     }
//     res += '</li>';
//   }
//
//   res += '</ul>';
//   return res;
// };
//
// const renderTocAsSummary = (pos: number, tokens: TokenList, options, env, slf) => {
//   let res: string = '';
//   const dataToc: ITocData = getTocList(0, gstate.tokens, options,-1, env, slf);
//
//   if (!dataToc || !dataToc.tocList?.length) {
//     return res;
//   }
//   res = renderList(dataToc.tocList, options, env, slf);
//   return res;
// };
//
// const renderTocAsList = (pos: number, tokens: TokenList, options, env, slf) => {
//   let res: string = '';
//   const dataToc: ITocData = getTocList(0, gstate.tokens, options,-1, env, slf);
//
//   if (!dataToc || !dataToc.tocList?.length) {
//     return res;
//   }
//   res = renderList(dataToc.tocList, options, env, slf);
//   return res;
// };
//
//
//
// const renderChildsTokens = (pos: number, tokens: TokenList, options, levelSub = -1, env, slf) => {
//   const slugs = {};
//   let headings: Array<string> = [],
//     buffer: string = '',
//     currentLevel: number,
//     subHeadings,
//     size: number = tokens.length,
//     i: number = pos;
//
//   while(i < size) {
//     let token: Token = tokens[i];
//
//     let heading: Token = tokens[i - 1];
//     let heading_open: Token = tokens[i - 2];
//     let level: number = token.tag && parseInt(token.tag.substr(1, 1));
//     if (token.type !== 'heading_close' || options.includeLevel.indexOf(level) == -1 || !types.includes(heading.type)) {
//       i++;
//       continue;
//     }
//     let dataUnnumbered = token.attrGet('data-unnumbered');
//     if (token.type === 'heading_close' && dataUnnumbered === "true") {
//       i++;
//       continue;
//     }
//     let heading_id: string = '';
//
//     if (heading_open && heading_open.type === 'heading_open') {
//       heading_id = heading_open.attrGet('id');
//     }
//
//     if (!currentLevel) {
//       currentLevel = level;
//     } else {
//       if (level > currentLevel) {
//         subHeadings = renderChildsTokens(i, tokens, options, level, env, slf);
//         buffer += subHeadings[1];
//         i = subHeadings[0];
//         continue;
//       }
//       if (level < currentLevel) {
//         if (levelSub === currentLevel) {
//           break
//         }
//       }
//
//       if (level < currentLevel) {
//         // Finishing the sub headings
//         buffer += `</li>`;
//         headings.push(buffer);
//         console.log("1 [MMD] => headings=>", [...headings])
//         // return [i, `<ul>${headings.join('')}</ul>`];
//       }
//       if (level == currentLevel) {
//         // Finishing the sub headings
//         buffer += `</li>`;
//         headings.push(buffer);
//       }
//     }
//
//     let slugifiedContent: string = heading_id !== '' ? heading_id : uniqueSlug(slugify(heading.content), slugs);
//     let link: string = "#"+slugifiedContent;
//
//     buffer = `<li class="toc-title-${level}"><a href="${link}" style="cursor: pointer; text-decoration: none;" class="toc-link" value="${slugifiedContent}">`;
//     if (heading.children?.length) {
//       for (let j = 0; j < heading.children.length; j++) {
//         const child = heading.children[j];
//         if (child.type === 'link_open') {
//           buffer += '<span>';
//           continue;
//         }
//         if (child.type === 'link_close') {
//           buffer += '</span>';
//           continue;
//         }
//         buffer += slf.renderInline([child], options, env)
//       }
//     } else {
//       buffer += heading.content;
//     }
//     // buffer += heading.content;
//     console.log("[MMD]=>renderChildsTokens=>heading.children=>", [...heading.children])
//     // buffer += heading.children?.length ?  slf.renderInline(heading.children, options, env) : heading.content;
//     buffer += `</a>`;
//     i++;
//   }
//   buffer += buffer === '' ? '' : `</li>`;
//   headings.push(buffer);
//   console.log("2 [MMD] => headings=>", [...headings])
//   return [i, `<ul>${headings.join('')}</ul>`];
// };
//
// export interface ITocItem {
//   level: number,
//   link: string,
//   value: string,
//   content: string,
//   children?: Array<Token>,
//   subHeadings?: Array<Token>
// }
//
// export interface ITocData {
//   index: number, /** Index of the token in the array of tokens for building nested headers */
//   tocList: Array<ITocItem>
// }
//
// /**
//  * The function loops through an array of tokens and returns the list needed to render toc.
//  * The resulting list is grouped by heading nesting levels.
//  * */
// const getTocList = (pos: number, tokens: TokenList, options, levelSub = -1, env, slf): ITocData => {
//   const slugs = {};
//   let
//     subHeadings: Array<ITocItem>,
//     size: number = tokens.length,
//     i: number = pos;
//   const tocList: Array<ITocItem> = [];
//   let tocItem: ITocItem = null;
//   let currentLevel = 0;
//   while(i < size) {
//     let token: Token = tokens[i];
//     let heading: Token = tokens[i - 1];
//     let heading_open: Token = tokens[i - 2];
//     let level: number = token.tag && parseInt(token.tag.substr(1, 1));
//     if (token.type !== 'heading_close' || options.includeLevel.indexOf(level) == -1 || !types.includes(heading.type)) {
//       i++;
//       continue;
//     }
//     let dataUnnumbered = token.attrGet('data-unnumbered');
//     if (token.type === 'heading_close' && dataUnnumbered === "true") {
//       i++;
//       continue;
//     }
//     let heading_id: string = '';
//
//     if (heading_open && heading_open.type === 'heading_open') {
//       heading_id = heading_open.attrGet('id');
//     }
//
//     if (!currentLevel) {
//       currentLevel = level;
//     } else {
//       if (level > currentLevel) {
//         const dataSubToc: ITocData = getTocList(i, tokens, options, level, env, slf);
//         subHeadings = dataSubToc ? dataSubToc.tocList : [];
//         i = dataSubToc.index;
//         const last: ITocItem = tocList[tocList.length - 1];
//         if (last && subHeadings?.length) {
//           if (last.subHeadings?.length) {
//             last.subHeadings = last.subHeadings.concat(subHeadings)
//           } else {
//             last.subHeadings = subHeadings
//           }
//         }
//         subHeadings = [];
//         continue;
//       }
//       if (level < currentLevel) {
//         if (levelSub === currentLevel) {
//           break
//         }
//       }
//     }
//
//     let slugifiedContent: string = heading_id !== '' ? heading_id : uniqueSlug(slugify(heading.content), slugs);
//     let link: string = "#" + slugifiedContent;
//
//     tocItem = {
//       level: level,
//       link: link,
//       value: slugifiedContent,
//       content: heading.content,
//       children: heading.children
//     };
//     tocList.push(tocItem);
//     currentLevel = level;
//     i++;
//   }
//   return {
//     index: i, /** Index of the token in the array of tokens for building nested headers */
//     tocList: tocList
//   };
// };
//
// const mapping = {
//   toc_open: "toc_open",
//   toc_close: "toc_close",
//   toc_body: "toc_body",
// };
//
// export default (md: MarkdownIt, opts) => {
//   Object.assign(md.options, defaults, opts);
//   // const options = Object.assign({}, defaults, opts);
//   console.log("1 [MMD]=>toc=>opts=>", {...opts})
//   // Catch all the tokens for iteration later
//   md.core.ruler.push('grab_state', (state) => {
//     gstate = state;
//   });
//
//   // Insert TOC
//   md.inline.ruler.after('emphasis', 'toc', toc);
//   md.inline.ruler.push('tocHide', tocHide);
//
//   Object.keys(mapping).forEach(key => {
//     md.renderer.rules[key] = (tokens, idx, options, env, slf) => {
//       switch (tokens[idx].type) {
//         case "toc_open":
//           return renderTocOpen();
//         case "toc_close":
//           return renderTocClose();
//         case "toc_body":
//           return renderTocBody(tokens, idx, options, env, slf);
//         default:
//           return '';
//       }
//     }
//   });
// };
//# sourceMappingURL=test.js.map
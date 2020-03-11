import { MarkdownIt, RuleInline, Token } from 'markdown-it';
import { Lists } from './md-block-rule/lists';
import {PREVIEW_LINE_CLASS, PREVIEW_PARAGRAPH_PREFIX} from "./rules";

const mapping = {
  itemize_list_open: "itemize_list_open",
  enumerate_list_open: "enumerate_list_open",
  itemize_list_close: "itemize_list_close",
  enumerate_list_close: "enumerate_list_close",
  list_item_open: "list_item_open",
  item_inline: "item_inline"
};

var level_itemize = 0;
var level_enumerate = 0;
const itemizeLevel = ['•', '–', '*', '·'];
const enumerateLevel = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha']

const list_injectLineNumbers = (tokens, idx, className = '') => {
  let line, endLine, listLine;
  if (tokens[idx].map) {
    line = tokens[idx].map[0];
    endLine = tokens[idx].map[1];
    listLine = [];
    for (let i = line; i < endLine; i++) {
      listLine.push(i);
    }
    tokens[idx].attrJoin("class", className + ' ' + PREVIEW_PARAGRAPH_PREFIX + String(line)
      + ' ' + PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
    tokens[idx].attrJoin("data_line_start", `${String(line)}`);
    tokens[idx].attrJoin("data_line_end", `${String(endLine)}`);
    tokens[idx].attrJoin("data_line", `${String([line, endLine])}`);
    tokens[idx].attrJoin("count_line", `${String(endLine-line + 1)}`);

  }
};

const render_itemize_list_open = (tokens, index, renderer) => {
  if (tokens[index].level === 0) {
    level_itemize = 0
  }
  level_itemize++;
   list_injectLineNumbers(tokens, index, "itemize");
   return `<ul ${renderer.renderAttrs(tokens[index])} style="list-style-type: none">`;
};

const render_enumerate_list_open = (tokens, index, renderer) => {
  if (tokens[index].level === 0) {
    level_enumerate = 0
  }
  level_enumerate++;
  const str = enumerateLevel.length >= level_enumerate ? enumerateLevel[level_enumerate-1] : 'decimal';
   list_injectLineNumbers(tokens, index, `enumerate ${str}`);
   return `<ol ${renderer.renderAttrs(tokens[index])} style=" list-style-type: ${str}" >`;
};

const render_list_item_open = (tokens, index, renderer) => {
  if (tokens[index].parentType === "itemize") {
    const str = level_itemize >0 && itemizeLevel.length >= level_itemize ? itemizeLevel[level_itemize-1] : '.';
    list_injectLineNumbers(tokens, index, `li_itemize`);
    return `<li ${renderer.renderAttrs(tokens[index])}  ><span>${str}</span>`;
  } else {
     list_injectLineNumbers(tokens, index, `li_enumerate`);
     return `<li ${renderer.renderAttrs(tokens[index])}  >`;
  }
};

const render_item_inline = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  let sContent = '';
  let content = '';
  for (let i = 0; i < token.children.length; i++) {
    const tok = token.children[i]
    if (tok.children) {
      content = slf.renderInline(tok.children, options);
    } else {
      content = slf.renderInline([tok], options);
    }
    sContent +=  content
  }
  if (tokens[index].parentType !== "itemize" && tokens[index].parentType !== "enumerate") {
    return `<li>${sContent}</li>`;
  }

  if (tokens[index].parentType === "enumerate") {
    list_injectLineNumbers(tokens, index, `li_enumerate`);
    return `<li ${slf.renderAttrs(tokens[index])} >${sContent}</li>`;
  } else {
    const str = level_itemize > 0 && itemizeLevel.length >= level_itemize ? itemizeLevel[level_itemize-1] : '.';
    list_injectLineNumbers(tokens, index, `li_itemize`);
    return `<li ${slf.renderAttrs(tokens[index])} ><span class="li_level">${str}</span>${sContent}</li>`;
  }
};

const render_itemize_list_close = () => {
  level_itemize--;
  return `</ul>`;
};

const render_enumerate_list_close = () => {
  level_enumerate--;
  return `</ol>`;
};

const textModeObj = {
  "textasciicircum": "\u02C6",
  "textless": "\u003C",
  "textasciitilde": "\u0303",
  "textordfeminine": "\u00AA",//a
  "textasteriskcentered": "\u2217",
  "textordmasculine": "\u00B0",//o
  "textbackslash": "\u005C",//\
  "textparagraph": "\u00B6",//¶
  "textbar": "\u007C",//|
  "textperiodcentered": "\u00B7",//·
  "textbraceleft": "\u007B",//{
  "textquestiondown": "\u00BF",//¿
  "textbraceright": "\u007D",//}
  "textquotedblleft": "\u201C",//“
  "textbullet": "\u2022",//•
  "textquotedblright": "\u201D",//”
  "textcopyright": "\u00A9",//©
  "textquoteleft": "\u2018",//‘
  "textdagger": "\u2020",//†
  "textquoteright": "\u2019",//’
  "textdaggerdbl": "\u2021",//‡
  "textregistered": "\u00AE",//©
  "textdollar": "\u0024",//$
  "textsection": "\u00A7",//§
  "textellipsis": "\u00B7\u00B7\u00B7",//. . .
  "ldots": "\u00B7\u00B7\u00B7",//. . .
  "textsterling": "\u00A3",//£
  "textemdash": "\u2014",//—
  "texttrademark": "TM",//TM
  "textendash": "\u2013",//–
  "textunderscore": "\u002D",//-
  "textexclamdown": "\u00A1",//¡
  "textvisiblespace": "\u02FD",//˽
  "textgreater": "\u003E",//>
};

const textMode: RuleInline = (state, silent) => {
  let token: Token;
  let match: RegExpExecArray;
  let startMathPos: number = state.pos;

  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */ ) {
    return false;
  }
  if (silent) {
    return false;
  }

  const textModeRegexp = new RegExp(Object.keys(textModeObj).join('|'));
  match = state.src
    .slice(++startMathPos)
    .match(textModeRegexp);
  if (!match){ return false}
  token = state.push('text', '', 0);
  token.content = textModeObj[match[0]];
  state.pos = startMathPos + match.index + match[0].length;

  return true
};

const listItemInline: RuleInline = (state, silent) => {
  let token: Token;
  let match: RegExpExecArray;
  let startMathPos: number = state.pos;

  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */ ) {
    return false;
  }
  if (silent) {
    return false;
  }

  match = state.src
    .slice(++startMathPos)
    .match(/^(?:item)/);
  if (!match){ return false}
  let endIndex = state.src.indexOf('\\item', startMathPos + match.index + match[0].length);
  let content = endIndex > 0
    ? state.src.slice(startMathPos + match.index + match[0].length, endIndex)
    : state.src.slice(startMathPos + match.index + match[0].length)


  token        = state.push('item_inline', 'li', 0);
  token.parentType = state.parentType;
  let children = [];
  state.md.inline.parse(content.trim(), state.md, state.env, children);
  token.children = children;
  state.pos = startMathPos + match.index + match[0].length + content.length;
  return true
};

export default (md: MarkdownIt, options) => {
  Object.assign(md.options, options);
  md.block.ruler.after("list","Lists", Lists, options);
  md.inline.ruler.before('escape', 'list_item_inline', listItemInline);
  md.inline.ruler.after('list_item_inline', 'textMode', textMode);


  Object.keys(mapping).forEach(key => {
    md.renderer.rules[key] = (tokens, idx, options, env, slf) => {
      switch (tokens[idx].type) {
        case "itemize_list_open":
          return render_itemize_list_open(tokens, idx, slf);
        case "enumerate_list_open":
          return render_enumerate_list_open(tokens, idx, slf);
        case "list_item_open":
          return render_list_item_open(tokens, idx, slf);
        case "item_inline":
          return render_item_inline(tokens, idx, options, env, slf);
        case "itemize_list_close":
          return render_itemize_list_close();
        case "enumerate_list_close":
          return render_enumerate_list_close();
        default:
          return '';
      }
    }
  });
}

import { RuleBlock, Token } from 'markdown-it';
import {SetItemizeLevelTokens, GetItemizeLevelTokensByState, GetEnumerateLevel} from "./re-level";
export enum TBegin {itemize = 'itemize', enumerate = 'enumerate'};
const openTag: RegExp = /\\begin\s{0,}\{(itemize|enumerate)\}/;
export const bItemTag: RegExp = /^(?:item\s{0,}\[([^\]]*)\]|item)/;
const closeTag: RegExp = /\\end\s{0,}\{(itemize|enumerate)\}/;

const setTokenListItemOpenBlock = (state, startLine, endLine, marker, li, iLevel, eLevel) => {
  let token;
  token        = state.push('latex_list_item_open', 'li', 1);
  token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
  if (marker) {
    token.marker = marker;
    let chMarker = [];
    state.md.inline.parse(marker, state.md, state.env, chMarker);
    token.markerTokens = chMarker;
  }
  if (li && li.value) {
    token.startValue = li.value;
    token.attrSet('value', li.value.toString())
    li = null;
  }
  token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
  token.parentStart = state.startLine;

  token.map = [startLine, endLine ];
  token.prentLevel = state.prentLevel;
  token.itemizeLevel = iLevel;
  token.enumerateLevel = eLevel;
};

const SetTokensBlockParse = (state, content, startLine?, endLine?) => {
  let token;
  let children = [];
  state.md.block.parse(content, state.md, state.env, children);

  for (let j = 0; j < children.length; j++) {
    const child = children[j];
    token = state.push(child.type, child.tag, child.nesting);
    token.attrs = child.attrs;
    if (startLine && endLine) {
      token.map = [startLine, endLine];
    }
    token.content = child.content;
    token.children = child.children;
  }
};

const ListItemsBlock = (state, items) => {
  if (items && items.length > 0) {
    if (items && items.length > 0) {
      items.forEach(item => {
        SetTokensBlockParse(state, item.content.trim(), item.startLine, item.endLine + 1)
      })
    }
  }
};

const ListItems = (state, items, iLevel, eLevel, li, iOpen) => {
  let token;
  const blockStartTag: RegExp = /\\begin{(center|left|right|table|figure|tabular)}/;
  if (items && items.length > 0) {
    if (items && items.length > 0) {
      items.forEach(item => {
        let children = [];
        state.env.parentType = state.parentType;
        state.env.isBlock = true;
        item.content = item.content.trim();
        if (blockStartTag.test(item.content) || (item.content.indexOf('`') > -1) //&& item.content.charCodeAt(0) === 0x5c /* \ */
        ) {
          let match = item.content.slice(1).match(bItemTag);
          if (match) {
            setTokenListItemOpenBlock(state, item.startLine, item.endLine + 1, match[1], li, iLevel, eLevel);
            if (li && li.value) {
              li = null;
            }

            SetTokensBlockParse(state, item.content.slice(match.index + match[0].length + 1).trim())

            token = state.push('latex_list_item_close', 'li', -1);
            return
          }
        }
        state.md.inline.parse(item.content.trim(), state.md, state.env, children);

        for (let j = 0; j < children.length; j++) {
          const child = children[j];
          if (child.type === "setcounter") {
            li = {value: child.content};
            continue;
          }
          token = state.push(child.type, child.tag, 1);
          token.attrs = child.attrs;
          if (child.type === "item_inline" && li && li.value) {
            token.startValue = li.value;
            token.attrSet('value', li.value.toString())
            li = null;
          }
          if (child.marker) {
            token.marker = child.marker;
            token.markerTokens = child.markerTokens;
          }
          token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
          token.parentStart = state.startLine;

          token.map = [item.startLine, item.endLine + 1];
          token.content = child.content;
          token.children = child.children;
          token.prentLevel = state.prentLevel;
          if (child.type === "item_inline") {
            token.prentLevel = state.prentLevel + 1;
          }

          if (child.type === "enumerate_list_open" || child.type === "itemize_list_open") {
            state.prentLevel++;
            if (child.type === "itemize_list_open") {
              state.types.push('itemize');
            } else {
              state.types.push('enumerate');
            }
            iOpen++;
          }
          if (child.type === "enumerate_list_close" || child.type === "itemize_list_close") {
            state.prentLevel--;
            if (state.types && state.types.length > 0) {
              state.types.pop();
            }
            iOpen--;
          }


          token.itemizeLevel = iLevel;
         // token.itemizeLevelTokens = iLevelTokens;
          token.enumerateLevel = eLevel;
        }
        state.env.isBlock = false;
      })
    }
  }
  return iOpen;
};

const setTokenOpenList = (state, startLine, endLine, type, iLevel, eLevel) => {
  let token: Token;
  if (type === TBegin.itemize) {
    token        = state.push('itemize_list_open', 'ul', 1);
    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
    state.parentType = 'itemize';
    if (state.types && state.types.length > 0){
      state.types.push('itemize');
    } else {
      state.types = ['itemize'];
    }
  } else {
    token        = state.push('enumerate_list_open', 'ol', 1);
    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
    state.parentType = 'enumerate';
    if (state.types && state.types.length > 0){
      state.types.push('enumerate');
    } else {
      state.types = ['enumerate'];
    }
  }
  token.itemizeLevel = iLevel;
  token.enumerateLevel = eLevel;
  token.prentLevel = state.prentLevel;
  if (startLine > -1 && endLine > -1) {
    state.startLine = startLine;
    token.map    = [ startLine, endLine ];
  }
  return token;
};

const setTokenCloseList = (state, startLine, endLine) => {
  let token: Token;
  if (state.types && state.types.length > 0 && state.types[state.types.length - 1] === TBegin.itemize) {
    token        = state.push('itemize_list_close', 'ul', -1);
    token.map    = [ startLine, endLine];
  } else {
    token        = state.push('enumerate_list_close', 'ol', -1);
    token.map    = [ startLine, endLine ];
  }
  token.level -= 1;
  state.level -= 1;
  state.prentLevel = state.prentLevel > 0 ? state.prentLevel - 1 : 0;
  token.prentLevel = state.prentLevel;
  state.types.pop()
};

const ListOpen = (state, startLine, lineText, iLevel, eLevel): {iOpen: number, tokenStart: Token|null, li? } => {
  let token: Token, tokenStart: Token|null = null;
  let iOpen: number = 0;
  let li = null;
  if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
    return {iOpen: iOpen, tokenStart: tokenStart};
  }

  let match:RegExpMatchArray = lineText.match(openTag);
  if (!match && (state.parentType !== 'itemize' && state.parentType !== 'enumerate')) {
    return {iOpen: iOpen, tokenStart: tokenStart};
  }
  SetItemizeLevelTokens(state)

  if (match) {
    const strAfter = lineText.slice(match.index + match[0].length);
    const type = match[1].trim() in TBegin ? match[1].trim() : null;
    if (!type) {
      return {iOpen: iOpen, tokenStart: tokenStart};
    }
    tokenStart = setTokenOpenList (state, startLine, startLine+1, type, iLevel, eLevel);
    iOpen++;

    if (strAfter && strAfter.trim().length > 0) {
      let children = [];
      state.env.parentType = state.parentType;
      state.env.isBlock = true;
      state.md.inline.parse(strAfter, state.md, state.env, children);

      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        if (child.type === "setcounter") {
          li = {value: child.content};
          continue;
        }
        token = state.push(child.type, child.tag, 1);
        token.parentType = state.types && state.types.length >0 ? state.types[state.types.length - 1] : '';
        token.parentStart = state.startLine;

        token.map = [startLine, startLine];
        token.content = child.content;
        token.children = child.children;
        token.itemizeLevel = iLevel;
        token.enumerateLevel = eLevel;
        if (child.type === "enumerate_list_open" || child.type === "itemize_list_open") {
          state.prentLevel++;
          if (child.type === "itemize_list_open") {
            state.types.push('itemize');
          } else {
            state.types.push('enumerate');
          }
          iOpen++;
        }
        if (child.type === "enumerate_list_close" || child.type === "itemize_list_close") {
          state.prentLevel--;
          if (state.types && state.types.length > 0) {
            state.types.pop();
          }
          iOpen--;
        }
        if (child.type === "item_inline") {
          if (li && li.value) {
            token.startValue = li.value;
            token.attrSet('value', li.value.toString())
            li = null;
          }
          token.prentLevel = state.prentLevel + 1;
        } else {
          token.prentLevel = state.prentLevel;
        }
      }
      state.env.isBlock = false;
    }
  }
  return {iOpen: iOpen, tokenStart: tokenStart, li};
};

const ItemsListPush = (items, content, startLine, endLine) => {
  //const itemTag: RegExp = /\\item/;
  const index = content.indexOf('\\item')
  if (index > 0 ) {
    if (content.slice(0, index).indexOf('`') > -1 && content.slice(index).indexOf('`') > -1) {
      if (items.length > 0) {
        const last = items.length-1;
        items[last].content += '\n' + content;
        items[last].endLine += 1;
      } else {
        items.push({content: content, startLine: startLine, endLine: endLine});
      }
      return items;
    }
      if (items.length > 0) {
      const last = items.length-1;
      items[last].content += '\n' + content.slice(0, index);
      items[last].endLine += 1;
    } else {
      items = ItemsListPush(items, content.slice(0, index), startLine, endLine);
    }
    items = ItemsListPush(items, content.slice(index), startLine, endLine);
  } else {
    items.push({content: content, startLine: startLine, endLine: endLine});
  }
  return items;
};

const ItemsAddToPrev = (items, lineText, nextLine) => {
  if (items && items.length > 0) {
    items[items.length-1].content += '\n' + lineText;
    items[items.length-1].endLine = nextLine;
  } else {
    if (!closeTag.test(lineText)) {
      items = ItemsListPush(items, lineText, nextLine, nextLine)
      //     break
    }
  }
  return items;
};

export const ReRenderListsItem:RuleBlock = (state, startLine: number, endLine: number, silent) => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let nextLine: number = startLine + 1;
  let lineText: string = state.src.slice(pos, max);
  let content = lineText;
  if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
    return false;
  }
  let match = lineText.slice(1).match(bItemTag);
  if (!match) {
    return false;
  }
  const eLevel = GetEnumerateLevel();
  const iLevelT = GetItemizeLevelTokensByState(state);
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    content += '\n' + lineText;
  }

  match = content.slice(1).match(bItemTag);
  if (match) {
    setTokenListItemOpenBlock(state, startLine, nextLine + 1, match[1], null, iLevelT, eLevel);
    SetTokensBlockParse(state, content.slice(match.index + match[0].length + 1).trim())
    state.push('latex_list_item_close', 'li', -1);
  }
  state.line = nextLine;
  return true
};

export const Lists:RuleBlock = (state, startLine: number, endLine: number, silent) => {
  const openTag: RegExp = /\\begin\s{0,}\{(itemize|enumerate)\}/;
  const itemTag: RegExp = /\\item/;
  const setcounterTag: RegExp = /^(?:\\setcounter\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/;

  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let nextLine: number = startLine;// + 1;
  let dStart = state.md.options.renderElement && state.md.options.renderElement.startLine
    ? Number(state.md.options.renderElement.startLine)
    : 0;
  let    oldParentType;
  let type: string;
 // let li = null;

  let lineText: string = state.src.slice(pos, max);
  if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
    return false;
  }

  let match:RegExpMatchArray = lineText.match(openTag);
  if (!match) {
    return false;
  }

  const eLevel = GetEnumerateLevel();
  const iLevelT = GetItemizeLevelTokensByState(state);

  oldParentType = state.parentType;
  const data = ListOpen(state, startLine + dStart, lineText, iLevelT, eLevel);
  let {iOpen = 0, tokenStart = null, li = null} = data;
  if (iOpen === 0) {
    nextLine += 1;
    state.line = nextLine;
    state.startLine = '';
    state.parentType = oldParentType;
    state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
    return true
  } else {
    nextLine += 1;
  }
  let items = [];

  let haveClose = false;
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    if (setcounterTag.test(lineText)) {
      match = lineText.match(setcounterTag);
      if (match && state.md.options && state.md.options.forLatex) {
        let token = state.push("setcounter", "", 0);
        token.latex = match[0].trim();
      }
      if (match && match[2]) {
        let sE = match.index + match[0].length < lineText.length
          ?  lineText.slice(match.index + match[0].length)
          : '';
        sE = sE.trim();
        li = {value: match[2]};
        if (sE.length > 0) {
          items = ItemsAddToPrev(items, sE, nextLine);
        }
        continue;
      }
    }
      if (closeTag.test(lineText)) {
        let match:RegExpMatchArray = lineText.match(closeTag);
        if (match) {
          type = match[1].trim() in TBegin ? match[1].trim() : null;
          if (!type) {
            return false;
          }
          let sB = match.index > 0 ? lineText.slice(0, match.index) : '';
          let sE = match.index + match[0].length < lineText.length
            ?  lineText.slice(match.index + match[0].length)
            : '';
          sB = sB.trim();
          sE = sE.trim();
          if (sB.indexOf('`') > -1 && sE.indexOf('`') > -1) {
            items = ItemsListPush(items, lineText, nextLine, nextLine);
            continue;
          }
          if (sB.length > 0) {
            items = ItemsAddToPrev(items, sB, nextLine);
          }
          iOpen = ListItems(state, items, iLevelT, eLevel, li, iOpen);
          items = [];
          li = null;
          setTokenCloseList(state, startLine + dStart, nextLine + dStart)
          if (sE.length > 0) {
            items = ItemsAddToPrev(items, sE, nextLine);
          }
          iOpen--;
          if (iOpen <= 0) {
            haveClose = true;
            nextLine += 1;
            break;
          }
        }
        continue
      }


    if (openTag.test(lineText)) {
      let match:RegExpMatchArray = lineText.match(openTag);
      if (match) {
        type = match[1].trim() in TBegin ? match[1].trim() : null;
        if (!type) {
          return false;
        }
        let sB = match.index > 0 ? lineText.slice(0, match.index) : '';
        let sE = match.index + match[0].length < lineText.length
          ?  lineText.slice(match.index + match[0].length)
          : '';
        sB = sB.trim();
        sE = sE.trim();
        if (sB.indexOf('`') > -1 && sE.indexOf('`') > -1) {
          items = ItemsListPush(items, lineText, nextLine, nextLine);
          continue;
        }
        if (sB.length > 0) {
          items = ItemsAddToPrev(items, sB, nextLine);
        }
        iOpen = ListItems(state, items, iLevelT, eLevel, li, iOpen);
        items = [];
        li = null;
        setTokenOpenList(state, -1, -1, type, iLevelT, eLevel);
        if (sE.length > 0) {
          items = ItemsAddToPrev(items, sE, nextLine);
        }
        iOpen++;
      }

    } else {
      if (itemTag.test(lineText)) {
        items = ItemsListPush(items, lineText.trim(), nextLine+dStart, nextLine+dStart)
      } else {
        items = ItemsAddToPrev(items, lineText, nextLine);
      }
    }
  }


  if (!haveClose) {
    console.log('NOT CLOSE TAG.')
    ListItemsBlock(state, items)
    li = null;
    //return false
  }
  state.line = nextLine;
  state.startLine = '';
  state.parentType = oldParentType;
  state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
  if (tokenStart) {
    tokenStart.map[1] = nextLine + dStart
  }
  return true
};

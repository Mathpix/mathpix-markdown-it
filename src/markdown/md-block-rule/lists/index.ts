import { RuleBlock } from 'markdown-it';
import { SetItemizeLevelTokens, GetItemizeLevelTokensByState, GetEnumerateLevel} from "./re-level";
export enum TBegin {itemize = 'itemize', enumerate = 'enumerate'};
const openTag: RegExp = /\\begin\s{0,}\{(itemize|enumerate)\}/;

const ListItems = (state, items, iLevel, eLevel, li) => {
  let token;
  if (items && items.length > 0) {
    if (items && items.length > 0) {
      items.forEach(item => {
        let children = [];
        state.env.parentType = state.parentType;
        state.env.isBlock = true;
        state.md.inline.parse(item.content.trim(), state.md, state.env, children);
        for (let j = 0; j < children.length; j++) {
          const child = children[j];
          if (child.type === "setcounter") {
            li = {value: child.content};
            continue;
          }
          token = state.push(child.type, child.tag, 1);
          if (child.type === "item_inline" && li && li.value) {
            token.startValue = li.value;
            token.attrs = [
              [ 'value', li.value.toString() ],
            ];
            li = null;
          }
          if (child.marker) {
            token.marker = child.marker;
            token.markerTokens = child.markerTokens;
          }
          token.parentType = state.types[state.types.length - 1];

          token.map = [item.startLine, item.endLine];
          token.content = child.content;
          token.children = child.children;
          token.prentLevel = state.prentLevel;
          if (child.type === "item_inline") {
            token.prentLevel = state.prentLevel + 1;
          }

          token.itemizeLevel = iLevel;
         // token.itemizeLevelTokens = iLevelTokens;
          token.enumerateLevel = eLevel;
        }
        state.env.isBlock = false;
      })
    }
    items=[];
  }
  return items;
};

const setTokenOpenList = (state, startLine, endLine, type, iLevel, eLevel) => {
  // const eLevel = [].concat(enumerateLevel);
  // const iLevel = [].concat(itemizeLevel);
  // const iLevelTokens = GetItemizeLevelTokens();
  let token;
  if (type === TBegin.itemize) {
    token        = state.push('itemize_list_open', 'ul', 1);
    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
    state.parentType = 'itemize';
    state.types = ['itemize'];

  } else {
    token        = state.push('enumerate_list_open', 'ol', 1);
    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
    state.parentType = 'enumerate';
    state.types = ['enumerate'];
  }
  token.map    = [ startLine, endLine ];
  token.itemizeLevel = iLevel;
 // token.itemizeLevelTokens = iLevelTokens;
  token.enumerateLevel = eLevel;
  token.prentLevel = state.prentLevel;
};

const ListOpen = (state, startLine, lineText, iLevel, eLevel) => {
  let token;
  let iOpen = 0;
  if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
    return iOpen;
  }

  let match:RegExpMatchArray = lineText.match(openTag);
  if (!match && (state.parentType !== 'itemize' && state.parentType !== 'enumerate')) {
    return iOpen;
  }

  SetItemizeLevelTokens(state)

  if (match) {
    const strAfter = lineText.slice(match.index + match[0].length);
    const type = match[1].trim() in TBegin ? match[1].trim() : null;
    if (!type) {
      return iOpen;
    }
    setTokenOpenList (state, startLine, startLine, type, iLevel, eLevel);
    iOpen++;

    if (strAfter && strAfter.trim().length > 0) {
      let children = [];
      state.env.parentType = state.parentType;
      state.env.isBlock = true;
      state.md.inline.parse(strAfter, state.md, state.env, children);

      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        token = state.push(child.type, child.tag, 1);
        token.parentType = state.types[state.types.length - 1];

        token.map = [startLine, startLine];
        token.content = child.content;
        token.children = child.children;
        token.itemizeLevel = iLevel;
        token.enumerateLevel = eLevel;
        if (child.type === "enumerate_list_open" || child.type === "itemize_list_open") {
          state.prentLevel++;
          iOpen++;
        }
        if (child.type === "enumerate_list_close" || child.type === "itemize_list_close") {
          state.prentLevel--;
          iOpen--;
        }
        if (child.type === "item_inline") {
          token.prentLevel = state.prentLevel + 1;
        } else {
          token.prentLevel = state.prentLevel;
        }
      }
      state.env.isBlock = false;
    }
  }
  return iOpen;
};



export const Lists:RuleBlock = (state, startLine: number, endLine: number, silent) => {
  const openTag: RegExp = /\\begin\s{0,}\{(itemize|enumerate)\}/;
  const closeTag: RegExp = /\\end\s{0,}\{(itemize|enumerate)\}/;
  const itemTag: RegExp = /\\item/;
  //\setcounter{enumii}{4}
  const setcounterTag: RegExp = /\\setcounter\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\}/;


  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let nextLine: number = startLine;// + 1;
  let token,   oldParentType;
  let iOpen = 0;
  let type: string;
  let li = null;
  startLine = state.line;

  //debugger
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
  iOpen = ListOpen(state, startLine, lineText, iLevelT, eLevel);
  if (iOpen === 0) {
    return  false
  } else {
    nextLine += 1;
  }


  let content = '';
  let items = [];

  let haveClose = false;

  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    if (itemTag.test(lineText)) {
      content = lineText;//.slice(match.index + match[0].length)
      items.push({content: content.trim(), startLine: nextLine, endLine: nextLine});
    }
    if (setcounterTag.test(lineText)) {
      match = lineText.match(setcounterTag);

      if (match && match[2]) {
        li = {value: match[2]};
        continue;
      }
    }

      if (closeTag.test(lineText)) {
        items = ListItems(state, items, iLevelT, eLevel, li);
        li = null;
        if (state.types[state.types.length - 1] === TBegin.itemize) {
          token        = state.push('itemize_list_close', 'ul', -1);
          token.map    = [ startLine, nextLine ];
        } else {
          token        = state.push('enumerate_list_close', 'ol', -1);
          token.map    = [ startLine, nextLine ];
        }
        token.level -= 1;
        state.level -= 1;
        state.prentLevel = state.prentLevel > 0 ? state.prentLevel - 1 : 0;
        token.prentLevel = state.prentLevel;
        state.types.splice(-1,1)
        iOpen--;
        if (iOpen === 0) {
          haveClose = true;
          nextLine += 1;
          break;
        }
      }


    if (openTag.test(lineText) && !itemTag.test(lineText)) {
      items = ListItems(state, items, iLevelT, eLevel, li);
      li = null;
      let match:RegExpMatchArray = lineText.match(openTag);
      if (match) {
        type = match[1].trim() in TBegin ? match[1].trim() : null;
        if (!type) {
          return false;
        }
        if (type === TBegin.itemize) {
          token        = state.push('itemize_list_open', 'ul', 1);
          token.map    = [ startLine, startLine ];
          state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
          state.parentType = 'itemize';
          state.types.push('itemize');

        } else {
          token        = state.push('enumerate_list_open', 'ol', 1);
          token.map    = [ startLine, startLine ];
          state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
          state.parentType = 'enumerate';
          state.types.push('enumerate');
        }
        token.itemizeLevel = iLevelT;
        token.enumerateLevel = eLevel;
        token.prentLevel = state.prentLevel;
        iOpen++;
      }
    } else {
      content += lineText;
      if (!itemTag.test(lineText)) {
        if (items && items.length > 0) {
          items[items.length-1].content += '\n' + lineText;
          items[items.length-1].endLine = nextLine;
        } else {
          if (!closeTag.test(lineText)) {
            console.log('BREAK!!!!')
            items.push({content: lineText, endLine: nextLine})
       //     break
          }
        }
      }

    }
  }


  if (!haveClose) {
    items = ListItems(state, items, iLevelT, eLevel, li);
    li = null;
    //return false
  }
  state.line = nextLine;
  state.startLine = nextLine;
  state.parentType = oldParentType;
  state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
  return true
};

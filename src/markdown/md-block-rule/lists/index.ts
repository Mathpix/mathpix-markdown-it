import { RuleBlock, Token } from 'markdown-it';
import {SetItemizeLevelTokens, GetItemizeLevelTokensByState, GetEnumerateLevel} from "./re-level";
import { SetTokensBlockParse } from"../helper";
import { BEGIN_LST_INLINE_RE, END_LST_INLINE_RE } from "../../common/consts";
export enum TBegin {itemize = 'itemize', enumerate = 'enumerate'};
const openTag: RegExp = /\\begin\s{0,}\{(itemize|enumerate)\}/;
export const bItemTag: RegExp = /^(?:item\s{0,}\[([^\]]*)\]|item)/;
const closeTag: RegExp = /\\end\s{0,}\{(itemize|enumerate)\}/;
export const reNumber: RegExp = /^-?\d+$/;

const setTokenListItemOpenBlock = (state, startLine, endLine, marker, li, iLevel, eLevel, iLevelC) => {
  let token;
  token        = state.push('latex_list_item_open', 'li', 1);
  token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
  if (marker) {
    token.marker = marker;
    let chMarker = [];
    state.md.inline.parse(marker, state.md, state.env, chMarker);
    token.markerTokens = chMarker;
  }
  if (li && li.hasOwnProperty('value')) {
    token.startValue = li.value;
    token.attrSet('value', li.value.toString())
    li = null;
  }
  token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
  token.parentStart = state.startLine;

  token.map = [startLine, endLine ];
  token.prentLevel = state.prentLevel;
  token.itemizeLevel = iLevel;
  token.itemizeLevelContents = iLevelC;
  token.enumerateLevel = eLevel;
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

const ListItems = (state, items, iLevel, eLevel, li, iOpen, iLevelC) => {
  let token;
  const blockStartTag: RegExp = /\\begin{(center|left|right|table|figure|tabular|lstlisting)}/;
  let padding = 0;
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
            setTokenListItemOpenBlock(state, item.startLine, item.endLine + 1, match[1], li, iLevel, eLevel, iLevelC);
            if (li && li.hasOwnProperty('value')) {
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
          if (child.type === "item_inline" 
            && li && li.hasOwnProperty('value')) {
            token.startValue = li.value;
            token.attrSet('value', li.value.toString())
            li = null;
          }
          if (child.hasOwnProperty('marker')) {
            token.marker = child.marker;
            token.markerTokens = child.markerTokens;
            let paddingChild = 0;
            for (let i = 0; i < child.markerTokens?.length; i++) {
              if (child.markerTokens[i].type === 'text') {
                paddingChild += child.markerTokens[i].content.length;
              }
            }
            if (paddingChild > padding) {
              padding = paddingChild;
            }
            
          }
          token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
          token.parentStart = state.startLine;

          token.map = [item.startLine, item.endLine + 1];
          if (child.hasOwnProperty('inlinePos')) {
            token.bMarks = child.inlinePos.start_content
          }
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
          token.itemizeLevelContents = iLevelC;
         // token.itemizeLevelTokens = iLevelTokens;
          token.enumerateLevel = eLevel;
        }
        state.env.isBlock = false;
      })
    }
  }
  return {
    iOpen: iOpen, 
    padding: padding
  };
};

const setTokenOpenList = (state, startLine, endLine, type, iLevel, eLevel, iLevelC) => {
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
  token.itemizeLevelContents = iLevelC;
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

const ListOpen = (state, startLine, lineText, iLevel, eLevel, iLevelC): {iOpen: number, tokenStart: Token|null, li? } => {
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
    tokenStart = setTokenOpenList (state, startLine, startLine+1, type, iLevel, eLevel, iLevelC);
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
        token.itemizeLevelContents = iLevelC;
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
  const dataMarkers = GetItemizeLevelTokensByState(state);
  const iLevelT = dataMarkers.tokens;
  const iLevelC = dataMarkers.contents;
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    content += '\n' + lineText;
  }

  match = content.slice(1).match(bItemTag);
  if (match) {
    setTokenListItemOpenBlock(state, startLine, nextLine + 1, match[1], null, iLevelT, eLevel, iLevelC);
    SetTokensBlockParse(state, content.slice(match.index + match[0].length + 1).trim())
    state.push('latex_list_item_close', 'li', -1);
  }
  state.line = nextLine;
  return true
};

/**
 * Result of handling a potential inline `\begin{lstlisting}` occurrence.
 *
 * @property handled  Whether the current line was handled (matched a begin).
 * @property envDepth Updated lstlisting environment depth after handling.
 * @property items    Aggregated items list (possibly updated).
 * @property lineText The (unchanged) original line text.
 */
interface LstEndResult {
  handled: boolean;
  envDepth: number;
  items: any[];
  lineText: string;
}

/**
 * Try to handle an inline `\begin{lstlisting}` on the given line.
 *
 * Behavior:
 * - If already inside a lstlisting environment (`envDepth > 0`), does nothing.
 * - If a `\begin{lstlisting}` is found:
 *   - Text before the begin is appended either as a new list item (when it matches `itemTag`)
 *     or concatenated to the previous item.
 *   - Sets `envDepth` to 1 (entered lstlisting).
 *   - Appends the substring starting at `\begin{lstlisting}` to the end of the line
 *     as code content in the current item.
 *
 * The function does not mutate inputs; it returns the updated state.
 *
 * @param lineText The full text of the current line.
 * @param envDepth Current lstlisting nesting depth.
 * @param items    Collected items so far (list builder state).
 * @param nextLine The current (next) line index used for item position metadata.
 * @param dStart   Document start line offset to compute absolute positions.
 * @param itemTag  RegExp to detect list item prefixes (e.g., `^\s*\\item`).
 * @returns Updated handling result with flags, depth, items, and original line text.
 */
const handleLstBeginInline = (
  lineText: string,
  envDepth: number,
  items: any[],
  nextLine: number,
  dStart: number,
  itemTag: RegExp
): LstEndResult => {
  // If already inside lstlisting, do nothing.
  if (envDepth > 0) {
    return { handled: false, envDepth, items, lineText };
  }
  const mb: RegExpMatchArray = BEGIN_LST_INLINE_RE.exec(lineText);
  if (!mb) {
    return { handled: false, envDepth, items, lineText };
  }
  const beginIndex: number = mb.index;
  // Is there text BEFORE \begin{lstlisting} ?
  const before: string = lineText.slice(0, beginIndex).trimEnd();
  const afterBegin: string = lineText.slice(beginIndex); // start from \begin...
  // If there was something before begin, it was regular text/part of \item:
  if (before.length > 0) {
    if (itemTag.test(before)) {
      items = ItemsListPush(items, before, nextLine + dStart, nextLine + dStart);
    } else {
      items = ItemsAddToPrev(items, before, nextLine);
    }
  }
  envDepth = 1; //entered lstlisting
  items = ItemsAddToPrev(items, afterBegin, nextLine);//The part from \begin{lstlisting} to the end of the line is considered a code string.
  return { handled: true, envDepth, items, lineText };
}

/**
 * Try to handle an inline `\end{lstlisting}` on the current line.
 *
 * Behavior:
 * - If not inside an lstlisting environment (`envDepth === 0`), does nothing.
 * - If no end marker is found on this line, appends the full line (with original leading whitespace)
 *   to the current item and reports `handled: true` (still inside the env).
 * - If an end marker is present:
 *   - Appends everything up to `\end{...}` (plus the end token itself) to the current item.
 *   - Resets `envDepth` to 0 (leaves lstlisting).
 *   - If there is trailing text after the end token, returns it in `lineText` so the caller
 *     can continue processing the remainder of the line; otherwise returns an empty `lineText`.
 *
 * The function does not mutate inputs; it returns the updated state.
 *
 * @param lineText Current line text (may contain `\end{lstlisting}`).
 * @param envDepth Current lstlisting nesting depth (0 if outside).
 * @param items    Accumulated items list (list builder state).
 * @param nextLine Line index used for item position metadata.
 * @param state    Markdown-It state (used to read the original line with indentation).
 * @returns Updated result with flags, depth, items, and remaining line text (if any).
 */
const handleLstEndInline = (
  lineText: string,
  envDepth: number,
  items: any[],
  nextLine: number,
  state
): LstEndResult => {
  // If we are not inside lstlisting, we exit
  if (envDepth === 0) {
    return { handled: false, envDepth, items, lineText };
  }
  const me: RegExpMatchArray = END_LST_INLINE_RE.exec(lineText);
  if (!me) {
    // There is no end of environment - just add the line as is
    lineText = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]); // It is important to take into account the leading whitespace characters.
    items = ItemsAddToPrev(items, lineText, nextLine);
    return { handled: true, envDepth, items, lineText };
  }
  // There is an end of environment in this line
  const endIndex: number = me.index;
  const endToken: string = lineText.slice(endIndex, endIndex + me[0].length);
  const beforeEnd: string = lineText.slice(0, endIndex);
  const afterEnd: string = lineText.slice(endIndex + me[0].length);
  // Everything up to \end{...} is a continuation of the code
  if (beforeEnd.length > 0) {
    items = ItemsAddToPrev(items, beforeEnd + '\n' + endToken, nextLine);
  } else {
    items = ItemsAddToPrev(items, endToken, nextLine);
  }
  envDepth = 0; // Exit lstlisting
  if (!afterEnd?.trim()?.length) {
    return { handled: true, envDepth, items, lineText: '' };
  }
  return { handled: false, envDepth, items, lineText: afterEnd };
}

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
  const dataMarkers = GetItemizeLevelTokensByState(state);
  const iLevelT = dataMarkers.tokens;
  const iLevelC = dataMarkers.contents;

  oldParentType = state.parentType;
  const data = ListOpen(state, startLine + dStart, lineText, iLevelT, eLevel, iLevelC);
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
  let envDepth: number = 0; // >0 — we are in the code environment
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    // 1) If you are NOT currently inside lstlisting, first search for \begin{lstlisting}
    if (envDepth === 0) {
      const beginRes: LstEndResult = handleLstBeginInline(lineText, envDepth, items, nextLine, dStart, itemTag);
      envDepth = beginRes.envDepth;
      if (beginRes.handled) {
        continue; // this line is already fully processed
      }
      lineText = beginRes.lineText;
    }
    // 2) If we are inside lstlisting, we search for \end{lstlisting}
    if (envDepth > 0) {
      const endRes: LstEndResult = handleLstEndInline(lineText, envDepth, items, nextLine, state);
      envDepth = endRes.envDepth;
      items = endRes.items;
      if (endRes.handled) {
        continue;
      }
      lineText = endRes.lineText;
    }

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
        let startNumber = match[2]?.trim() && reNumber.test(match[2].trim()) 
          ? Number(match[2].trim()) + 1 : 1;
        li = {value: startNumber};
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
          let dataItems = ListItems(state, items, iLevelT, eLevel, li, iOpen, iLevelC);
          iOpen = dataItems.iOpen;
          if (!tokenStart.padding || tokenStart.padding < dataItems.padding) {
            tokenStart.padding = dataItems.padding;
            if (tokenStart.padding > 3) {
              tokenStart.attrSet('data-padding-inline-start', (tokenStart.padding * 14).toString())
            }
          }
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
        let dataItems = ListItems(state, items, iLevelT, eLevel, li, iOpen, iLevelC);
        iOpen = dataItems.iOpen;
        if (!tokenStart.padding || tokenStart.padding < dataItems.padding) {
          tokenStart.padding = dataItems.padding
          if (tokenStart.padding > 3) {
            tokenStart.attrSet('data-padding-inline-start', (tokenStart.padding * 14).toString())
          }
        }
        items = [];
        li = null;
        setTokenOpenList(state, -1, -1, type, iLevelT, eLevel, iLevelC);
        if (sE.length > 0) {
          items = ItemsAddToPrev(items, sE, nextLine);
        }
        iOpen++;
      }

    } else {
      if (itemTag.test(lineText)) {
        items = ItemsListPush(items, lineText, nextLine+dStart, nextLine+dStart)
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

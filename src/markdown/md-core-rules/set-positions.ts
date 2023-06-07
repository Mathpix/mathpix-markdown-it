import { highlightMathToken } from "../highlight/highlight-math-token";
import { sortHighlights, getStyleFromHighlight } from "../highlight/common";
import { mathTokenTypes } from "../common/consts";

const setChildrenPositions = (state, token, pos, highlights, isBlockquote = false) => {
  if (token.hasOwnProperty('offsetLeft')) {
    pos += token.offsetLeft;
  }
  let start_content = pos;
  for (let i = 0; i < token.children.length; i++) {
    let child = token.children[i];
    let childBefore = i - 1 >= 0 ? token.children[i-1] : null;
    const startPos = pos;
    if (child.type ==="link_open" && !child.hasOwnProperty('nextPos')) {
      if (token.children[i+1].hasOwnProperty('nextPos')) {
        token.children[i+1].positions = {
          start: startPos + 1,
          end: start_content + token.children[i+1].nextPos
        };
        token.children[i+1].highlights = findPositionsInHighlights(highlights, token.children[i+1].positions);
      } else {
        token.children[i+1].positions = {
          start: startPos + 1,
          end: startPos + 1 + token.children[i+1].content?.length
        };
        token.children[i+1].highlights = findPositionsInHighlights(highlights, token.children[i+1].positions);
      }
      token.children[i+1].content_test_str = state.src.slice(token.children[i+1].positions.start, token.children[i+1].positions.end);
      child.positions = {
        start: startPos,
        end: start_content + token.children[i+2].nextPos
      };
      child.highlights = findPositionsInHighlights(highlights, child.positions);
      if (!token.children[i+1].highlights?.length && child.highlights?.length) {
        child.highlightAll = true;
        let style = child.attrGet('style');
        child.attrSet('style', getStyleFromHighlight(child.highlights[0]) + style)
      }
      child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
      pos = child.positions.end;
      i+= 2;
      continue;
    }

    if (child.hasOwnProperty('nextPos')) {
      pos = start_content + child.nextPos;
    } else {
      if (child.inlinePos?.end) {
        pos += child.inlinePos.end - child.inlinePos.start;
      } else {
        pos += child?.content?.length
          ? child?.content?.length
          : child?.markup?.length
            ? child?.markup?.length
            : 0;
      }
      if (child.type === 'softbreak') {
        pos++;
      }
    }

    child.positions = {
      start: startPos,
      end: pos
    };
    child.highlights = findPositionsInHighlights(highlights, child.positions);
    if (child?.inlinePos?.hasOwnProperty('start_content') && child.inlinePos?.hasOwnProperty('end_content')) {
      child.positions.start_content = start_content + child.inlinePos.start_content;
      child.positions.end_content = start_content + child.inlinePos.end_content;
    }

    child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
    if (child?.positions.start_content) {
      child.content_test = state.src.slice(
        child.positions.start_content,
        child.positions.end_content
      );
    }
    if (child.highlights?.length){
      if (mathTokenTypes.includes(child.type)) {
        if (child.highlights.find(item => item.include_block)) {
          child.highlightAll = true;
        } else {
          highlightMathToken(state, child);
        }
      }
    }

    if (isBlockquote) {
      if (childBefore?.type === "softbreak" && child.content_test_str.charCodeAt(0) === 0x3E/* > */) {
        let offset = 0;
        for (let k = 0; k < child.content_test_str.length; k++) {
          if (child.content_test_str.charCodeAt(k) === 0x3E/* > */
            || child.content_test_str.charCodeAt(k) === 0x20 /* space */) {
            offset++;
          } else {
            break
          }
        }
        if (offset > 0) {
          child.positions.start += offset;
          child.positions.end += offset;
          child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
        }
      }
    }
    if (child.children?.length) {
      const data = child.positions.hasOwnProperty('start_content') 
        ? setChildrenPositions(state, child, child.positions.start_content, highlights)
        : setChildrenPositions(state, child, child.positions.start, highlights);
      child = data.token;
    }
  }
  return {
    token: token
  }
};

const findPositionsInHighlights = (highlights, positions) => {
  let res = [];
  if (!highlights.length) {
    return res;
  }
  for (let i = 0; i < highlights.length; i++) {
    let item = highlights[i];
    if (item.start === 0 && item.end === 0) {
      continue;
    }
    if (item.start >= positions.start && item.end <= positions.end) {
      res.push(item);
    }
  }
  return res;
};

export const setPositions = (state) => {
  const lines = state.env?.lines ? {...state.env?.lines} : null;
  if (!lines) {
    console.log("Can not set positions. env.lines is not initialized.")
    return;
  }
  let highlights = [];
  if (state.md.options.hasOwnProperty('highlights')) {
    highlights = state.md.options.highlights;
  }
  let offsetContent = 0;
  let offsetBlockquote = 0;
  for (let i = 0; i < state.tokens.length; i++) {
    let token = state.tokens[i];
    if (token.block) {
      if (token.type === "blockquote_open") {
        offsetBlockquote += token.markup.length;
      }      
      if (token.type === "blockquote_close") {
        offsetBlockquote -= token.markup.length;
      }
      /** Set positions for block tokens */
      if (token.map) {
        const line = token.map[0];
        const endLine = token.map[1] > token.map[0] 
          ? token.map[1] - 1 
          : token.map[1];
        
        let startPos = lines.bMarks[line] + lines.tShift[line];
        let endPos = lines.eMarks[endLine];
        let content_test = state.src.slice(startPos, endPos);

        if (token.hasOwnProperty('bMarks')) {
          startPos += token.bMarks;
          if (token.eMarks && endLine -1 >= 0
          ) {
            endPos = lines.eMarks[endLine-1] + token.eMarks;
            endPos += endLine - token.map[0] === 0 ? 1 : 0;
          }
        } else {
          if (token.type === "inline") {
            if (token.content?.length && token.content?.length < content_test?.length) {
              const index = content_test.indexOf(token.content);
              startPos += index !== -1 ? index : 0;
            }
          }
        }
        
        token.positions = {
          start: startPos,
          end: endPos,
        };
        token.highlights = findPositionsInHighlights(highlights, token.positions);
        if (token.hasOwnProperty('bMarksContent')) {
          token.positions.start_content = token.positions.start + token.bMarksContent;
          if (endLine-1 >= 0 ) {
            token.positions.end_content = lines.eMarks[endLine-1] + token.eMarksContent;
            token.positions.end_content += endLine - token.map[0] === 0 ? 1 : 0;
          } else {
            token.positions.end_content = token.eMarksContent
          }
          token.content_test = state.src.slice(token.positions.start_content, token.positions.end_content);
        }
        token.content_test_str = state.src.slice(token.positions.start, token.positions.end);
        
        let dataAttrsStyle = '';
        if (token.highlights?.length) {
          token.highlights.sort(sortHighlights);
          if (token.positions.start_content > token.highlights?.[0].start) {
            if (token.highlights?.[0].highlight_color) {
              dataAttrsStyle += `background-color: ${token.highlights?.[0].highlight_color};`;
            }
            if (token.highlights?.[0].text_color) {
              dataAttrsStyle += `color: ${token.highlights?.[0].text_color};`;
            }
            token.attrPush(['style', dataAttrsStyle])
          }
        }
          
      }
      /** Ignore set positions for children.
       * Since the content may not match the original string. Line breaks can be removed*/
      if (['tabular'].includes(token.type)) {
        continue;
      }
      if (token.children?.length && token.positions) {
        if (offsetBlockquote > 0 && token.type === 'inline' && token.content_test_str.charCodeAt(0) === 0x3E/* > */) {
          let offset = 0;
          for (let k = 0; k < token.content_test_str.length; k++) {
            if (token.content_test_str.charCodeAt(k) === 0x3E/* > */
            || token.content_test_str.charCodeAt(k) === 0x20 /* space */) {
              offset++;
            } else {
              break
            }
          }
          if (offset > 0) {
            token.positions.start += offset;
            token.content_test_str = state.src.slice(token.positions.start, token.positions.end);
          }
        }

        let pos = token.positions.hasOwnProperty('start_content')
          ? token.positions.start_content
          : token.positions?.start ? token.positions.start : 0;
        pos += offsetContent;
        const data = setChildrenPositions(state, token, pos, highlights, offsetBlockquote > 0);
        token = data.token;
      }
    }
  }
  console.log("[MMD]=>[state.tokens]=>", state.tokens)
};

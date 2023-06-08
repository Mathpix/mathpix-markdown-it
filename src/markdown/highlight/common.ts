import { HIGHLIGHT_COLOR, HIGHLIGHT_TEXT_COLOR } from "../common/consts";

export const sortHighlights = (a, b) => {
  return a.start > b.start ? 1 : -1
};

export const filteredHighlightContent = (highlightContent) => {
  let newArr = [];
  for(let i = 0; i < highlightContent.length; i++) {
    let index = newArr?.length
      ? newArr.findIndex(item => item.positions.start >= highlightContent[i].positions.start
        && item.positions.end <= highlightContent[i].positions.end)
      : -1;
    if (index === -1) {
      let lastIndex = newArr?.length ? newArr.length - 1 : -1;
      if (lastIndex >= 0 
        && newArr[lastIndex].positions.end + 1 === highlightContent[i].positions.start
        && !newArr[lastIndex].highlightIncludeIntoBraces && !highlightContent[i].highlightIncludeIntoBraces
      ) {
        newArr[lastIndex].positions.end = highlightContent[i].positions.end;
        newArr[lastIndex].content += highlightContent[i].content;
      } else {
        newArr.push(highlightContent[i]);
      }
      continue;
    }
    newArr.splice(index, 1);
    newArr.push(highlightContent[i]);
  }
  return newArr;
};

export const getStyleFromHighlight = (highlight): string => {
  let dataAttrsStyle = '';
  if (highlight.hasOwnProperty('highlight_color')
    || highlight.hasOwnProperty('text_color')) {
    if (highlight.highlight_color) {
      dataAttrsStyle += `background-color: ${highlight.highlight_color};`;
    }
    if (highlight.text_color) {
      dataAttrsStyle += `color: ${highlight.text_color};`;
    }
  } else {
    dataAttrsStyle += `background-color: ${HIGHLIGHT_COLOR};`;
    dataAttrsStyle += `color: ${HIGHLIGHT_TEXT_COLOR};`;
  }
  return dataAttrsStyle;
};

export const needToHighlightAll = (token) => {
  let res = false;
  for (let i = 0; i < token.highlights.length; i++) {
    let startPos = token.highlights[i].start;
    if (token.positions.hasOwnProperty('start_content')){
      if (token.positions.start_content > startPos){
        token.highlightAll = true;
        res = true;
        break;
      }
    }
  }
  return res;
};

export const highlightText = (token, content = '') => {
  if (token.highlights?.length) {
    let highlightContent = [];
    if (!token.highlightAll) {
      token.highlights.sort(sortHighlights);
      for (let i = 0; i < token.highlights.length; i++) {
        let startPos = token.highlights[i].start;
        let endPos = token.highlights[i].end ;
        if (token.positions.hasOwnProperty('start_content')){
          if (token.positions.start_content > startPos){
            token.highlightAll = true;
            break;
          }
          startPos -= token.positions.start_content;
          endPos -= token.positions.start_content;
        } else {
          startPos -= token.positions.start;
          endPos -= token.positions.start;
        }
        highlightContent.push({
          positions: {
            start: startPos,
            end: endPos
          },
          highlight: token.highlights[i],
          content: content ? content.slice(startPos, endPos) : token.content.slice(startPos, endPos)
        });
      }
    }
    let textStr = '';
    if (token.highlightAll) {
      textStr += '<span class="mmd-highlight" style="' + getStyleFromHighlight(token.highlights[0]) + '">';
      textStr += content ? content : token.content;
      textStr += '</span>';
      return textStr;
    }
    let textStart = 0;
    highlightContent.map(item => {
      textStr += content ? content.slice(textStart, item.positions.start) : token.content.slice(textStart, item.positions.start);
      textStr += '<span class="mmd-highlight" style="' + getStyleFromHighlight(item.highlight) + '">';
      textStr += item.content;
      textStr += '</span>';
      textStart = item.positions.end;
    });
    textStr += content ? content.slice(textStart) : token.content.slice(textStart);
    return textStr;
  } else {
    return token.content;
  }
};

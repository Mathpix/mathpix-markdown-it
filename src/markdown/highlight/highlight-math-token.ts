import { sortHighlights, filteredHighlightContent } from "./common";
import { getWidthFromDocument } from "../utils";
import { MathJax } from "../../mathjax/";
import { 
  mathEnvironments,
  HIGHLIGHT_COLOR, 
  HIGHLIGHT_TEXT_COLOR 
} from "../common/consts";

/** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
export const convertMathToHtmlWithHighlight = (state, token, options) => {
  const math_highlight = token.content_highlight;
  let isBlock = token.type !== 'inline_math';
  try {
    let cwidth = 1200;
    if (options && options.width && options.width > 0) {
      cwidth = options.width;
    } else {
      cwidth = getWidthFromDocument(cwidth);
    }
    const begin_number = math_highlight && token.number
      ? token.number
      : MathJax.GetLastEquationNumber() + 1;
    MathJax.Reset(begin_number);
    const data = MathJax.Typeset(math_highlight, {display: isBlock, metric: { cwidth: cwidth },
      outMath: {}, mathJax: options.mathJax, accessibility: options.accessibility,
      nonumbers: options.nonumbers
    }, true);
    token.mathData.svg = data.data.svg;
    return token;
  } catch (e) {
    // console.log('ERROR MathJax =>', e.message, e);
    console.log('ERROR MathJax =>token=>', token);
    console.log('ERROR MathJax =>content_highlight=>', token.content_highlight);
    console.error('ERROR MathJax =>', e.message, e);
    token.highlightAll = true;
    return token;
  }
};

export const addedHighlightMathjaxFunctions = (token, mathContent) => {
  let mathStr = '';
  let mathStart = 0;
  mathContent.map(item => {
    mathStr += token.content.slice(mathStart, item.positions.start);
    if (item.highlight.hasOwnProperty('text_color') || item.highlight.hasOwnProperty('highlight_color')) {
      if (item.highlightIncludeIntoBraces) {
        mathStr += `{`;
      }
      if (item.highlight?.text_color) {
        mathStr += `\\textcolor{${item.highlight?.text_color}}{`;
      }
      if (item.highlight?.highlight_color) {
        mathStr += `\\colorbox{${item.highlight?.highlight_color}}{$`;
      }
      mathStr += item.content;
      if (item.highlight?.highlight_color) {
        mathStr += '$}';
      }
      if (item.highlight?.text_color) {
        mathStr += `}`;
      }
      if (item.highlightIncludeIntoBraces) {
        mathStr += `}`;
      }
    } else {
      if (item.highlightIncludeIntoBraces) {
        mathStr += `{`;
      }
      mathStr += `\\textcolor{${HIGHLIGHT_TEXT_COLOR}}{`;
      mathStr += `\\colorbox{${HIGHLIGHT_COLOR}}{$`;
      mathStr += item.content;
      mathStr += '$}';
      mathStr += `}`;
      if (item.highlightIncludeIntoBraces) {
        mathStr += `}`;
      }
    }
    mathStart = item.positions.end;
  });
  mathStr += token.content.slice(mathStart);
  return mathStr;
};

export const highlightMathToken = (state, token) => {
  try {
    let mathContent = [];
    token.highlights.sort(sortHighlights);
    let isBreak = false;
    for (let j = 0; j < token.highlights?.length; j++) {
      if (isBreak) {
        break;
      }
      let startMathPos = token?.positions?.hasOwnProperty('start_content')
        ? token.highlights[j].start - token.positions.start_content
        : token.highlights[j].start - token.positions.start;
      let endMathPos = token?.positions?.hasOwnProperty('start_content')
        ? token.highlights[j].end - token.positions.start_content
        : token.highlights[j].end - token.positions.start;
      
      if (mathContent?.length 
        && mathContent.find(item => startMathPos >= item.positions.start && endMathPos <= item.positions.end)){
        continue
      }

      for (let k = 0; k < token.canonicalizedPositions?.length; k++) {
        let nextItem = k + 1 < token.canonicalizedPositions?.length ? token.canonicalizedPositions[k+1] : null;
        if (startMathPos >= token.canonicalizedPositions[k].positions.start
          && endMathPos <= token.canonicalizedPositions[k].positions.end) {
          /** Highlight all equation */
          if (['\\hline', '\\begin', '\\end', '\\label', '\\tag'].includes(token.canonicalizedPositions[k].content)) {
            mathContent = [];
            isBreak = true;
            break;
          }          
          /** Highlight all equation */
          if (['\\label', '\\tag'].includes(token.canonicalizedPositions[k].parentCommand)) {
            mathContent = [];
            isBreak = true;
            break;
          }
          /** Highlight all equation */
          if (mathEnvironments.includes(token.canonicalizedPositions[k].content)) {
            if (k - 2 >= 0
              && (token.canonicalizedPositions[k-2].content === '\\begin'
                || token.canonicalizedPositions[k-2].content === '\\end')) {
              mathContent = [];
              isBreak = true;
              break;
            }
          }

          /** Highlight part of equation */
          if (nextItem?.content === '{') {
            /** Find close branch */
            let parens = 0;
            let startPositions = token.canonicalizedPositions[k].positions;
            let endPositions = null;
            for (let i = k+1; i < token.canonicalizedPositions.length; i++) {
              if (token.canonicalizedPositions[i].content === '}') {
                parens--;
                if (parens === 0) {
                  endPositions = token.canonicalizedPositions[i].positions;
                  k = i;
                  break;
                }
                continue;
              }
              if (token.canonicalizedPositions[i].content === '{') {
                parens++;
              }
            }
            if (startPositions && endPositions) {
              mathContent.push({
                positions: {
                  start: startPositions.start,
                  end: endPositions.end,
                },
                content: token.content.slice(startPositions.start, endPositions.end),
                highlight: token.highlights[j]
              });
              continue;
            }
          }
          /** Highlight part of equation */
          if (token.canonicalizedPositions[k].content === '\\left') {
            /** Find close branch */
            let parens = 0;
            let startPositions = token.canonicalizedPositions[k].positions;
            let endPositions = null;
            for (let i = k; i < token.canonicalizedPositions.length; i++) {
              if (token.canonicalizedPositions[i].content === '\\right') {
                parens--;
                if (parens === 0) {
                  endPositions = token.canonicalizedPositions[i+1].positions;
                  k = i+1;
                  break;
                }
                continue;
              }
              if (token.canonicalizedPositions[i].content === '\\left') {
                parens++;
              }
            }
            if (startPositions && endPositions) {
              mathContent.push({
                positions: {
                  start: startPositions.start,
                  end: endPositions.end,
                },
                content: token.content.slice(startPositions.start, endPositions.end),
                highlight: token.highlights[j]
              });
              continue;
            }
          }
          /** Highlight part of equation */
          if (token.canonicalizedPositions[k].content === '\\right') {
            /** Find open branch */
            let parens = 0;
            let endPositions = token.canonicalizedPositions[k+1].positions;
            let startPositions = null;
            for (let i = k + 1; i >= 0; i--) {
              if (token.canonicalizedPositions[i].content === '\\left') {
                parens--;
                if (parens === 0) {
                  startPositions = token.canonicalizedPositions[i].positions;
                  k = k+1;
                  break;
                }
                continue;
              }
              if (token.canonicalizedPositions[i].content === '\\right') {
                parens++;
              }
            }
            if (startPositions && endPositions) {
              mathContent.push({
                positions: {
                  start: startPositions.start,
                  end: endPositions.end,
                },
                content: token.content.slice(startPositions.start, endPositions.end),
                highlight: token.highlights[j]
              });
              continue;
            }
          }
          let content = token.content.slice(
            token.canonicalizedPositions[k].positions.start, 
            token.canonicalizedPositions[k].positions.end);
          let highlightIncludeIntoBraces = false;
          if (token.canonicalizedPositions[k].fontControl) {
            let includeIntoBraces = token.canonicalizedPositions[k].fontControl.includeIntoBraces && token.canonicalizedPositions[k].parentCommand;
            highlightIncludeIntoBraces = !includeIntoBraces && token.canonicalizedPositions[k].fontControl.command === '\\Bbb';
            content = includeIntoBraces
              ? '{' + content + '}' :
              ' ' + content;
            content = token.canonicalizedPositions[k].fontControl.command + content;
          }
          mathContent.push({
            positions: token.canonicalizedPositions[k].positions,
            content: content,
            highlight: token.highlights[j],
            highlightIncludeIntoBraces: highlightIncludeIntoBraces
          })
        }
      }
    }
    if (!mathContent?.length) {
      token.highlightAll = true;
      return;
    }
    mathContent = filteredHighlightContent(mathContent);
    token.content_highlight = addedHighlightMathjaxFunctions(token, mathContent);
    convertMathToHtmlWithHighlight(state, token, state.md.options);
  } catch (err) {
    console.log("[MMD]=>ERROR=>highlight=>", err);
    token.highlightAll = true;
  }
};

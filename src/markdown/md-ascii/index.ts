import { MathJax } from "../../mathjax";
import { getWidthFromDocument } from '../utils';

export const asciiMath = (state, silent) => {
  const notRenderAsciiMath = state.md.options.mathJax
    && Object(state.md.options.mathJax).hasOwnProperty('asciiMath')
    && state.md.options.mathJax.asciiMath === false;
  if (notRenderAsciiMath) {
    return false;
  }
  let startMathPos = state.pos;

  let beginMarker: RegExp = /^<ascii>/;
  let endMarker: string = '</ascii>';

  if (state.src.charCodeAt(startMathPos) !== 0x3C /* < */) {
    return false;
  }

  if (!beginMarker.test(state.src.slice(startMathPos))) {
    return false;
  }

  const match = state.src
    .slice(startMathPos)
    .match(beginMarker);

  if (!match) {
    return false;
  }

  startMathPos += match[0].length;
  const endMarkerPos = state.src.indexOf(endMarker, startMathPos);

  if (endMarkerPos === -1) { return false; }

  const nextPos = endMarkerPos + endMarker.length;

  if (!silent) {
    const token = state.push("ascii_math", 0);
    token.content = state.src.slice(startMathPos, endMarkerPos);
    if (state.env.tabulare) {
      token.return_asciimath = true;
    }
    if (state.md.options.forLatex) {
      token.markup = startMathPos;
    }
  }
  state.pos = nextPos;
  return true;
};

export const backtickAsAsciiMath = (state, silent) => {
  const useBacktick = state.md.options.mathJax && state.md.options.mathJax.asciiMath &&  state.md.options.mathJax.asciiMath.useBacktick
  if (!useBacktick) {
    return false;
  }

  let start, marker, matchStart, matchEnd, token,
    pos = state.pos,
    ch = state.src.charCodeAt(pos);

  if (ch !== 0x60/* ` */) {
    return false;
  }

  start = pos;
  pos++;

  if (state.src.charCodeAt(pos) === 0x60/* ` */) {
    return false;
  }


  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        token         = state.push('ascii_math', 0);
        token.markup  = marker;
        token.content = state.src.slice(pos, matchStart)
          .replace(/[ \n]+/g, ' ')
          .trim();
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};

export const renderAsciiMath = (tokens, idx, options) => {
  const token = tokens[idx];
  let mathEquation = null;
  const math = token.content;
  try {
    let cwidth = 1200;
    if (options && options.width && options.width > 0) {
      cwidth = options.width;
    } else {
      cwidth = getWidthFromDocument(cwidth);
    }

    mathEquation = MathJax.AsciiMathToSvg(math, {display: false, metric: { cwidth: cwidth },
      outMath: options.outMath, mathJax: options.mathJax, forDocx: options.forDocx,
      accessibility: options.accessibility
    });
  } catch (e) {
    console.error('ERROR MathJax =>', e.message, e);
    if (options.outMath && options.outMath.not_catch_errors) {
      throw ({
        message: e.message,
        error: e
      })
    }

    if (token.type === 'display_mathML' || token.type === 'inline_mathML') {
      mathEquation = `<span class="math-error">${math}</span>`;
    } else {
      mathEquation = math;
      return `<p class="math-error">${mathEquation}</p>`;
    }
  }

  return `<span class="math-inline ascii">${mathEquation}</span>`
};

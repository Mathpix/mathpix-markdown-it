import { RuleInline } from 'markdown-it';
import { convertAsciiMathToHtml } from "../common/convert-math-to-html";

export const asciiMath: RuleInline = (state, silent) => {
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
    convertAsciiMathToHtml(state, token);
  }
  state.pos = nextPos;
  return true;
};

export const backtickAsAsciiMath: RuleInline = (state, silent) => {
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
        convertAsciiMathToHtml(state, token);
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
  if (token.error) {
    if (options?.outMath?.not_catch_errors) {
      throw token.error;
    }
    return `<p class="math-error">${token.content}</p>`;
  }
  return `<span class="math-inline ascii">${token.mathEquation}</span>`;
};

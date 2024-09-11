import { RuleInline } from 'markdown-it';
import { svgInlineRegex } from "../common/consts";

function extractFullSVGContent(html) {
  const regex = /<svg\b[^>]*>|<\/svg>/gi; // Match opening and closing <svg> tags
  let match;
  let stack = []; // Stack to track opening <svg> tags
  let matches = []; // Store full matched <svg> elements

  while ((match = regex.exec(html)) !== null) {
    if (match[0].startsWith('<svg')) {
      // Found an opening <svg> tag, push its position to the stack
      stack.push(match.index);
    } else if (match[0].startsWith('</svg>')) {
      // Found a closing </svg> tag
      if (stack.length > 0) {
        const start = stack.pop(); // Pop the last opening <svg> position from the stack
        if (stack.length === 0) {
          // When the stack is empty, it means we've found a full <svg> block
          const fullSvg = html.slice(start, regex.lastIndex); // Extract the full <svg> content
          matches.push(fullSvg); // Store the full matched <svg>
        }
      }
    }
  }

  return matches;
}
export const svg_inline: RuleInline = (state, silent) => {
  var  max,
    pos = state.pos;

  if (!state.md.options.html) { return false; }

  // Check start
  max = state.posMax;
  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
    pos + 2 >= max) {
    return false;
  }
  const match = state.src
    .slice(pos)
    .match(svgInlineRegex);
  if (!match) {
    return false;
  }

  const matchedSVGs = extractFullSVGContent(state.src
    .slice(pos));

  if (!matchedSVGs?.length) {
    return false;
  }
  if (!silent) {
    let token         = state.push('html_inline', '', 0);
    token.content = state.src.slice(pos, pos + matchedSVGs[0].length);
    token.isSvg = true;
  }
  state.pos += matchedSVGs[0].length;
  return true;
}

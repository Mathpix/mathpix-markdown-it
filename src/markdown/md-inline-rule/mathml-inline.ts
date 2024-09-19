import { RuleInline, Token } from "markdown-it";
import { convertMathToHtml } from "../common/convert-math-to-html";
import { validMathMLRegex, mathMLInlineRegex } from "../common/consts";

export const inlineMathML: RuleInline = (state, silent) => {
  try {
    const { pos, src, posMax } = state;

    // Early exit if input is too short or does not start with '<'
    if (pos + 2 >= posMax || src.charCodeAt(pos) !== 0x3C /* < */) {
      return false;
    }

    // Attempt to match the MathML inline pattern
    const match = src.slice(pos).match(mathMLInlineRegex);

    if (!match || !validMathMLRegex.test(match[0])) {
      return false;
    }

    // Determine the type of MathML (inline or display)
    let type:string = match[1]?.indexOf('block') !== -1 ? "display_mathML" : "inline_mathML";

    // Create and configure token if not in silent mode
    if (!silent) {
      const token: Token = state.push(type, "", 0);
      token.content = src.slice(pos, pos + match[0].length);
      token.inlinePos = {
        start: state.pos,
        end: pos + match[0].length
      };
      // Convert MathML to HTML and obtain additional data using MathJax
      convertMathToHtml(state, token, state.md.options);
    }

    // Advance the state position to the end of the matched content
    state.pos += match[0].length;
    return true;
  } catch (err) {
    console.error("[ERROR]=>[inlineMathML]=>", err);
    return false;
  }
}

import { RuleBlock, Token } from "markdown-it";
import { closeTagMML, openTagMML } from "../common/consts";
import { validateMathMLShallow, ValidationResult } from "../common/validate-mathML";

export const mathMLBlock: RuleBlock = (state, startLine, endLine, silent): boolean => {
  try {
    let pos: number = state.bMarks[startLine] + state.tShift[startLine];
    let max: number = state.eMarks[startLine];
    let nextLine: number = startLine + 1;
    let terminatorRules = [
      ...state.md.block.ruler.getRules('paragraph'),
      ...state.md.block.ruler.getRules('mathMLBlock')
    ];
    // state.parentType = 'paragraph';

    // Early exit if the first character is not '<'
    if (state.src.charCodeAt(pos) !== 0x3C /* < */) return false;

    // Extract current line text and check for the opening tag
    let lineText: string = state.src.slice(pos, max);
    if (!openTagMML.test(lineText)) return false;

    let hasCloseTag = false;
    // Iterate through lines until the closing tag or end of file
    while (nextLine < endLine) {
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      // Check for terminator rules
      if (terminatorRules.some(rule => rule(state, nextLine, endLine, true))) break;

      // Check for closing tag
      if (closeTagMML.test(lineText)) {
        if (lineText.length !== 0) nextLine++;
        hasCloseTag = true;
        break;
      }

      nextLine++;
    }

    // If there is no closing tag, return false
    if (!hasCloseTag) return false;

    // Get the content between the matched lines
    const content: string = state.getLines(startLine, nextLine, state.blkIndent, false);
    let validationMathML: ValidationResult = validateMathMLShallow(content);
    if (!validationMathML.ok) {
      return false;
    }

    // If in validation mode, return true
    if (silent) return true;

    // Update the state line
    state.line = nextLine;

    // Create the tokens for the MathML block
    let token: Token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, nextLine];

    token = state.push('inline', '', 0);
    token.content = content;
    token.map = [startLine, nextLine];
    token.children = [];

    token = state.push('paragraph_close', 'div', -1);
    return true;
  } catch (err) {
    console.error("[ERROR]=>[mathMLBlock]=>", err);
    return false;
  }
};

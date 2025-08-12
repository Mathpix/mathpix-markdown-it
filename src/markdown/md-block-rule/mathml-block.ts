import MarkdownIt, { RuleBlock, Token, Ruler } from "markdown-it";
import { closeTagMML, mathMLInlineRegex, openTagMML } from "../common/consts";
import { validateMathMLShallow, ValidationResult } from "../common/validate-mathML";

const ALT_GROUP_FOR_MATHML = 'mathMLBlock';

type RulerEntry = {
  name: string;
  fn: RuleBlock;
  enabled: boolean;
  alt?: string[];
};

const baseTerminatorsCache = new WeakMap<MarkdownIt, RuleBlock[]>();

/** Builds a basic list of terminator rules for a MathML block: paragraph + alt=ALT_GROUP_FOR_MATHML */
function collectBaseTerminators(md: MarkdownIt, altGroup = ALT_GROUP_FOR_MATHML): RuleBlock[] {
  // 1) Standard "paragraph" terminators
  const paragraphRules = md.block.ruler.getRules('paragraph') ?? [];

  // 2) Alternative rules from private __rules__ (soft checks)
  const raw = (md.block.ruler as unknown as Ruler & { __rules__?: RulerEntry[] }).__rules__ ?? [];
  const altGroupRules = raw
    .filter(r => r?.enabled && Array.isArray(r.alt) && r.alt.includes(altGroup))
    .map(r => r.fn);

  // 3) Glue and remove duplicates, maintaining order
  const seen = new Set<RuleBlock>();
  const merged: RuleBlock[] = [];
  for (const fn of [...paragraphRules, ...altGroupRules]) {
    if (!seen.has(fn)) {
      seen.add(fn);
      merged.push(fn);
    }
  }
  return merged;
}

/**
 * Returns terminator rules for the MathML block excluding the current rule (selfRule).
 * The base list is cached at the MarkdownIt instance level.
 */
export function collectTerminatorRules(
  md: MarkdownIt,
  selfRule: RuleBlock,
  altGroup = ALT_GROUP_FOR_MATHML
): RuleBlock[] {
  // Take from cache or collect the database
  let base = baseTerminatorsCache.get(md);
  if (!base) {
    base = collectBaseTerminators(md, altGroup);
    baseTerminatorsCache.set(md, base);
  }
  // Exclude selfRule on each call (it may differ)
  return base.filter(fn => fn !== selfRule);
}

export const mathMLBlock: RuleBlock = (state, startLine, endLine, silent): boolean => {
  try {
    let pos: number = state.bMarks[startLine] + state.tShift[startLine];
    let max: number = state.eMarks[startLine];

    // Early exit if the first character is not '<'
    if (state.src.charCodeAt(pos) !== 0x3C /* < */) return false;

    // Extract current line text and check for the opening tag
    let lineText: string = state.src.slice(pos, max);
    if (!openTagMML.test(lineText)) return false;
    if (mathMLInlineRegex.test(lineText)) return false;

    let nextLine = startLine + 1;
    let hasCloseTag = false;
    if (closeTagMML.test(lineText)) {
      hasCloseTag = true;
      nextLine = startLine + 1; // the entire content is on the first line
    } else {
      const terminatorRules = collectTerminatorRules(state.md as MarkdownIt, mathMLBlock);
      // Iterate through lines until the closing tag or end of file
      while (nextLine < endLine) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        // Check for terminator rules
        if (terminatorRules.some(rule => rule(state, nextLine, endLine, true))) break;

        lineText = state.src.slice(pos, max);
        // Check for closing tag
        if (closeTagMML.test(lineText)) {
          nextLine++;
          hasCloseTag = true;
          break;
        }

        nextLine++;
      }
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

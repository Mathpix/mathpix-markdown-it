import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { MathNode } from "./types";
import {
  RE_BRACKET_CHARS, RE_ASCII_LETTER, RE_TRAILING_WS, RE_LEADING_WS,
  UNPAIRED_BRACKET_PROP, OPEN_BRACKETS, CLOSE_BRACKETS,
  DOUBLE_VERT, PARALLEL_SIGN,
} from "./consts";
import { getNodeText, getProp } from "./common";
import { typstSymbolMap } from "./typst-symbol-map";

const BRACKET_SYMBOL_MAP: Readonly<Record<string, string>> = {
  '[': 'bracket.l',
  ']': 'bracket.r',
  '(': 'paren.l',
  ')': 'paren.r',
  '{': 'brace.l',
  '}': 'brace.r',
};

// Escape delimiters that cause parse errors inside lr() when unpaired.
// All ASCII brackets except ] are escaped: ( and [ open groups/content blocks,
// ) closes the lr() function call prematurely, { and } are code block syntax.
// ] is left unescaped so lr() can recognise and auto-size it as a delimiter.
const LR_DELIMITER_ESCAPE_MAP: Readonly<Record<string, string>> = {
  '(': '\\(',
  ')': '\\)',
  '[': '\\[',
  '{': '\\{',
  '}': '\\}',
};

// Delimiter → Typst string literal mapping for explicit delimiter arguments
const DELIMITER_LITERAL_MAP: Readonly<Record<string, string>> = {
  '(': '"("',
  ')': '")"',
  '[': '"["',
  ']': '"]"',
  '{': '"{"',
  '}': '"}"',
  '|': '"|"',
  [DOUBLE_VERT]: `"${DOUBLE_VERT}"`,
  [PARALLEL_SIGN]: `"${DOUBLE_VERT}"`,
};

export type BracketToken = { char: string; pos: number };

// Function wrappers (sqrt, frac, etc.): brackets inside cannot pair with outside.
// mtr/mlabeledtr: each cell (mtd) is a separate scope — brackets cannot pair
// across cells or rows, preventing orphaned brackets in aligned/mat() output.
const SCOPE_BOUNDARIES = new Set([
  'msqrt', 'mroot', 'mfrac', 'menclose', 'mover', 'munder',
  'mtr', 'mlabeledtr',
  'mstyle',
]);

// Nodes where the base (child[0]) stays in the parent scope but script children
// (sub/sup) are separate scopes.  The base of msub/msup is in the same visual
// scope as surrounding content (e.g. (a+b)^2 → ) is the base of msup and must
// pair with ( outside).  But script children are wrapped in ^(…) / _(…), so
// brackets inside scripts cannot pair with brackets outside.
const SCRIPT_SCOPE_KINDS = new Set([
  'msub', 'msup', 'msubsup',
]);

/** Skip past a quoted string starting at position i (the opening ").
 *  Returns the index of the closing " or end of string. */
const skipQuotedString = (expr: string, i: number): number => {
  i++;
  while (i < expr.length && expr[i] !== '"') {
    if (expr[i] === '\\') {
      i++;
    }
    i++;
  }
  return i;
};

// Delimiter is always a single Unicode char (safe for unescaped Typst string literal)
export const delimiterToTypst = (delim: string): string =>
  DELIMITER_LITERAL_MAP[delim] ?? `"${delim}"`;

export const treeContainsMo = (node: MathNode, moText: string, skipPhantom = true): boolean => {
  if (!node) {
    return false;
  }
  if (skipPhantom && node.kind === 'mphantom') {
    return false;
  }
  if (node.kind === 'mo' && getNodeText(node) === moText) {
    return true;
  }
  for (const child of (node.childNodes ?? [])) {
    if (treeContainsMo(child, moText, skipPhantom)) {
      return true;
    }
  }
  return false;
};

/** Check whether ( at position i is a syntactic paren (not a math delimiter).
 *  True when preceded by:
 *  - ASCII letter: function call — sqrt(, frac(
 *  - dot + ASCII letter: method call — arrow.r(
 *  - _ or ^: subscript/superscript grouping — _(x + y), ^(n)
 *  Unicode letters (л, α) are math variables, not calls.
 *  Digits before ( are mathematical grouping (.4(), not a call. */
const isSyntaxParen = (expr: string, i: number): boolean => {
  const prev = expr[i - 1];
  return RE_ASCII_LETTER.test(prev)
    || (prev === '.' && i > 1 && RE_ASCII_LETTER.test(expr[i - 2]))
    || prev === '_' || prev === '^';
};

/** Scan a Typst expression and collect bracket positions, skipping escaped chars,
 *  quoted strings, and syntax parens (function calls, subscript/superscript grouping). */
export const scanBracketTokens = (expr: string): BracketToken[] => {
  const brackets: BracketToken[] = [];
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '\\') {
      i++;
      continue;
    }
    if (ch === '"') {
      i = skipQuotedString(expr, i);
      continue;
    }
    if (RE_BRACKET_CHARS.test(ch)) {
      // Skip syntax parens: function calls (sqrt(), frac()), method calls
      // (arrow.r()), and script grouping (_(), ^()).  Digits before ( are
      // NOT syntax — .4( is mathematical grouping, not a call.
      if (ch === '(' && i > 0 && isSyntaxParen(expr, i)) {
        const openPos = i;
        let depth = 1;
        i++;
        while (i < expr.length && depth > 0) {
          if (expr[i] === '\\') {
            i++;
          } else if (expr[i] === '"') {
            i = skipQuotedString(expr, i);
          } else if (expr[i] === '(') {
            depth++;
          } else if (expr[i] === ')') {
            depth--;
          } if (depth > 0) {
            i++;
          }
        }
        // If no matching ) found, this is not a real function call —
        // register the ( and backtrack so the for-loop re-scans the
        // range from openPos+1, picking up any [, ], {, } inside.
        if (depth > 0) {
          brackets.push({ char: '(', pos: openPos });
          i = openPos; // for-loop i++ → openPos+1
        }
        continue;
      }
      brackets.push({ char: ch, pos: i });
    }
  }
  return brackets;
};

/** Strict stack pairing: a closing bracket matches ONLY the corresponding open
 *  at the top of the stack. On mismatch the top stays in the stack and the
 *  closing bracket is left unpaired — both sides remain unmatched.
 *  Returns the set of indices (into the chars array) that are unpaired. */
export const findUnpairedIndices = (chars: string[]): Set<number> => {
  const stack: number[] = [];
  // Start with all bracket indices as unpaired; remove when matched
  const unpaired = new Set<number>();
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (OPEN_BRACKETS[ch]) {
      unpaired.add(i);
      stack.push(i);
    } else if (CLOSE_BRACKETS[ch]) {
      unpaired.add(i);
      if (stack.length > 0) {
        const topIdx = stack[stack.length - 1];
        if (chars[topIdx] === CLOSE_BRACKETS[ch]) {
          unpaired.delete(topIdx);
          unpaired.delete(i);
          stack.pop();
        }
      }
    }
  }
  return unpaired;
};

// Replace unpaired brackets in a matrix/cases cell with Typst symbol names.
// Brackets that have a matching open/close pair in the same cell are kept as-is.
// Escaped brackets (\[), brackets inside quoted strings ("..."), and brackets
// inside function-call parens (e.g. frac(...)) are ignored.
export const replaceUnpairedBrackets = (expr: string): string => {
  if (!RE_BRACKET_CHARS.test(expr)) {
    return expr;
  }
  const brackets = scanBracketTokens(expr);
  const unpairedTokenIndices = findUnpairedIndices(brackets.map(b => b.char));
  const unmatchedPositions = new Set<number>();
  for (const idx of unpairedTokenIndices) {
    unmatchedPositions.add(brackets[idx].pos);
  }
  if (unmatchedPositions.size === 0) {
    return expr;
  }
  let result = '';
  for (let i = 0; i < expr.length; i++) {
    if (unmatchedPositions.has(i)) {
      const sym = BRACKET_SYMBOL_MAP[expr[i]];
      // Symbol names (paren.l, bracket.r, …) are Typst identifiers —
      // they must be space-separated from any adjacent non-whitespace.
      if (result.length > 0 && !RE_TRAILING_WS.test(result)) {
        result += ' ';
      }
      result += sym;
      if (i + 1 < expr.length && !RE_LEADING_WS.test(expr[i + 1])) {
        result += ' ';
      }
    } else {
      result += expr[i];
    }
  }
  return result;
};

export const markUnpairedBrackets = (root: MathNode, inTableCell = false): void => {
  const bracketNodes: { node: MathNode; char: string }[] = [];
  // Check if an mo node is a \left...\right delimiter (first/last child of
  // an mrow with texClass=INNER and open/close properties).  These must NOT
  // participate in pairing — otherwise \right] would pair with an inner [.
  const isLeftRightDelimiter = (moNode: MathNode): boolean => {
    const parent = moNode.parent;
    if (!parent || parent.kind !== 'mrow') {
      return false;
    }
    if (getProp<number>(parent, 'texClass') !== TEXCLASS.INNER) {
      return false;
    }
    if (getProp<string>(parent, 'open') === undefined && getProp<string>(parent, 'close') === undefined) return false;
    const ch = parent.childNodes;
    if (!ch || ch.length === 0) {
      return false;
    }
    return ch[0] === moNode || ch[ch.length - 1] === moNode;
  };
  const walk = (node: MathNode): void => {
    if (!node) {
      return;
    }
    if (node.kind === 'mo') {
      const text = getNodeText(node);
      if (text && (OPEN_BRACKETS[text] || CLOSE_BRACKETS[text])) {
        if (!isLeftRightDelimiter(node)) {
          bracketNodes.push({ node, char: text });
        }
      }
    }
    for (const child of (node.childNodes ?? [])) {
      if (SCOPE_BOUNDARIES.has(child.kind)) {
        // Each child of the scope boundary is a separate scope.
        // mtable: each row is separate; brackets can't pair across rows.
        const childInMatrix = child.kind === 'mtr' || child.kind === 'mlabeledtr' || inTableCell;
        for (const grandchild of (child.childNodes ?? [])) {
          markUnpairedBrackets(grandchild, childInMatrix);
        }
      } else if (SCRIPT_SCOPE_KINDS.has(child.kind)) {
        // Base (child[0]) stays in parent scope; script children are separate.
        // Exception: opening bracket as script base (e.g. [^{\circ}) must be
        // excluded — in Typst [^(compose) C] the [ starts auto-matching and
        // the ^ inside has no base, causing a parse error.
        const kids = child.childNodes ?? [];
        if (kids[0]) {
          walk(kids[0]);
        }
        for (let k = 1; k < kids.length; k++) {
          markUnpairedBrackets(kids[k], inTableCell);
        }
      } else {
        walk(child);
      }
    }
  };
  walk(root);
  const unpairedIndices = findUnpairedIndices(bracketNodes.map(b => b.char));
  for (const i of unpairedIndices) {
    const ch = bracketNodes[i].char;
    const dir = OPEN_BRACKETS[ch] ? 'open' : 'close';
    // In table cell context, use 'table-open'/'table-close' so moAst uses symbol
    // names (paren.l, bracket.l, brace.l) instead of escaped forms (\(, \[, \{).
    bracketNodes[i].node.setProperty(UNPAIRED_BRACKET_PROP,
      inTableCell ? 'table-' + dir : dir);
  }
};

/** Remove data-unpaired-bracket properties set by markUnpairedBrackets.
 *  Call after Typst serialization to avoid leaking state to other visitors. */
export const clearUnpairedBracketMarks = (root: MathNode): void => {
  const walk = (node: MathNode): void => {
    if (!node) {
      return;
    }
    if (getProp<string>(node, UNPAIRED_BRACKET_PROP) !== undefined) {
      node.removeProperty(UNPAIRED_BRACKET_PROP);
    }
    if (node.childNodes) {
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  };
  walk(root);
};

export const mapDelimiter = (delim: string): string =>
  typstSymbolMap.get(delim) ?? delim;

/** Map delimiter for use inside lr(): apply lr-specific escapes first,
 *  then fall back to typstSymbolMap, then return as-is. */
export const escapeLrDelimiter = (delim: string): string =>
  LR_DELIMITER_ESCAPE_MAP[delim] ?? typstSymbolMap.get(delim) ?? delim;

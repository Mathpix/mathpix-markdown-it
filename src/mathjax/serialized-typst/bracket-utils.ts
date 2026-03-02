import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { ITypstData, ITypstSerializer, MathNode } from "./types";
import {
  RE_BRACKET_CHARS, RE_WORD_CHAR, RE_WORD_DOT_END,
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
const lrOpenEscapeMap: Readonly<Record<string, string>> = {
  '(': '\\(',
  ')': '\\)',
  '[': '\\[',
  '{': '\\{',
  '}': '\\}',
};

export const delimiterToTypst = (delim: string): string => {
  switch (delim) {
    case '(': return '"("';
    case ')': return '")"';
    case '[': return '"["';
    case ']': return '"]"';
    case '{': return '"{"';
    case '}': return '"}"';
    case '|': return '"|"';
    case DOUBLE_VERT: return '"' + DOUBLE_VERT + '"';
    case PARALLEL_SIGN: return '"' + DOUBLE_VERT + '"';
    default: return '"' + delim + '"';
  }
};

export const treeContainsMo = (node: MathNode, moText: string, skipPhantom = true): boolean => {
  if (!node) return false;
  if (skipPhantom && node.kind === 'mphantom') return false;
  if (node.kind === 'mo') {
    const text = getNodeText(node);
    if (text === moText) return true;
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      if (treeContainsMo(child, moText, skipPhantom)) return true;
    }
  }
  return false;
};

// Serialize all visible content in a node subtree up to (but not including)
// the first mo with the given text. Returns the serialized prefix.
export const serializePrefixBeforeMo = (node: MathNode, serialize: ITypstSerializer, stopMoText: string): string => {
  // Walk the mtd → inferredMrow → mpadded chain to find the flat math children
  const flatChildren: MathNode[] = [];
  const extractFlat = (n: MathNode) => {
    if (!n || !n.childNodes) return;
    if (n.kind === 'mphantom') return;
    if (n.kind === 'mtd' || n.kind === 'mpadded' || n.kind === 'mstyle' || n.isInferred) {
      for (const child of n.childNodes) {
        extractFlat(child);
      }
    } else {
      flatChildren.push(n);
    }
  };
  extractFlat(node);
  let result = '';
  for (const child of flatChildren) {
    if (child.kind === 'mo' && getNodeText(child) === stopMoText) {
      break;
    }
    const data: ITypstData = serialize.visitNode(child, '');
    result += data.typst;
  }
  return result.trim();
};

// Replace unpaired brackets in a matrix/cases cell with Typst symbol names.
// Brackets that have a matching open/close pair in the same cell are kept as-is.
// Escaped brackets (\[), brackets inside quoted strings ("..."), and brackets
// inside function-call parens (e.g. frac(...)) are ignored.
export const replaceUnpairedBrackets = (expr: string): string => {
  if (!RE_BRACKET_CHARS.test(expr)) return expr;
  type BracketInfo = { char: string; pos: number };
  const brackets: BracketInfo[] = [];
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '\\') { i++; continue; } // skip backslash-escaped
    // Skip quoted strings
    if (ch === '"') {
      i++;
      while (i < expr.length && expr[i] !== '"') {
        if (expr[i] === '\\') i++; // skip escaped char in string
        i++;
      }
      continue;
    }
    if (RE_BRACKET_CHARS.test(ch)) {
      // Skip function-call parens (preceded by word char or .)
      if (ch === '(' && i > 0 && RE_WORD_DOT_END.test(expr[i - 1])) {
        let depth = 1;
        i++;
        while (i < expr.length && depth > 0) {
          if (expr[i] === '\\') { i++; }
          else if (expr[i] === '"') {
            i++;
            while (i < expr.length && expr[i] !== '"') {
              if (expr[i] === '\\') i++;
              i++;
            }
          }
          else if (expr[i] === '(') depth++;
          else if (expr[i] === ')') depth--;
          if (depth > 0) i++;
        }
        // i now points to the closing ), skip it
        continue;
      }
      brackets.push({ char: ch, pos: i });
    }
  }
  const unmatched = new Set<number>();
  for (const [open, close] of Object.entries(OPEN_BRACKETS)) {
    const stack: number[] = [];
    for (const b of brackets) {
      if (b.char === open) {
        stack.push(b.pos);
      } else if (b.char === close) {
        if (stack.length > 0) {
          stack.pop(); // matched
        } else {
          unmatched.add(b.pos); // unmatched close
        }
      }
    }
    // Any remaining in stack are unmatched opens
    for (const pos of stack) {
      unmatched.add(pos);
    }
  }
  if (unmatched.size === 0) return expr;
  let result = '';
  for (let i = 0; i < expr.length; i++) {
    if (unmatched.has(i)) {
      const sym = BRACKET_SYMBOL_MAP[expr[i]];
      if (result.length > 0 && RE_WORD_DOT_END.test(result[result.length - 1])) {
        result += ' ';
      }
      result += sym;
      if (i + 1 < expr.length && RE_WORD_CHAR.test(expr[i + 1])) {
        result += ' ';
      }
    } else {
      result += expr[i];
    }
  }
  return result;
};

export const markUnpairedBrackets = (root: MathNode): void => {
  const bracketNodes: { node: MathNode; char: string }[] = [];
  // Check if an mo node is a \left...\right delimiter (first/last child of
  // an mrow with texClass=INNER and open/close properties).  These must NOT
  // participate in pairing — otherwise \right] would pair with an inner [.
  const isLeftRightDelimiter = (moNode: MathNode): boolean => {
    const parent = moNode.parent;
    if (!parent || parent.kind !== 'mrow') return false;
    if (getProp<number>(parent, 'texClass') !== TEXCLASS.INNER) return false;
    if (getProp<string>(parent, 'open') === undefined && getProp<string>(parent, 'close') === undefined) return false;
    const ch = parent.childNodes;
    if (!ch || ch.length === 0) return false;
    return ch[0] === moNode || ch[ch.length - 1] === moNode;
  };
  const walk = (node: MathNode): void => {
    if (!node) return;
    if (node.kind === 'mo') {
      const text = getNodeText(node);
      if (text && (OPEN_BRACKETS[text] || CLOSE_BRACKETS[text])) {
        // Skip \left...\right delimiters — they are handled by the mrow handler
        if (!isLeftRightDelimiter(node)) {
          bracketNodes.push({ node, char: text });
        }
      }
    }
    if (node.childNodes) {
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  };
  walk(root);
  // STRICT stack pairing: closing bracket matches ONLY the top of the stack
  const stack: number[] = [];
  const paired = new Set<number>();
  for (let i = 0; i < bracketNodes.length; i++) {
    const ch = bracketNodes[i].char;
    if (OPEN_BRACKETS[ch]) {
      stack.push(i);
    } else if (CLOSE_BRACKETS[ch]) {
      if (stack.length > 0) {
        const topIdx = stack[stack.length - 1];
        if (bracketNodes[topIdx].char === CLOSE_BRACKETS[ch]) {
          paired.add(topIdx);
          paired.add(i);
          stack.pop();
        }
        // Top doesn't match → do NOT search deeper, leave both unpaired
      }
    }
  }
  for (let i = 0; i < bracketNodes.length; i++) {
    if (!paired.has(i)) {
      const ch = bracketNodes[i].char;
      bracketNodes[i].node.setProperty(UNPAIRED_BRACKET_PROP,
        OPEN_BRACKETS[ch] ? 'open' : 'close');
    }
  }
};

export const mapDelimiter = (delim: string): string => {
  const mapped = typstSymbolMap.get(delim);
  if (mapped) {
    return mapped;
  }
  return delim;
};

export const escapeLrOpenDelimiter = (delim: string): string => {
  if (lrOpenEscapeMap[delim]) return lrOpenEscapeMap[delim];
  const mapped = typstSymbolMap.get(delim);
  if (mapped) return mapped;
  return delim;
};

/**
 * Unified expression scanner for Typst escape operations.
 *
 * Walks a Typst expression tracking bracket depth, skips quoted strings ("...")
 * and backslash-escaped characters, applies escape/detection at depth 0.
 */

import { RE_BRACKET_CHARS } from "./consts";
import { scanBracketTokens, findUnpairedIndices, replaceUnpairedBrackets } from "./bracket-utils";

const SEPARATOR_FOUND = 'found';

interface DetectOptions {
  /** Detection mode: return early with SEPARATOR_FOUND if , or ; at depth 0 */
  detectOnly: true;
}

interface TransformOptions {
  detectOnly?: false;
  /** Escape commas at depth 0: , → \, */
  escapeComma?: boolean;
  /** Escape semicolons at depth 0: ; → \; */
  escapeSemicolon?: boolean;
  /** Escape colons at depth 0: word: → word : (space prevents named-arg parsing) */
  escapeColon?: boolean;
}

type ScanOptions = DetectOptions | TransformOptions;

/**
 * Walk a Typst expression tracking bracket depth, skipping quoted strings
 * and backslash-escaped characters. Apply escape/detection per opts.
 *
 * In detectOnly mode: returns '' if no separator found, or SEPARATOR_FOUND on first hit.
 * In transform mode: returns the escaped expression string.
 */
const isDetectMode = (opts: ScanOptions): opts is DetectOptions =>
  opts.detectOnly === true;

const scanExpression = (expr: string, opts: ScanOptions): string => {
  const detectOnly = isDetectMode(opts);
  const escapeComma = !detectOnly && !!opts.escapeComma;
  const escapeSemicolon = !detectOnly && !!opts.escapeSemicolon;
  const escapeColon = !detectOnly && !!opts.escapeColon;
  // Separate depth counters per bracket type to avoid cross-type mismatches
  let parenDepth = 0;   // ()
  let bracketDepth = 0; // []
  let braceDepth = 0;   // {}
  const parts: string[] = [];
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    // Skip quoted strings: copy "..." verbatim (unclosed quote consumes to end)
    if (ch === '"') {
      let j = i + 1;
      while (j < expr.length) {
        if (expr[j] === '\\') {
          j += 2;
          continue;
        }
        if (expr[j] === '"') {
          break;
        }
        j++;
      }
      // end = closing quote position, or last char if unclosed.
      // slice(i, end + 1) captures the full quoted segment (including both quotes).
      // Setting i = end lets the for-loop's i++ advance past the closing quote.
      const end = j < expr.length ? j : expr.length - 1;
      if (!detectOnly) {
        parts.push(expr.slice(i, end + 1));
      }
      i = end;
      continue;
    }
    // Skip backslash-escaped chars: \, \; \( \) \[ \] \{ \} etc.
    if (ch === '\\' && i + 1 < expr.length) {
      if (!detectOnly) {
        parts.push(ch, expr[i + 1]);
      }
      i++;
      continue;
    }
    if (ch === '(') {
      parenDepth++;
      if (!detectOnly) {
        parts.push(ch);
      }
      continue;
    }
    if (ch === '[') {
      bracketDepth++;
      if (!detectOnly) {
        parts.push(ch);
      }
      continue;
    }
    if (ch === '{') {
      braceDepth++;
      if (!detectOnly) {
        parts.push(ch);
      }
      continue;
    }
    if (ch === ')') {
      if (parenDepth > 0) {
        parenDepth--;
      }
      if (!detectOnly) {
        parts.push(ch);
      }
      continue;
    }
    if (ch === ']') {
      if (bracketDepth > 0) {
        bracketDepth--;
      }
      if (!detectOnly) {
        parts.push(ch);
      }
      continue;
    }
    if (ch === '}') {
      if (braceDepth > 0) {
        braceDepth--;
      }
      if (!detectOnly) {
        parts.push(ch);
      }
      continue;
    }
    const isTopLevel = parenDepth === 0 && bracketDepth === 0 && braceDepth === 0;
    if (isTopLevel) {
      if (ch === ',' && (escapeComma || detectOnly)) {
        if (detectOnly) {
          return SEPARATOR_FOUND;
        }
        parts.push('\\,');
        continue;
      }
      if (ch === ';' && (escapeSemicolon || detectOnly)) {
        if (detectOnly) {
          return SEPARATOR_FOUND;
        }
        parts.push('\\;');
        continue;
      }
      if (ch === ':' && escapeColon) {
        // Insert space before : to prevent Typst named-argument parsing.
        // In mat() cells, H_+: or H_-: can be misinterpreted as named args
        // even though + and - are not word chars. Always add space when
        // preceded by any non-whitespace character.
        if (i > 0 && expr[i - 1] !== ' ') {
          parts.push(' :');
        } else {
          parts.push(':');
        }
        continue;
      }
    }
    if (!detectOnly) {
      parts.push(ch);
    }
  }
  return detectOnly ? '' : parts.join('');
};

/** Escape unpaired [ and ] with backslash to prevent Typst content-block syntax.
 *  Reuses scanBracketTokens (which skips quoted strings, escaped chars, and
 *  function-call parens) and findUnpairedIndices from bracket-utils. */
/** Escape characters at given positions by prepending backslash. */
const escapeAtPositions = (expr: string, positions: ReadonlySet<number>): string => {
  const parts: string[] = [];
  for (let i = 0; i < expr.length; i++) {
    if (positions.has(i)) {
      parts.push('\\', expr[i]);
    } else {
      parts.push(expr[i]);
    }
  }
  return parts.join('');
};

const escapeUnpairedBrackets = (expr: string): string => {
  if (expr.indexOf('[') === -1 && expr.indexOf(']') === -1) {
    return expr;
  }
  const allBrackets = scanBracketTokens(expr);
  const squareBrackets = allBrackets.filter(b => b.char === '[' || b.char === ']');
  if (squareBrackets.length === 0) {
    return expr;
  }
  const unpairedTokenIndices = findUnpairedIndices(squareBrackets.map(b => b.char));
  if (unpairedTokenIndices.size === 0) {
    return expr;
  }
  const unpairedPositions = new Set<number>();
  for (const idx of unpairedTokenIndices) {
    unpairedPositions.add(squareBrackets[idx].pos);
  }
  return escapeAtPositions(expr, unpairedPositions);
};

/** Escape , ; and : at depth 0, and unpaired [ ] in content placed inside any Typst function call.
 *  Uses backslash escapes (\, \;) and space-before-colon (word: → word :) to prevent
 *  Typst from parsing as argument separators or named arguments.
 *  Skips content inside "..." strings and already-escaped sequences. */
export const escapeContentSeparators = (expr: string): string =>
  scanExpression(escapeUnpairedBrackets(expr), {
    escapeComma: true,
    escapeSemicolon: true,
    escapeColon: true
  });

/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  For colons: inserts space before : when preceded by identifier.
 *  Also replaces unpaired brackets with Typst symbol names (bracket.l etc.). */
export const escapeCasesSeparators = (expr: string): string =>
  scanExpression(replaceUnpairedBrackets(expr), {
    escapeComma: true,
    escapeSemicolon: true,
    escapeColon: true
  });

/** Escape ; and : at depth 0 — for mat() rows where commas are intentional column separators.
 *  Replaces unpaired brackets with Typst symbol names. */
export const escapeMatrixRowSeparators = (expr: string): string =>
  scanExpression(replaceUnpairedBrackets(expr), {
    escapeSemicolon: true,
    escapeColon: true
  });

/** Check whether a Typst expression contains , or ; at top level (outside (), [] and {}).
 *  Skips content inside "..." strings (handles escaped quotes). */
export const hasTopLevelSeparators = (expr: string): boolean =>
  scanExpression(expr, { detectOnly: true }) === SEPARATOR_FOUND;

/** Escape top-level ; → \; and colons after identifiers (word :) inside lr() content.
 *  Commas are safe in lr.  Skips content inside "..." strings and backslash-escaped chars. */
export const escapeLrSemicolons = (expr: string): string =>
  scanExpression(expr, {
    escapeSemicolon: true,
    escapeColon: true
  });

/** Escape inner bracket characters inside lr() content so Typst doesn't auto-scale them.
 *  lr() auto-scales ALL unescaped delimiters inside it, but \left...\right only scales
 *  its own pair.  `chars` specifies which bracket characters to escape (defaults to all).
 *  Reuses scanBracketTokens which skips syntax parens (function calls, subscript/
 *  superscript grouping), quoted strings, and already-escaped chars. */
export const escapeLrBrackets = (expr: string, chars?: ReadonlySet<string>): string => {
  if (!RE_BRACKET_CHARS.test(expr)) {
    return expr;
  }
  const brackets = scanBracketTokens(expr);
  if (brackets.length === 0) {
    return expr;
  }
  const positions = new Set<number>();
  for (const b of brackets) {
    if (!chars || chars.has(b.char)) {
      positions.add(b.pos);
    }
  }
  if (positions.size === 0) {
    return expr;
  }
  return escapeAtPositions(expr, positions);
};

/** Escape unbalanced parentheses: ( → "(" and ) → ")".
 *  Prevents lone parens from being parsed as Typst syntax (group open/close)
 *  inside wrapping function calls like overline(), cancel(), etc.
 *  Uses scanBracketTokens (which skips syntax parens, quoted strings,
 *  and escaped chars) + findUnpairedIndices for reliable pairing. */
export const escapeUnbalancedParens = (content: string): string => {
  if (content.indexOf('(') === -1 && content.indexOf(')') === -1) {
    return content;
  }
  const allBrackets = scanBracketTokens(content);
  const parens = allBrackets.filter(b => b.char === '(' || b.char === ')');
  if (parens.length === 0) {
    return content;
  }
  const unpairedTokenIndices = findUnpairedIndices(parens.map(b => b.char));
  if (unpairedTokenIndices.size === 0) {
    return content;
  }
  const unpairedPositions = new Set<number>();
  for (const idx of unpairedTokenIndices) {
    unpairedPositions.add(parens[idx].pos);
  }
  return escapeAtPositions(content, unpairedPositions);
};


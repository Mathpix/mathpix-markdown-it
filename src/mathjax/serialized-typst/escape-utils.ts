/**
 * Unified expression scanner for Typst escape operations.
 *
 * Walks a Typst expression tracking bracket depth, skips quoted strings ("...")
 * and backslash-escaped characters, applies escape/detection at depth 0.
 */

import { RE_WORD_CHAR } from "./consts";
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
  /** Escape unbalanced closing parens at depth 0: ) → ")" (only parentheses, not ] or }) */
  escapeUnbalancedCloseParen?: boolean;
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
  const escapeUnbalancedCloseParen = !detectOnly && !!opts.escapeUnbalancedCloseParen;
  // Separate depth counters per bracket type to avoid cross-type mismatches
  let parenDepth = 0;   // ()
  let bracketDepth = 0; // []
  let braceDepth = 0;   // {}
  let result = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    // Skip quoted strings: copy "..." verbatim (unclosed quote consumes to end)
    if (ch === '"') {
      let j = i + 1;
      while (j < expr.length) {
        if (expr[j] === '\\') { j += 2; continue; }
        if (expr[j] === '"') break;
        j++;
      }
      const end = j < expr.length ? j : expr.length - 1;
      if (!detectOnly) { result += expr.slice(i, end + 1); }
      i = end;
      continue;
    }
    // Skip backslash-escaped chars: \, \; \( \) \[ \] \{ \} etc.
    if (ch === '\\' && i + 1 < expr.length) {
      if (!detectOnly) { result += ch + expr[i + 1]; }
      i++;
      continue;
    }
    if (ch === '(') { parenDepth++; if (!detectOnly) result += ch; continue; }
    if (ch === '[') { bracketDepth++; if (!detectOnly) result += ch; continue; }
    if (ch === '{') { braceDepth++; if (!detectOnly) result += ch; continue; }
    if (ch === ')') {
      if (escapeUnbalancedCloseParen) {
        if (parenDepth > 0) {
          parenDepth--;
          result += ch;
        } else {
          result += '")"';
        }
        continue;
      }
      if (parenDepth > 0) parenDepth--;
      if (!detectOnly) result += ch;
      continue;
    }
    if (ch === ']') {
      if (bracketDepth > 0) bracketDepth--;
      if (!detectOnly) result += ch;
      continue;
    }
    if (ch === '}') {
      if (braceDepth > 0) braceDepth--;
      if (!detectOnly) result += ch;
      continue;
    }
    const isTopLevel = parenDepth === 0 && bracketDepth === 0 && braceDepth === 0;
    if (isTopLevel) {
      if (ch === ',' && (escapeComma || detectOnly)) {
        if (detectOnly) return SEPARATOR_FOUND;
        result += '\\,';
        continue;
      }
      if (ch === ';' && (escapeSemicolon || detectOnly)) {
        if (detectOnly) return SEPARATOR_FOUND;
        result += '\\;';
        continue;
      }
      if (ch === ':' && escapeColon) {
        // Check the preceding char in the source expression, not the transformed result,
        // so other transformations cannot affect colon-spacing logic
        if (i > 0 && RE_WORD_CHAR.test(expr[i - 1])) {
          result += ' :';
        } else {
          result += ':';
        }
        continue;
      }
    }
    if (!detectOnly) { result += ch; }
  }
  return detectOnly ? '' : result;
};

/** Escape unpaired [ and ] with backslash to prevent Typst content-block syntax.
 *  Reuses scanBracketTokens (which skips quoted strings, escaped chars, and
 *  function-call parens) and findUnpairedIndices from bracket-utils. */
const escapeUnpairedBrackets = (expr: string): string => {
  if (expr.indexOf('[') === -1 && expr.indexOf(']') === -1) return expr;
  const allBrackets = scanBracketTokens(expr);
  const squareBrackets = allBrackets.filter(b => b.char === '[' || b.char === ']');
  if (squareBrackets.length === 0) return expr;
  const unpairedTokenIndices = findUnpairedIndices(squareBrackets.map(b => b.char));
  if (unpairedTokenIndices.size === 0) return expr;
  const unpairedPositions = new Set<number>();
  for (const idx of unpairedTokenIndices) {
    unpairedPositions.add(squareBrackets[idx].pos);
  }
  let result = '';
  for (let i = 0; i < expr.length; i++) {
    if (unpairedPositions.has(i)) {
      result += '\\' + expr[i];
    } else {
      result += expr[i];
    }
  }
  return result;
};

/** Escape , ; and : at depth 0, and unpaired [ ] in content placed inside any Typst function call.
 *  Uses backslash escapes (\, \;) and space-before-colon (word: → word :) to prevent
 *  Typst from parsing as argument separators or named arguments.
 *  Skips content inside "..." strings and already-escaped sequences. */
export const escapeContentSeparators = (expr: string): string =>
  scanExpression(escapeUnpairedBrackets(expr), { escapeComma: true, escapeSemicolon: true, escapeColon: true });

/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  For colons: inserts space before : when preceded by identifier.
 *  Also replaces unpaired brackets with Typst symbol names (bracket.l etc.). */
export const escapeCasesSeparators = (expr: string): string =>
  scanExpression(replaceUnpairedBrackets(expr), { escapeComma: true, escapeSemicolon: true, escapeColon: true });

/** Check whether a Typst expression contains , or ; at top level (outside (), [] and {}).
 *  Skips content inside "..." strings (handles escaped quotes). */
export const hasTopLevelSeparators = (expr: string): boolean =>
  scanExpression(expr, { detectOnly: true }) === SEPARATOR_FOUND;

/** Escape top-level ; → \; inside lr() content (commas are safe in lr).
 *  Skips content inside "..." strings and backslash-escaped chars. */
export const escapeLrSemicolons = (expr: string): string =>
  scanExpression(expr, { escapeSemicolon: true });

/** Escape unbalanced closing parentheses at depth 0: ) → ")".
 *  Prevents premature closure of wrapping function calls. */
export const escapeUnbalancedParens = (content: string): string =>
  scanExpression(content, { escapeUnbalancedCloseParen: true });


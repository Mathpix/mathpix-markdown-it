/**
 * Unified expression scanner for Typst escape operations.
 *
 * All escape functions share the same infrastructure: walk a Typst expression
 * tracking bracket depth, skip quoted strings ("...") and backslash-escaped
 * characters, and apply operations on specific characters at depth 0.
 *
 * This module consolidates five previously duplicated implementations into
 * a single parametric scanner with thin wrappers preserving the original API.
 */

interface ScanOptions {
  /** Escape commas at depth 0: , → \, */
  escapeComma?: boolean;
  /** Escape semicolons at depth 0: ; → \; */
  escapeSemicolon?: boolean;
  /** Escape colons at depth 0: word: → word : (space prevents named-arg parsing) */
  escapeColon?: boolean;
  /** Escape unbalanced closing parens at depth 0: ) → ")" */
  escapeUnbalancedClose?: boolean;
  /** Detection mode: return early with 'found' if , or ; at depth 0 */
  detectOnly?: boolean;
}

/**
 * Walk a Typst expression tracking bracket depth, skipping quoted strings
 * and backslash-escaped characters. Apply escape/detection per opts.
 *
 * In detectOnly mode: returns '' if no separator found, or 'found' on first hit.
 * In transform mode: returns the escaped expression string.
 */
const scanExpression = (expr: string, opts: ScanOptions): string => {
  let depth = 0;
  let result = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];

    // Skip quoted strings: copy "..." verbatim
    if (ch === '"') {
      let j = i + 1;
      while (j < expr.length) {
        if (expr[j] === '\\') { j += 2; continue; }
        if (expr[j] === '"') break;
        j++;
      }
      if (j < expr.length) {
        if (opts.detectOnly) { i = j; continue; }
        result += expr.slice(i, j + 1);
        i = j;
        continue;
      }
    }

    // Skip backslash-escaped chars: \, \; \( \) \[ \] \{ \} etc.
    if (ch === '\\' && i + 1 < expr.length) {
      if (!opts.detectOnly) { result += ch + expr[i + 1]; }
      i++;
      continue;
    }

    // Track bracket depth
    if (ch === '(' || ch === '[' || ch === '{') {
      if (!opts.escapeUnbalancedClose || ch === '(') { depth++; }
      else { depth++; }
      if (!opts.detectOnly) { result += ch; }
      continue;
    }
    if (ch === ')' || ch === ']' || ch === '}') {
      if (opts.escapeUnbalancedClose) {
        // Only track ( ) pairs for unbalanced-close mode
        if (ch === ')') {
          if (depth > 0) { depth--; result += ch; }
          else { result += '")"'; }
        } else {
          if (depth > 0) depth--;
          result += ch;
        }
        continue;
      }
      if (depth > 0) { depth--; }
      if (!opts.detectOnly) { result += ch; }
      continue;
    }

    // At depth 0: apply escape/detection operations
    if (depth === 0) {
      if (ch === ',' && (opts.escapeComma || opts.detectOnly)) {
        if (opts.detectOnly) return 'found';
        result += '\\,';
        continue;
      }
      if (ch === ';' && (opts.escapeSemicolon || opts.detectOnly)) {
        if (opts.detectOnly) return 'found';
        result += '\\;';
        continue;
      }
      if (ch === ':' && opts.escapeColon) {
        if (result.length > 0 && /\w/.test(result[result.length - 1])) {
          result += ' :';
        } else {
          result += ':';
        }
        continue;
      }
    }

    if (!opts.detectOnly) { result += ch; }
  }
  return opts.detectOnly ? '' : result;
};

/** Escape , and ; at depth 0 in content placed inside any Typst function call.
 *  Uses backslash escapes (\, and \;) per official Typst documentation.
 *  Skips content inside "..." strings and already-escaped sequences. */
export const escapeContentSeparators = (expr: string): string =>
  scanExpression(expr, { escapeComma: true, escapeSemicolon: true });

/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  For colons: inserts space before : when preceded by identifier. */
export const escapeCasesSeparators = (expr: string): string =>
  scanExpression(expr, { escapeComma: true, escapeSemicolon: true, escapeColon: true });

/** Check whether a Typst expression contains , or ; at parenthesis depth 0.
 *  Skips content inside "..." strings (handles escaped quotes). */
export const hasTopLevelSeparators = (expr: string): boolean =>
  scanExpression(expr, { detectOnly: true }) !== '';

/** Escape top-level ; → \; inside lr() content (commas are safe in lr).
 *  Skips content inside "..." strings and backslash-escaped chars. */
export const escapeLrSemicolons = (expr: string): string =>
  scanExpression(expr, { escapeSemicolon: true });

/** Escape unbalanced closing parentheses at depth 0: ) → ")".
 *  Prevents premature closure of wrapping function calls. */
export const escapeUnbalancedParens = (content: string): string =>
  scanExpression(content, { escapeUnbalancedClose: true });

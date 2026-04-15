/**
 * Unified expression scanner for Typst escape operations.
 *
 * Walks a Typst expression tracking bracket depth, skips quoted strings ("...")
 * and backslash-escaped characters, applies escape/detection at depth 0.
 */
export declare const escapeUnpairedBrackets: (expr: string) => string;
export declare const escapeUnbalancedBraces: (expr: string) => string;
/** Escape , ; : at depth 0, plus unpaired [], (), {} in content inside Typst function
 *  calls. Backslash-escapes prevent Typst from parsing them as argument separators,
 *  named arguments, or unclosed delimiters. Skips "..." strings and escaped chars. */
export declare const escapeContentSeparators: (expr: string) => string;
/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  For colons: inserts space before : when preceded by identifier.
 *  Also replaces unpaired brackets with Typst symbol names (bracket.l etc.). */
export declare const escapeCasesSeparators: (expr: string) => string;
/** Escape ; and : at depth 0 — for mat() rows where commas are intentional column separators.
 *  Replaces unpaired brackets with Typst symbol names. */
export declare const escapeMatrixRowSeparators: (expr: string) => string;
/** Check whether a Typst expression contains , or ; at top level (outside (), [] and {}).
 *  Skips content inside "..." strings (handles escaped quotes). */
export declare const hasTopLevelSeparators: (expr: string) => boolean;
/** Escape top-level ; → \; and colons after identifiers (word :) inside lr() content.
 *  Commas are safe in lr.  Skips content inside "..." strings and backslash-escaped chars. */
export declare const escapeLrSemicolons: (expr: string) => string;
/** Escape inner bracket characters inside lr() content so Typst doesn't auto-scale them.
 *  lr() auto-scales ALL unescaped delimiters inside it, but \left...\right only scales
 *  its own pair.  `chars` specifies which bracket characters to escape (defaults to all).
 *  Reuses scanBracketTokens which skips syntax parens (function calls, subscript/
 *  superscript grouping), quoted strings, and already-escaped chars. */
export declare const escapeLrBrackets: (expr: string, chars?: ReadonlySet<string>) => string;
/** Escape unbalanced parens to prevent Typst group open/close interpretation. */
export declare const escapeUnbalancedParens: (expr: string) => string;

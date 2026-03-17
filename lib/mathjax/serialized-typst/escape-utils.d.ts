/**
 * Unified expression scanner for Typst escape operations.
 *
 * Walks a Typst expression tracking bracket depth, skips quoted strings ("...")
 * and backslash-escaped characters, applies escape/detection at depth 0.
 */
/** Escape , ; and : at depth 0, and unpaired [ ] in content placed inside any Typst function call.
 *  Uses backslash escapes (\, \;) and space-before-colon (word: → word :) to prevent
 *  Typst from parsing as argument separators or named arguments.
 *  Skips content inside "..." strings and already-escaped sequences. */
export declare const escapeContentSeparators: (expr: string) => string;
/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  For colons: inserts space before : when preceded by identifier.
 *  Also replaces unpaired brackets with Typst symbol names (bracket.l etc.). */
export declare const escapeCasesSeparators: (expr: string) => string;
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
/** Escape unbalanced closing parentheses at depth 0: ) → ")".
 *  Prevents premature closure of wrapping function calls. */
export declare const escapeUnbalancedParens: (content: string) => string;

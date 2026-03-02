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
/** Escape , and ; at depth 0 in content placed inside any Typst function call.
 *  Uses backslash escapes (\, and \;) per official Typst documentation.
 *  Skips content inside "..." strings and already-escaped sequences. */
export declare const escapeContentSeparators: (expr: string) => string;
/** Escape , ; and : at depth 0 — for mat()/cases() cells where : is also a named-argument marker.
 *  For colons: inserts space before : when preceded by identifier. */
export declare const escapeCasesSeparators: (expr: string) => string;
/** Check whether a Typst expression contains , or ; at parenthesis depth 0.
 *  Skips content inside "..." strings (handles escaped quotes). */
export declare const hasTopLevelSeparators: (expr: string) => boolean;
/** Escape top-level ; → \; inside lr() content (commas are safe in lr).
 *  Skips content inside "..." strings and backslash-escaped chars. */
export declare const escapeLrSemicolons: (expr: string) => string;
/** Escape unbalanced closing parentheses at depth 0: ) → ")".
 *  Prevents premature closure of wrapping function calls. */
export declare const escapeUnbalancedParens: (content: string) => string;

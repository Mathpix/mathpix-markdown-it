export type ValidationOk = {
    ok: true;
};
export type ValidationErr = {
    ok: false;
    reason: Reason;
    extra?: string;
};
export type ValidationResult = ValidationOk | ValidationErr;
declare const VALIDATION_REASON: {
    readonly EMPTY: "empty";
    readonly TOO_LARGE: "too_large";
    readonly DOCTYPE: "doctype";
    readonly SCRIPT: "script";
    readonly JS_URI: "js_uri";
    readonly EVENT_ATTR: "event_attr";
    readonly NO_MATH: "no_math";
    readonly UNCLOSED_MATH: "unclosed_math";
    readonly BAD_XMLNS: "bad_xmlns";
    readonly BAD_TAG: "bad_tag";
    readonly UNKNOWN_TAG: "unknown_tag";
    readonly MISMATCH: "mismatch";
    readonly TOO_MANY_NODES: "too_many_nodes";
    readonly TOO_DEEP: "too_deep";
    readonly ROOT_NOT_MATH: "root_not_math";
    readonly TEXT_OUTSIDE_TEXT_CONTAINER: "text_outside_text_container";
    readonly UNCLOSED_COMMENT: "unclosed_comment";
    readonly UNCLOSED_CDATA: "unclosed_cdata";
    readonly UNCLOSED_PI: "unclosed_pi";
    readonly UNCLOSED_DECL: "unclosed_decl";
    readonly UNCLOSED_QUOTE: "unclosed_quote";
    readonly UNCLOSED_TAG: "unclosed_tag";
    readonly UNCLOSED_TAGS: "unclosed_tags";
};
type Reason = typeof VALIDATION_REASON[keyof typeof VALIDATION_REASON];
declare const DEFAULT_VALIDATION_LIMITS: {
    readonly maxBytes: 1000000;
    readonly maxDepth: 80;
    readonly maxNodes: 50000;
};
/**
 * Shallow & fast MathML pre-validation for MathJax (SVG).
 *
 * - Extracts the first `<math>…</math>` fragment.
 * - Blocks obvious hazards (doctype, script, javascript: URLs, event handlers).
 * - Ensures balanced tags with a tiny stack (not a full XML parser).
 * - Allows visible text only inside `mi/mn/mo/mtext/ms`.
 * - Ignores content inside `<annotation>` / `<annotation-xml>`.
 *
 * Not a full XML/DTD validator. Intended to be extremely fast and safe before
 * passing MathML to MathJax. O(N) over the `<math>` fragment, no allocations
 * beyond a small stack.
 */
export declare const validateMathMLShallow: (source: string, limits?: Partial<typeof DEFAULT_VALIDATION_LIMITS>) => ValidationResult;
export {};

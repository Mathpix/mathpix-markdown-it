type TExtractedCodeBlock = {
    id: string;
    content: string;
};
/**
 * Clear all previously extracted code blocks.
 */
export declare const ClearExtractedCodeBlocks: () => void;
/**
 * Add a single extracted code block to the internal storage.
 */
export declare const addExtractedCodeBlock: (item: TExtractedCodeBlock) => void;
/**
 * Replace placeholder markers (<<id>> / <id>) with extracted code block content.
 * Newline-wrapping is applied ONLY when injected content contains BEGIN_LIST_ENV_INLINE_RE.
 * Note: does NOT call getContent; callers should normalize once at the end.
 */
export declare const getExtractedCodeBlockContent: (inputStr: string, i: number) => string;
/**
 * Post-process inline code-like items in an array of results:
 * for items of the given `type` replace their content using
 * `getExtractedCodeBlockContent`.
 */
export declare const codeInlineContent: (res: any, type?: string) => any;
/**
 * Replaces all inline code spans in the given string with `{id}` placeholders
 * and stores the original code in an external table via `mathTablePush`.
 *
 * Flow:
 *  1. First hides fenced/LaTeX code blocks via `getSubCodeBlock`.
 *  2. Then finds inline code spans (e.g. `...` or ``...``) with
 *     `getInlineCodeListFromString`.
 *  3. For each span: generates an id, pushes `{ id, content }` to math table,
 *     and replaces the span in the text with `{id}`.
 *
 * @param input - Original source string.
 * @returns String where inline code is replaced by `{id}` placeholders.
 */
export declare const getSubCode: (input: string) => string;
export {};

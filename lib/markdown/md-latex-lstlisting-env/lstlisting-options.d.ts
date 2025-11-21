export type ParsedLstLanguage = {
    /** Base language name, e.g. "Ada" or "Assembler". */
    name: string;
    /** Optional dialect name, e.g. "2005" or "riscv". */
    dialect: string | null;
    hlName: string;
};
/**
 * Apply LaTeX lstlisting-like options to a Markdown-It token.
 *
 * - Parses raw lst options into a structured attributes object.
 * - Parses `language` into `{ name, dialect }` via `parseLstLanguage`.
 * - Stores all attributes under `token.meta.attributes`.
 * - If `mathescape` is enabled, replaces `token.children` with a math-aware
 *   inline parse of the code content (no links/emphasis).
 *
 * This function mutates the given token in-place.
 */
export declare const applyLstListingOptionsToToken: (token: any, content: string, opts: string | null | undefined, state: any) => void;

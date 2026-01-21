type SetTokensBlockParseOptions = {
    startLine?: number;
    endLine?: number;
    isInline?: boolean;
    contentPositions?: any;
    forPptx?: boolean;
    disableBlockRules?: boolean;
};
/**
 * Parses a block of content with markdown-it and pushes the resulting
 * block tokens into the current state, with optional control over
 * line mapping, inline rendering, PPTX-specific behavior and temporary
 * disabling of selected block rules (list/blockquote/fence/heading).
 */
export declare const SetTokensBlockParse: (state: any, content: string, options?: SetTokensBlockParseOptions) => void;
type ParseIntoTokenChildrenOptions = {
    /** If true, temporarily disables selected markdown-it block rules (e.g. lists). */
    disableBlockRules?: boolean;
};
/**
 * Parses a markdown fragment into block tokens and appends them to `token.children`.
 * Optionally disables a predefined set of markdown-it block rules (see `defaultRulesToDisable`)
 * and neutralizes leading block markers on the first line to prevent accidental block parsing.
 * @param state - markdown-it parsing state.
 * @param content - Markdown fragment to parse.
 * @param token - Target token that will receive parsed children.
 * @param opts - Parsing options.
 * @returns Parsed child tokens (also appended to `token.children`).
 */
export declare const parseBlockIntoTokenChildren: (state: any, content: string, token: Token, opts?: ParseIntoTokenChildrenOptions) => any[];
export {};

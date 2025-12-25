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
export {};

type RenderInlineTokenBlockResult = {
    /** Rendered HTML table markup. */
    table: string;
    /** TSV rows: each row is an array of cell strings. */
    tsv: string[][];
    /** CSV rows: each row is an array of cell strings. */
    csv: string[][];
    /** Markdown rows: each row is an array of cell strings. */
    tableMd: string[][];
    /** Smoothed rows: each row is an array of cell strings. */
    tableSmoothed: string[][];
    /** LaTeX column spec / alignment string captured from the token stream, if available. */
    align: string;
};
/**
 * Renders a markdown-it token stream representing an HTML table (or LaTeX tabular)
 * into HTML markup and parallel TSV/CSV/Markdown/"smoothed" table representations.
 * Also handles nested tabular blocks and list tokens inside table cells.
 *
 * @param tokens - Token stream to render.
 * @param options - Renderer options (pptx/docx/xhtml, etc.).
 * @param env - Rendering environment.
 * @param slf - Markdown-it renderer instance.
 * @param isSubTable - Whether the current table is nested inside another table cell.
 * @param highlight - Optional highlight metadata applied to table cells.
 * @returns Rendered table outputs in multiple formats.
 */
export declare const renderInlineTokenBlock: (tokens: any, options: any, env: any, slf: any, isSubTable?: boolean, highlight?: any) => RenderInlineTokenBlockResult;
export declare const renderTabularInline: (a: any, token: any, options: any, env: any, slf: any) => string;
export {};

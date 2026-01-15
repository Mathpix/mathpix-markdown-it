export type RenderTableCellContentResult = {
    /** Rendered HTML (or text) for the cell, depending on renderer/options. */
    content: string;
    /** TSV-safe representation of the cell. */
    tsv: string;
    /** CSV-safe representation of the cell. */
    csv: string;
    /** Markdown representation of the cell for table output. */
    tableMd: string;
    /** "Smoothed" representation used for PPTX/DOCX or other layout-sensitive outputs. */
    tableSmoothed: string;
};
/**
 * Renders a table cell token into multiple parallel representations:
 * HTML/text (`content`), TSV, CSV, Markdown (`tableMd`), and a "smoothed" variant
 * used for DOCX/PPTX where line wrapping and block-like inline tokens matter.
 *
 * This function is recursive: inline children may contain nested tabular content.
 *
 * @param token - Cell token (or inline token) whose children form the cell content.
 * @param isSubTable - True if the current token is being rendered inside a nested table context.
 * @param options - Rendering options (DOCX/PPTX/markdown math settings).
 * @param env - Markdown-it rendering environment.
 * @param slf - Markdown-it renderer instance (must support renderInline).
 * @returns Combined render outputs for this cell.
 */
export declare const renderTableCellContent: (token: any, isSubTable: boolean, options: any, env: any, slf: any) => RenderTableCellContentResult;

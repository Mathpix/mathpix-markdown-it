/** Canvas unwraps these, and their payload becomes visible body text. */
export declare const HIDDEN_SOURCE_TAGS: Record<string, true>;
/** A Canvas page body is capped at `500.kilobytes - 1` (config/initializers/active_record.rb). */
export declare const CANVAS_PAGE_BODY_LIMIT: number;
export interface ICanvasWarnings {
    /** Size of the result in bytes, the unit Canvas caps. */
    bytes: number;
    /** The result does not fit a Canvas page and would be refused on save. */
    overPageLimit: boolean;
    /** Structures carried as their SMILES source, since Canvas deletes the drawing. */
    chemistry: number;
    /** Images with no alt text, which Canvas reports in its own accessibility check. */
    imagesWithoutAlt: number;
    /** Bold that could not travel as `strong`, so a Canvas page renders it unweighted. */
    boldDropped: number;
}
/**
 * @internal Applied once, by `markdownToCanvasHTML`. A second application would shift the headings
 * again and re-prepend the structural declarations.
 */
export declare const applyCanvasProfile: (html: string) => string;
/** `beforeProfile` is the rendered HTML: what the profile removed can only be counted there. */
export declare const canvasWarnings: (html: string, beforeProfile?: string) => ICanvasWarnings;

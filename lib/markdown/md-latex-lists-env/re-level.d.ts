import type Token from "markdown-it/lib/token";
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
/** Default LaTeX itemize bullet styles */
export declare let itemizeLevelDefaults: string[];
/** Plain-text fallback markers for itemize levels 1..N (TSV/CSV/MD). */
export declare const itemizeLevelPlainDefaults: string[];
/** Default enumerate styles for CSS list-style-type */
export declare let enumerateLevelDefaults: string[];
/** Active itemize levels (mutable state) */
export declare let itemizeLevel: string[];
/** Active enumerate levels (mutable state) */
export declare let enumerateLevel: string[];
/** Parsed tokens for itemize bullets */
export declare let itemizeLevelTokens: Token[][];
/**
 * Reset and return default itemize bullet definitions.
 */
export declare const SetDefaultItemizeLevel: () => string[];
/**
 * Reset and return default enumerate level definitions.
 */
export declare const SetDefaultEnumerateLevel: () => string[];
/**
 * Return itemize level array (or fallback to defaults).
 */
export declare const GetItemizeLevel: (data?: string[] | null) => string[];
/**
 * Return enumerate level array (or fallback to defaults).
 */
export declare const GetEnumerateLevel: (data?: string[] | null) => string[];
/** Return structure of parsed tokens + raw bullet content */
export interface ItemizeLevelTokenResult {
    tokens: Token[][];
    contents: string[];
}
/**
 * Parse bullet tokens for all itemize levels.
 */
export declare const SetItemizeLevelTokens: (state: StateBlock | StateInline) => ItemizeLevelTokenResult;
/**
 * Parse bullet tokens for a specific itemize level index.
 */
export declare const SetItemizeLevelTokensByIndex: (state: StateBlock | StateInline, index: number) => void;
/**
 * Returns cached itemize level tokens or provided subset.
 */
export declare const GetItemizeLevelTokens: (data?: Token[][] | null) => Token[][];
/**
 * Get both bullet content and parsed tokens from state.
 */
export declare const GetItemizeLevelTokensByState: (state: StateBlock | StateInline) => ItemizeLevelTokenResult;
/**
 * Change list style for \labelitemi, \labelenumi etc.
 * Supports both itemize and enumerate levels.
 */
export declare const ChangeLevel: (state: StateBlock | StateInline, data: {
    command?: string;
    params?: string;
}) => boolean;
/**
 * Clears stored itemize level token cache.
 */
export declare const clearItemizeLevelTokens: () => void;
/**
 * Returns a plain-text list marker for a given itemize nesting level.
 * Ensures the level is at least 1 and clamps it to the available defaults.
 *
 * @param level - Itemize nesting level (1-based).
 * @returns Plain-text marker suitable for TSV/CSV/Markdown export.
 */
export declare const getItemizePlainMarker: (level: number) => string;

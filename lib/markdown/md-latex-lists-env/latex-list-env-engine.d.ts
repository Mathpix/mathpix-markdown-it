import type Token from 'markdown-it/lib/token';
import { BufferedBlockState } from "./latex-list-types";
/** Shallow clone but shift known position fields by baseOffset */
export declare const shiftTokenAbsolutePositions: (tok: any, baseOffset: number) => any;
/**
 * Builds a minimal StateBlock-like object from a raw LaTeX environment string.
 *
 * Notes:
 * - Normalizes CRLF to LF.
 * - Computes `bMarks/eMarks/tShift` so `state.src.slice(bMarks[i]+tShift[i], eMarks[i])`
 *   matches each logical line (without a trailing "\n" after the last line).
 * - `env` is shallow-copied and forced to `{ isBlock: true }` for downstream checks.
 */
export declare const buildBlockStateFromRaw: (md: any, raw: string, baseEnv: any) => any;
/**
 * Creates a buffered state that collects tokens into a local array instead of
 * mutating the original StateBlock tokens immediately.
 *
 * Useful when you want "all-or-nothing" token emission (e.g., for inline reuse,
 * strict parsing, rollback on failure).
 */
export declare const createBufferedState: (state: StateBlock) => BufferedBlockState;
/**
 * Run ListsInternal on raw env and return produced tokens.
 * baseOffset used later to shift positions to absolute.
 */
export declare const parseListEnvRawToTokens: (md: any, raw: string, baseEnv: any) => {
    ok: boolean;
    tokens: any[];
    state: any;
};
/**
 * Push cloned tokens into inline state and shift local positions by baseOffset.
 */
export declare const flushTokensToInline: (inlineState: StateInline, tokens: any[], baseOffset: number) => void;
/**
 * Flushes buffered tokens into the real StateBlock using state.push().
 * This preserves markdown-it internal level mechanics.
 *
 * NOTE:
 * - Do not blindly overwrite `level` during assignment, since state.push() already
 *   applies correct nesting transitions. Prefer safeAssignToken() that skips level.
 */
export declare const flushBufferedTokens: (state: StateBlock, buffered: Token[]) => void;
/**
 * Safe assign: copy custom fields but do NOT overwrite core ones that markdown-it sets.
 */
export declare const safeAssignToken: (target: any, src: any) => any;

import TokenCtor = require('markdown-it/lib/token');
import type Token from 'markdown-it/lib/token';
import type StateInline from "markdown-it/lib/rules_inline/state_inline";
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import { ListsInternal } from "./latex-list-env-block";
import { BufferedBlockState, PushFn } from "./latex-list-types";

/** Shallow clone but shift known position fields by baseOffset */
export const shiftTokenAbsolutePositions = (tok: any, baseOffset: number) => {
  if (!baseOffset) return tok;

  // inlinePos is the important one in your lists
  if (tok.inlinePos && typeof tok.inlinePos === "object") {
    if (typeof tok.inlinePos.start_content === "number")
      tok.inlinePos.start_content += baseOffset;
    if (typeof tok.inlinePos.end_content === "number")
      tok.inlinePos.end_content += baseOffset;
    if (typeof tok.inlinePos.start === "number")
      tok.inlinePos.start += baseOffset;
    if (typeof tok.inlinePos.end === "number")
      tok.inlinePos.end += baseOffset;
  }

  // Optional: shift token.map if you store absolute line mapping somewhere (rare in inline)
  // if (tok.map && Array.isArray(tok.map)) { ... }

  // Shift markerTokens too (if they have inlinePos)
  if (tok.markerTokens && Array.isArray(tok.markerTokens)) {
    for (const child of tok.markerTokens) {
      shiftTokenAbsolutePositions(child, baseOffset);
    }
  }

  // Shift children if some later pipeline attaches them (rare here, but safe)
  if (tok.children && Array.isArray(tok.children)) {
    for (const child of tok.children) {
      shiftTokenAbsolutePositions(child, baseOffset);
    }
  }

  return tok;
};

/**
 * Builds a minimal StateBlock-like object from a raw LaTeX environment string.
 *
 * Notes:
 * - Normalizes CRLF to LF.
 * - Computes `bMarks/eMarks/tShift` so `state.src.slice(bMarks[i]+tShift[i], eMarks[i])`
 *   matches each logical line (without a trailing "\n" after the last line).
 * - `env` is shallow-copied and forced to `{ isBlock: true }` for downstream checks.
 */
export const buildBlockStateFromRaw = (md: any, raw: string, baseEnv: any) => {
  const normalized: string = raw.replace(/\r\n/g, "\n");
  const lines: string[] = normalized.split("\n");

  const st: any = {
    md,
    src: normalized,
    env: { ...(baseEnv || {}), isBlock: true, isInline: true },
    tokens: [],
    bMarks: [],
    eMarks: [],
    tShift: [],
    line: 0,
    startLine: 0,
    lineMax: lines.length,
    parentType: "root",
    level: 0,
    prentLevel: 0,
  };

  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    st.bMarks[i] = offset;
    st.tShift[i] = 0;
    offset += lines[i].length;
    st.eMarks[i] = offset;
    // Only add '\n' between lines (not after last line)
    if (i !== lines.length - 1) offset += 1;
  }

  st.push = (type: string, tag: string, nesting: number) => {
    // const tok = new (Token as any)(type, tag, nesting);
    const tok = new TokenCtor(type, tag, nesting);
    tok.block = true;
    tok.level = st.level;

    if (nesting === 1) st.level++;
    if (nesting === -1) st.level--;

    st.tokens.push(tok);
    return tok;
  };

  return st;
};

/**
 * Creates a buffered state that collects tokens into a local array instead of
 * mutating the original StateBlock tokens immediately.
 *
 * Useful when you want "all-or-nothing" token emission (e.g., for inline reuse,
 * strict parsing, rollback on failure).
 */
export const createBufferedState = (state: StateBlock): BufferedBlockState => {
  // prototype-inherit all read-only properties (bMarks, eMarks, src, etc.)
  const tempState = Object.create(state) as BufferedBlockState;
  // isolate tokens + env
  tempState.tokens = [];
  // tempState.env = { ...(state.env || {}) };

  // IMPORTANT: start from current level, and advance/decrease with nesting
  tempState.level = state.level;

  tempState.push = ((type: string, tag: string, nesting: number) => {
    // const tok = new (Token as any)(type, tag, nesting);
    const tok = new TokenCtor(type, tag, nesting);
    tok.block = true;
    tok.level = tempState.level;

    // Maintain level changes the same way markdown-it does
    if (nesting === 1) tempState.level++;
    if (nesting === -1) tempState.level--;

    tempState.tokens.push(tok);
    return tok;
  }) as PushFn<Token>;

  return tempState;
};


/**
 * Run ListsInternal on raw env and return produced tokens.
 * baseOffset used later to shift positions to absolute.
 */
export const parseListEnvRawToTokens = (
  md: any,
  raw: string,
  baseEnv: any
): { ok: boolean; tokens: any[]; state: any } => {
  const blockState = buildBlockStateFromRaw(md, raw, baseEnv);
  const ok = ListsInternal(blockState, 0, blockState.lineMax);
  return { ok, tokens: blockState.tokens, state: blockState };
};

/**
 * Push cloned tokens into inline state and shift local positions by baseOffset.
 */
export const flushTokensToInline = (
  inlineState: StateInline,
  tokens: any[],
  baseOffset: number
) => {
  for (const srcToken of tokens) {
    const tok = inlineState.push(srcToken.type, srcToken.tag, srcToken.nesting);
    // Copy fields safely
    safeAssignToken(tok, srcToken);
    // Fix positions
    shiftTokenAbsolutePositions(tok, baseOffset);
  }
};

/**
 * Flushes buffered tokens into the real StateBlock using state.push().
 * This preserves markdown-it internal level mechanics.
 *
 * NOTE:
 * - Do not blindly overwrite `level` during assignment, since state.push() already
 *   applies correct nesting transitions. Prefer safeAssignToken() that skips level.
 */
export const flushBufferedTokens = (state: StateBlock, buffered: Token[]): void => {
  for (const t of buffered) {
    const tok = state.push(t.type, t.tag, t.nesting);
    safeAssignToken(tok, t);
  }
};

/**
 * Safe assign: copy custom fields but do NOT overwrite core ones that markdown-it sets.
 */
export const safeAssignToken = (target: any, src: any) => {
  const SKIP = new Set(["type", "tag", "nesting", "level", "block"]);

  for (const key of Object.keys(src)) {
    if (SKIP.has(key)) continue;
    target[key] = src[key];
  }

  return target;
};

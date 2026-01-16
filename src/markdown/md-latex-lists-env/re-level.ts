import type Token from "markdown-it/lib/token";
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';

import {
  ENUM_LEVEL_COMMANDS, ENUM_STYLES, ITEM_LEVEL_COMMANDS,
  LATEX_ENUM_STYLE_KEY_RE,
  LATEX_ENUM_STYLE_RE
} from "../common/consts";

/** Default LaTeX itemize bullet styles */
export let itemizeLevelDefaults: string[] = [
  "\\textbullet", //"•"
  "\\textendash", //"–"
  "\\textasteriskcentered", //"∗"
  "\\textperiodcentered", //"·"
];

/** Default enumerate styles for CSS list-style-type */
export let enumerateLevelDefaults: string[] = [
  "decimal",
  "lower-alpha",
  "lower-roman",
  "upper-alpha",
];

/** Active itemize levels (mutable state) */
export let itemizeLevel: string[] = [];
/** Active enumerate levels (mutable state) */
export let enumerateLevel: string[] = [];
/** Parsed tokens for itemize bullets */
export let itemizeLevelTokens: Token[][] = [];

/**
 * Reset and return default itemize bullet definitions.
 */
export const SetDefaultItemizeLevel = (): string[] => {
  itemizeLevel = [...itemizeLevelDefaults];
  return itemizeLevel;
};

/**
 * Reset and return default enumerate level definitions.
 */
export const SetDefaultEnumerateLevel = (): string[] => {
  enumerateLevel = [...enumerateLevelDefaults];
  return enumerateLevel;
};

/**
 * Return itemize level array (or fallback to defaults).
 */
export const GetItemizeLevel = (data: string[] | null = null): string[] => {
  if (!data || data.length === 0) {
    return itemizeLevel.length === 0
      ? SetDefaultItemizeLevel()
      : [...itemizeLevel];
  }
  return [...data];
};

/**
 * Return enumerate level array (or fallback to defaults).
 */
export const GetEnumerateLevel = (data: string[] | null = null): string[] => {
  if (!data || data.length === 0) {
    return enumerateLevel.length === 0
      ? SetDefaultEnumerateLevel()
      : [...enumerateLevel];
  }
  return [...data];
};

/** Return structure of parsed tokens + raw bullet content */
export interface ItemizeLevelTokenResult {
  tokens: Token[][];
  contents: string[];
}

/**
 * Parse bullet tokens for all itemize levels.
 */
export const SetItemizeLevelTokens = (
  state: StateBlock | StateInline
): ItemizeLevelTokenResult => {
  const originalOptions = { ...state.md.options };
  if (state.md.options.forDocx) {
    state.md.options = {
      ...state.md.options,
      outMath: {
        include_svg: true,
        include_mathml_word: false,
      },
    };
  }
  itemizeLevelTokens = itemizeLevel.map((level) => {
    const children: Token[] = [];
    state.md.inline.parse(level, state.md, state.env, children);
    return children;
  });
  state.md.options = originalOptions;
  return {
    tokens: [...itemizeLevelTokens],
    contents: [...itemizeLevel],
  };
};

/**
 * Parse bullet tokens for a specific itemize level index.
 */
export const SetItemizeLevelTokensByIndex = (
  state: StateBlock | StateInline,
  index: number
): void => {
  const originalOptions = { ...state.md.options };
  if (state.md.options.forDocx) {
    state.md.options = {
      ...state.md.options,
      outMath: {
        include_svg: true,
        include_mathml_word: false,
      },
    };
  }
  const children: Token[] = [];
  state.md.inline.parse(itemizeLevel[index], state.md, state.env, children);
  itemizeLevelTokens[index] = children;
  state.md.options = originalOptions;
};

/**
 * Returns cached itemize level tokens or provided subset.
 */
export const GetItemizeLevelTokens = (data: Token[][] | null = null): Token[][] => {
  if (!data || data.length === 0) {
    return itemizeLevelTokens.length > 0 ? [...itemizeLevelTokens] : [];
  }
  return [...data];
};

/**
 * Get both bullet content and parsed tokens from state.
 */
export const GetItemizeLevelTokensByState = (
  state: StateBlock | StateInline
): ItemizeLevelTokenResult => {
  if (itemizeLevelTokens.length > 0) {
    return {
      contents: [...itemizeLevel],
      tokens: [...itemizeLevelTokens],
    };
  }
  return SetItemizeLevelTokens(state);
};

/**
 * Change list style for \labelitemi, \labelenumi etc.
 * Supports both itemize and enumerate levels.
 */
export const ChangeLevel = (
  state: StateBlock | StateInline,
  data: { command?: string; params?: string }
): boolean => {
  if (!data) return false;
  const { command = "", params = "" } = data;
  if (!command || !params) return false;
  // ENUMERATE: labelenumi, labelenumii...
  let index = ENUM_LEVEL_COMMANDS.indexOf(command as any);
  if (index >= 0) {
    const match: RegExpMatchArray = params.match(LATEX_ENUM_STYLE_RE);
    if (match) {
      const styleMatch: RegExpMatchArray = match[0].slice(1).match(LATEX_ENUM_STYLE_KEY_RE);
      if (styleMatch) {
        enumerateLevel[index] = ENUM_STYLES[styleMatch[0]];
        return true;
      }
    }
    return false;
  }
  // ITEMIZE: labelitemi, labelitemii...
  index = ITEM_LEVEL_COMMANDS.indexOf(command as any);
  if (index >= 0) {
    itemizeLevel[index] = params;
    SetItemizeLevelTokensByIndex(state, index);
    return true;
  }
  return false;
};

/**
 * Clears stored itemize level token cache.
 */
export const clearItemizeLevelTokens = () => {
  itemizeLevelTokens = [];
};

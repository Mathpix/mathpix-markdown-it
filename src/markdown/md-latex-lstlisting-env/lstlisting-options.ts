import { parseAttributes } from '../common/parse-attribures';
import { parseMathEscapeInline } from './parse-math-escape-inline';
import {LST_HLJS_LANGUAGES} from "../common/consts";

export type ParsedLstLanguage = {
  /** Base language name, e.g. "Ada" or "Assembler". */
  name: string;
  /** Optional dialect name, e.g. "2005" or "riscv". */
  dialect: string | null;
  hlName: string;
};

/**
 * Parse a LaTeX listings `language` value into `{ name, dialect }`.
 *
 * Supported forms:
 * - "Ada"
 * - "{Ada}"
 * - "\"Ada\""
 * - "[2005]Ada"
 * - "{[riscv]Assembler}"
 *
 * The function:
 * - Strips surrounding quotes (single/double) if present.
 * - Strips a single pair of outer curly braces `{ ... }` if present.
 * - If the remaining string starts with `[... ]`, the part inside the brackets
 *   is treated as the dialect and the rest as the language name.
 *
 * On empty or falsy input returns `{ name: '', dialect: null }`.
 */
const parseLstLanguage = (raw: string | null | undefined): ParsedLstLanguage => {
  if (!raw) {
    return { name: '', dialect: null, hlName: '' };
  }

  // 1. Trim whitespace
  let s = raw.trim();
  if (!s) {
    return { name: '', dialect: null, hlName: '' };
  }

  // 2. Strip surrounding quotes, if present
  const firstChar = s[0];
  const lastChar = s[s.length - 1];
  if (
    (firstChar === '"' && lastChar === '"') ||
    (firstChar === "'" && lastChar === "'")
  ) {
    s = s.slice(1, -1).trim();
  }

  // 3. Strip single outer curly braces { ... }, if present
  if (s.startsWith('{') && s.endsWith('}')) {
    s = s.slice(1, -1).trim();
  }

  let dialect: string | null = null;
  let name: string;

  if (s.startsWith('[')) {
    const closing = s.indexOf(']');
    if (closing > 0) {
      dialect = s.slice(1, closing).trim();   // e.g. "2005"
      name = s.slice(closing + 1).trim();     // e.g. "Ada"
    } else {
      // Malformed: "[" without closing "]" → treat whole string as language name
      name = s;
    }
  } else {
    name = s;
  }

  const hlName = name ? (LST_HLJS_LANGUAGES[name.toLowerCase()] ?? name) : '';
  return { name, dialect, hlName };
}

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
export const applyLstListingOptionsToToken = (
  token: any,               // markdown-it Token (can be typed explicitly)
  content: string,
  opts: string | null | undefined,
  state: any                // markdown-it state (StateInline/StateBlock)
): void => {
  if (!opts) return;

  const attributes = parseAttributes(opts) ?? {};

  const languageValue: string =
    typeof attributes.language === 'string' ? attributes.language : null;

  const parsedLanguage: ParsedLstLanguage = languageValue
    ? parseLstLanguage(languageValue)
    : null;

  const meta = token.meta ?? (token.meta = {});
  meta.language = parsedLanguage;

  if (attributes.mathescape) {
    // parse only math inside the code (no links/emphasis)
    token.children = parseMathEscapeInline(state.md, content, state.env);
    meta.hasMathescape = true;
  }
}

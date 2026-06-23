import MarkdownIt, { RuleInline } from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import { multiMath, simpleMath } from '../mdPluginRaw';

/**
 * Cache for math-only inline parsers keyed by the base MarkdownIt instance.
 * Avoids re-allocating a new parser on every call.
 */
const MATH_INLINE_CACHE = new WeakMap<MarkdownIt, MarkdownIt>();

type MarkdownItConstructor = new (opts?: MarkdownIt.Options) => MarkdownIt;

const BACKSLASH = 0x5C;
const DOLLAR = 0x24;

/**
 * Verbatim backslash rule for code listings. Backslashes are kept literal (code is verbatim),
 * so a doubled `\\( / \\[` stays non-math in strict mode. Exception: a run of backslashes
 * immediately before `$` drops exactly one backslash and the `$` is a literal dollar
 * (`\$` -> `$`, `\\$` -> `\$`); only a bare `$` toggles math under mathescape.
 */
const verbatimBackslash: RuleInline = (state, silent) => {
  const max = state.posMax;
  const start = state.pos;
  if (state.src.charCodeAt(start) !== BACKSLASH) {
    return false;
  }
  // peek the maximal run of backslashes to detect a trailing $
  let run = start;
  while (run < max && state.src.charCodeAt(run) === BACKSLASH) {
    run++;
  }
  // ONLY the \$ case: a run of backslashes immediately before $ drops exactly one backslash,
  // and the $ is a literal dollar (\$ -> $, \\$ -> \$). Nothing else changes.
  if (run < max && state.src.charCodeAt(run) === DOLLAR) {
    if (!silent) {
      state.pending += '\\'.repeat(run - start - 1) + '$';
    }
    state.pos = run + 1;
    return true;
  }
  // every other case: original behavior — keep this backslash verbatim and consume a \\ pair so
  // a following \( / \[ is not re-opened as math (a leftover single \( is left for multiMath)
  let pos = start;
  if (!silent) {
    state.pending += '\\';
  }
  pos++;
  if (pos < max && state.src.charCodeAt(pos) === BACKSLASH) {
    if (!silent) {
      state.pending += '\\';
    }
    pos++;
  }
  state.pos = pos;
  return true;
};

/**
 * Create (or retrieve from cache) a Markdown-It instance configured to parse ONLY
 * inline math and plain text. This keeps the behavior consistent with `baseMd` options
 * (html, breaks, typographer, etc.), but strips all other inline rules.
 *
 * Rule precedence: markdown-it's `text` rule runs first but terminates on \ / $ / [, so
 * multiMath/simpleMath still see every delimiter opener before `text` consumes it. `escape`
 * is replaced with `verbatimBackslash` because listing code is verbatim.
 *
 * Cache note: options are snapshotted at construction, but `parseMathEscapeInline` refreshes the
 * option-sensitive `mathDelimiterMode` from `baseMd.options` before each parse, so a reused baseMd
 * whose `mathDelimiterMode` is mutated between parses is honored (see that function).
 */
export const createMathOnlyInlineParser = (baseMd: MarkdownIt): MarkdownIt => {
  const cached = MATH_INLINE_CACHE.get(baseMd);
  if (cached) return cached;
  const BaseMdCtor: MarkdownItConstructor = (baseMd as any).constructor as MarkdownItConstructor;
  const mathMd: MarkdownIt = new BaseMdCtor(baseMd.options);
  // multiMath/simpleMath before escape; escape replaced with verbatim rule (code is literal)
  mathMd.inline.ruler.before('escape', 'multiMath', multiMath);
  mathMd.inline.ruler.before('escape', 'simpleMath', simpleMath);
  mathMd.inline.ruler.at('escape', verbatimBackslash);
  mathMd.inline.ruler.enableOnly(['multiMath', 'simpleMath', 'text', 'escape']);
  MATH_INLINE_CACHE.set(baseMd, mathMd);
  return mathMd;
}

/**
 * Parse a string with ONLY math inline rules enabled.
 *
 * @param baseMd  Original Markdown-It instance (its options are reused).
 * @param src     Raw source to parse (e.g., the inside of lstlisting with mathescape).
 * @param env     Environment object; it will be shallow-cloned and augmented with `mathescape_ctx: true`.
 * @returns       Array of tokens containing only text + inline/display math tokens.
 */
export const parseMathEscapeInline = (
  baseMd: MarkdownIt,
  src: string,
  env = {}
): Token[] => {
  const mathMd: MarkdownIt = createMathOnlyInlineParser(baseMd);
  // refresh mode from baseMd so a reused/mutated baseMd is honored (cache snapshot would be stale)
  mathMd.options.mathDelimiterMode = baseMd.options.mathDelimiterMode === 'legacy' ? 'legacy' : 'strict';
  const tokens: Token[] = [];
  const envClone = { ...env, mathescape_ctx: true };
  mathMd.inline.parse(src, mathMd, envClone, tokens);
  return tokens;
}

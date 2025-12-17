import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import { multiMath, simpleMath } from '../mdPluginRaw';

/**
 * Cache for math-only inline parsers keyed by the base MarkdownIt instance.
 * Avoids re-allocating a new parser on every call.
 */
const MATH_INLINE_CACHE = new WeakMap<MarkdownIt, MarkdownIt>();

type MarkdownItConstructor = new (opts?: MarkdownIt.Options) => MarkdownIt;

/**
 * Create (or retrieve from cache) a Markdown-It instance configured to parse ONLY
 * inline math and plain text. This keeps the behavior consistent with `baseMd` options
 * (html, breaks, typographer, etc.), but strips all other inline rules.
 *
 * Order matters:
 *  1) multiMath (handles \[, \(, \begin{...})
 *  2) simpleMath (handles $...$ / $$...$$)
 *  3) text fallback
 */
export const createMathOnlyInlineParser = (baseMd: MarkdownIt): MarkdownIt => {
  const cached = MATH_INLINE_CACHE.get(baseMd);
  if (cached) return cached;
  // Reuse base options, but do not copy plugins/rules — we install only math rules below.
  // This is cleaner than `new (baseMd as any).constructor(...)` and keeps typing intact.
  const BaseMdCtor: MarkdownItConstructor = (baseMd as any).constructor as MarkdownItConstructor;
  const mathMd: MarkdownIt = new BaseMdCtor(baseMd.options);
  // Register math rules right before "text" to ensure correct precedence.
  mathMd.inline.ruler.before('text', 'multiMath', multiMath);
  mathMd.inline.ruler.before('text', 'simpleMath', simpleMath);
  // Enable only our two math rules + the default "text" rule.
  mathMd.inline.ruler.enableOnly(['multiMath', 'simpleMath', 'text']);
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
  const tokens: Token[] = [];
  const envClone = { ...env, mathescape_ctx: true };
  mathMd.inline.parse(src, mathMd, envClone, tokens);
  return tokens;
}

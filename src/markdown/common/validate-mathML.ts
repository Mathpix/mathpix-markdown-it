export type ValidationOk  = { ok: true };
export type ValidationErr = { ok: false; reason: Reason; extra?: string };
export type ValidationResult = ValidationOk | ValidationErr;

const VALIDATION_REASON = {
  EMPTY: 'empty',
  TOO_LARGE: 'too_large',
  DOCTYPE: 'doctype',
  SCRIPT: 'script',
  JS_URI: 'js_uri',
  EVENT_ATTR: 'event_attr',
  NO_MATH: 'no_math',
  UNCLOSED_MATH: 'unclosed_math',
  BAD_XMLNS: 'bad_xmlns',
  BAD_TAG: 'bad_tag',
  UNKNOWN_TAG: 'unknown_tag',
  MISMATCH: 'mismatch',
  TOO_MANY_NODES: 'too_many_nodes',
  TOO_DEEP: 'too_deep',
  ROOT_NOT_MATH: 'root_not_math',
  TEXT_OUTSIDE_TEXT_CONTAINER: 'text_outside_text_container',
  UNCLOSED_COMMENT: 'unclosed_comment',
  UNCLOSED_CDATA: 'unclosed_cdata',
  UNCLOSED_PI: 'unclosed_pi',
  UNCLOSED_DECL: 'unclosed_decl',
  UNCLOSED_QUOTE: 'unclosed_quote',
  UNCLOSED_TAG: 'unclosed_tag',
  UNCLOSED_TAGS: 'unclosed_tags'
} as const;
type Reason = typeof VALIDATION_REASON[keyof typeof VALIDATION_REASON];

const DEFAULT_VALIDATION_LIMITS = {
  maxBytes: 1_000_000,
  maxDepth: 80,
  maxNodes: 50_000
} as const;

const MATHML_XMLNS = 'http://www.w3.org/1998/Math/MathML' as const;

// Allowed MathML tags that MathJax definitely understands (presentation + semantics)
const MATHML_ALLOWED_TAGS = new Set([
  'math','mrow','mi','mn','mo','ms','mtext','mspace','mfrac','msqrt','mroot',
  'msub','msup','msubsup','munder','mover','munderover','mmultiscripts',
  'mprescripts','none','mtable','mtr','mlabeledtr','mtd','mstyle','merror',
  'mpadded','mphantom','menclose','mfenced','semantics','annotation','annotation-xml'
]);

// Tags that allow a visible text node inside
const MATHML_TEXT_CONTAINERS = new Set(['mi','mn','mo','mtext','ms']);
const MATHML_ANNOTATION_TAGS = new Set(['annotation','annotation-xml']);
const HAZARD_DOCTYPE_RE = /<\!DOCTYPE/i;
const HAZARD_SCRIPT_RE  = /<script\b/i;
const HAZARD_JS_URI_RE  = /javascript:/i;
const HAZARD_EVENT_ATTR_RE = /\son[a-z]+\s*=/i;

const OPEN_MATH_TAG_RE = /<math\b[^>]*>/i;
const XMLNS_ATTR_RE    = /\bxmlns\s*=\s*"([^"]*)"/i;

// Single "wide" tokenizer: comments / CDATA / tags / text
const MATHML_TOKEN_RE = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\/?[A-Za-z][\w:.-]*\b[^>]*>|[^<]+/g;
const MATH_OPEN  = '<math';
const END_MATH = '</math>';

const hasUnclosedAll = (hay: string, open: string, close: string): boolean => {
  let from = 0;
  for (;;) {
    const i = hay.indexOf(open, from);
    if (i < 0) return false;
    const j = hay.indexOf(close, i + open.length);
    if (j < 0) return true;
    from = j + close.length;
  }
}

/**
 * Shallow & fast MathML pre-validation for MathJax (SVG).
 *
 * - Extracts the first `<math>…</math>` fragment.
 * - Blocks obvious hazards (doctype, script, javascript: URLs, event handlers).
 * - Ensures balanced tags with a tiny stack (not a full XML parser).
 * - Allows visible text only inside `mi/mn/mo/mtext/ms`.
 * - Ignores content inside `<annotation>` / `<annotation-xml>`.
 *
 * Not a full XML/DTD validator. Intended to be extremely fast and safe before
 * passing MathML to MathJax. O(N) over the `<math>` fragment, no allocations
 * beyond a small stack.
 */
export const validateMathMLShallow = (
  source: string,
  limits: Partial<typeof DEFAULT_VALIDATION_LIMITS> = {}
): ValidationResult => {
  const { maxBytes, maxDepth, maxNodes } = { ...DEFAULT_VALIDATION_LIMITS, ...limits };

  if (typeof source !== 'string' || !source) {
    return { ok: false, reason: VALIDATION_REASON.EMPTY };
  }
  if (source.length > maxBytes){
    return { ok: false, reason: VALIDATION_REASON.TOO_LARGE };
  }

  // Let's take the first <math>…</math>
  const startIndex = source.indexOf(MATH_OPEN);
  if (startIndex < 0) {
    return { ok: false, reason: VALIDATION_REASON.NO_MATH };
  }
  const endIndex = source.indexOf(END_MATH, startIndex);
  if (endIndex < 0) {
    return { ok: false, reason: VALIDATION_REASON.UNCLOSED_MATH };
  }
  const mathFragment: string = source.slice(startIndex, endIndex + END_MATH.length);

  // preflight on "stuck" sections
  if (mathFragment.includes('<!--') && hasUnclosedAll(mathFragment, '<!--', '-->')) {
    return { ok: false, reason: VALIDATION_REASON.UNCLOSED_COMMENT };
  }
  if (mathFragment.includes('<![CDATA[') && hasUnclosedAll(mathFragment, '<![CDATA[', ']]>')) {
    return { ok: false, reason: VALIDATION_REASON.UNCLOSED_CDATA };
  }
  if (mathFragment.includes('<?') && hasUnclosedAll(mathFragment, '<?', '?>')) {
    return { ok: false, reason: VALIDATION_REASON.UNCLOSED_PI };
  }

  // simple declaration <!FOO …>
  if (/\<![A-Z]/.test(mathFragment)) {
    const i = mathFragment.search(/\<![A-Z]/);
    if (i >= 0 && mathFragment.indexOf('>', i + 2) < 0)
      return { ok: false, reason: VALIDATION_REASON.UNCLOSED_DECL };
  }

  if (HAZARD_DOCTYPE_RE.test(mathFragment))  return { ok: false, reason: VALIDATION_REASON.DOCTYPE };
  if (HAZARD_SCRIPT_RE.test(mathFragment))   return { ok: false, reason: VALIDATION_REASON.SCRIPT };
  if (HAZARD_JS_URI_RE.test(mathFragment))   return { ok: false, reason: VALIDATION_REASON.JS_URI };
  if (HAZARD_EVENT_ATTR_RE.test(mathFragment)) return { ok: false, reason: VALIDATION_REASON.EVENT_ATTR };

  // Check xmlns at root (optionally strict)
  const rootOpenTag = OPEN_MATH_TAG_RE.exec(mathFragment)?.[0] || '';
  const rootXmlns   = XMLNS_ATTR_RE.exec(rootOpenTag)?.[1];
  if (rootXmlns && rootXmlns !== MATHML_XMLNS) {
    return { ok: false, reason: VALIDATION_REASON.BAD_XMLNS, extra: rootXmlns };
  }

  const tagStack: string[] = [];
  let nodeCount = 0;
  let seenMathOpen = false;
  let seenMathClose = false;
  let annotationDepth = 0; //inside <annotation> / <annotation-xml> skip the content

  MATHML_TOKEN_RE.lastIndex = 0;
  for (let m: RegExpExecArray | null; (m = MATHML_TOKEN_RE.exec(mathFragment)); ) {
    const token = m[0];
    // Comments
    if (token.startsWith('<!--')) continue;
    // CDATA as text (outside annotations - only in text containers)
    if (token.startsWith('<![CDATA[')) {
      if (annotationDepth > 0) continue;
      const parent = tagStack[tagStack.length - 1];
      if (!MATHML_TEXT_CONTAINERS.has(parent)) {
        return { ok: false, reason: VALIDATION_REASON.TEXT_OUTSIDE_TEXT_CONTAINER };
      }
      continue;
    }

    // Tags
    if (token[0] === '<') {
      const isClosingTag = token[1] === '/';
      const isSelfClosing = !isClosingTag && /\/>$/.test(token);
      const rawName = /^<\/?\s*([A-Za-z][\w:.-]*)/.exec(token)?.[1];
      if (!rawName) return { ok: false, reason: VALIDATION_REASON.BAD_TAG };

      // remove namespace prefix (mml:mi -> mi), convert to lower
      const localName = rawName.toLowerCase().replace(/^[a-z][\w-]*:/, '');

      // accounting of annotation zones
      const isAnno = MATHML_ANNOTATION_TAGS.has(localName);
      if (!isClosingTag && isAnno && !isSelfClosing) annotationDepth++;
      else if (isClosingTag && isAnno && annotationDepth) annotationDepth--;

      // outside annotations - only known MathML tags
      if (annotationDepth === 0 && !MATHML_ALLOWED_TAGS.has(localName)) {
        return { ok: false, reason: VALIDATION_REASON.UNKNOWN_TAG, extra: localName };
      }

      if (isClosingTag) {
        const top = tagStack.pop();
        if (!top || top !== localName) {
          return { ok: false, reason: VALIDATION_REASON.MISMATCH, extra: `${top || 'none'}!=${localName}` };
        }
        if (localName === 'math' && tagStack.length === 0) seenMathClose = true;
      } else if (!isSelfClosing) {
        tagStack.push(localName);
        nodeCount++;
        if (!seenMathOpen) {
          if (localName !== 'math') return { ok: false, reason: VALIDATION_REASON.ROOT_NOT_MATH };
          seenMathOpen = true;
        }
        if (nodeCount > maxNodes)        return { ok: false, reason: VALIDATION_REASON.TOO_MANY_NODES };
        if (tagStack.length > maxDepth)  return { ok: false, reason: VALIDATION_REASON.TOO_DEEP };
      } else {
        // self-closing
        nodeCount++;
        if (nodeCount > maxNodes)        return { ok: false, reason: VALIDATION_REASON.TOO_MANY_NODES };
        if (!seenMathOpen && localName !== 'math') return { ok: false, reason: VALIDATION_REASON.ROOT_NOT_MATH };
        if (!seenMathOpen && localName === 'math') { seenMathOpen = true; seenMathClose = true; }
      }
      continue;
    }

    // Text between tags: only in text containers (outside annotations)
    if (annotationDepth > 0) continue;
    if (!token.trim())        continue;
    const parent = tagStack[tagStack.length - 1];
    if (!MATHML_TEXT_CONTAINERS.has(parent)) {
      return { ok: false, reason: VALIDATION_REASON.TEXT_OUTSIDE_TEXT_CONTAINER };
    }
  }

  if (!seenMathOpen)                     return { ok: false, reason: VALIDATION_REASON.NO_MATH };
  if (!seenMathClose || tagStack.length) return { ok: false, reason: VALIDATION_REASON.UNCLOSED_TAGS };

  return { ok: true };
}

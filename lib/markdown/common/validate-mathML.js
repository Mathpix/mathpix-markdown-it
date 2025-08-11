"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMathMLShallow = void 0;
var tslib_1 = require("tslib");
var VALIDATION_REASON = {
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
};
var DEFAULT_VALIDATION_LIMITS = {
    maxBytes: 1000000,
    maxDepth: 80,
    maxNodes: 50000
};
var MATHML_XMLNS = 'http://www.w3.org/1998/Math/MathML';
// Allowed MathML tags that MathJax definitely understands (presentation + semantics)
var MATHML_ALLOWED_TAGS = new Set([
    'math', 'mrow', 'mi', 'mn', 'mo', 'ms', 'mtext', 'mspace', 'mfrac', 'msqrt', 'mroot',
    'msub', 'msup', 'msubsup', 'munder', 'mover', 'munderover', 'mmultiscripts',
    'mprescripts', 'none', 'mtable', 'mtr', 'mlabeledtr', 'mtd', 'mstyle', 'merror',
    'mpadded', 'mphantom', 'menclose', 'mfenced', 'semantics', 'annotation', 'annotation-xml'
]);
// Tags that allow a visible text node inside
var MATHML_TEXT_CONTAINERS = new Set(['mi', 'mn', 'mo', 'mtext', 'ms']);
var MATHML_ANNOTATION_TAGS = new Set(['annotation', 'annotation-xml']);
var HAZARD_DOCTYPE_RE = /<\!DOCTYPE/i;
var HAZARD_SCRIPT_RE = /<script\b/i;
var HAZARD_JS_URI_RE = /javascript:/i;
var HAZARD_EVENT_ATTR_RE = /\son[a-z]+\s*=/i;
var OPEN_MATH_TAG_RE = /<math\b[^>]*>/i;
var XMLNS_ATTR_RE = /\bxmlns\s*=\s*"([^"]*)"/i;
// Single "wide" tokenizer: comments / CDATA / tags / text
var MATHML_TOKEN_RE = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\/?[A-Za-z][\w:.-]*\b[^>]*>|[^<]+/g;
var MATH_OPEN = '<math';
var END_MATH = '</math>';
var hasUnclosedAll = function (hay, open, close) {
    var from = 0;
    for (;;) {
        var i = hay.indexOf(open, from);
        if (i < 0)
            return false;
        var j = hay.indexOf(close, i + open.length);
        if (j < 0)
            return true;
        from = j + close.length;
    }
};
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
var validateMathMLShallow = function (source, limits) {
    var _a, _b, _c;
    if (limits === void 0) { limits = {}; }
    var _d = tslib_1.__assign(tslib_1.__assign({}, DEFAULT_VALIDATION_LIMITS), limits), maxBytes = _d.maxBytes, maxDepth = _d.maxDepth, maxNodes = _d.maxNodes;
    if (typeof source !== 'string' || !source) {
        return { ok: false, reason: VALIDATION_REASON.EMPTY };
    }
    if (source.length > maxBytes) {
        return { ok: false, reason: VALIDATION_REASON.TOO_LARGE };
    }
    // Let's take the first <math>…</math>
    var startIndex = source.indexOf(MATH_OPEN);
    if (startIndex < 0) {
        return { ok: false, reason: VALIDATION_REASON.NO_MATH };
    }
    var endIndex = source.indexOf(END_MATH, startIndex);
    if (endIndex < 0) {
        return { ok: false, reason: VALIDATION_REASON.UNCLOSED_MATH };
    }
    var mathFragment = source.slice(startIndex, endIndex + END_MATH.length);
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
        var i = mathFragment.search(/\<![A-Z]/);
        if (i >= 0 && mathFragment.indexOf('>', i + 2) < 0)
            return { ok: false, reason: VALIDATION_REASON.UNCLOSED_DECL };
    }
    if (HAZARD_DOCTYPE_RE.test(mathFragment))
        return { ok: false, reason: VALIDATION_REASON.DOCTYPE };
    if (HAZARD_SCRIPT_RE.test(mathFragment))
        return { ok: false, reason: VALIDATION_REASON.SCRIPT };
    if (HAZARD_JS_URI_RE.test(mathFragment))
        return { ok: false, reason: VALIDATION_REASON.JS_URI };
    if (HAZARD_EVENT_ATTR_RE.test(mathFragment))
        return { ok: false, reason: VALIDATION_REASON.EVENT_ATTR };
    // Check xmlns at root (optionally strict)
    var rootOpenTag = ((_a = OPEN_MATH_TAG_RE.exec(mathFragment)) === null || _a === void 0 ? void 0 : _a[0]) || '';
    var rootXmlns = (_b = XMLNS_ATTR_RE.exec(rootOpenTag)) === null || _b === void 0 ? void 0 : _b[1];
    if (rootXmlns && rootXmlns !== MATHML_XMLNS) {
        return { ok: false, reason: VALIDATION_REASON.BAD_XMLNS, extra: rootXmlns };
    }
    var tagStack = [];
    var nodeCount = 0;
    var seenMathOpen = false;
    var seenMathClose = false;
    var annotationDepth = 0; //inside <annotation> / <annotation-xml> skip the content
    MATHML_TOKEN_RE.lastIndex = 0;
    for (var m = void 0; (m = MATHML_TOKEN_RE.exec(mathFragment));) {
        var token = m[0];
        // Comments
        if (token.startsWith('<!--'))
            continue;
        // CDATA as text (outside annotations - only in text containers)
        if (token.startsWith('<![CDATA[')) {
            if (annotationDepth > 0)
                continue;
            var parent_1 = tagStack[tagStack.length - 1];
            if (!MATHML_TEXT_CONTAINERS.has(parent_1)) {
                return { ok: false, reason: VALIDATION_REASON.TEXT_OUTSIDE_TEXT_CONTAINER };
            }
            continue;
        }
        // Tags
        if (token[0] === '<') {
            var isClosingTag = token[1] === '/';
            var isSelfClosing = !isClosingTag && /\/>$/.test(token);
            var rawName = (_c = /^<\/?\s*([A-Za-z][\w:.-]*)/.exec(token)) === null || _c === void 0 ? void 0 : _c[1];
            if (!rawName)
                return { ok: false, reason: VALIDATION_REASON.BAD_TAG };
            // remove namespace prefix (mml:mi -> mi), convert to lower
            var localName = rawName.toLowerCase().replace(/^[a-z][\w-]*:/, '');
            // accounting of annotation zones
            var isAnno = MATHML_ANNOTATION_TAGS.has(localName);
            if (!isClosingTag && isAnno && !isSelfClosing)
                annotationDepth++;
            else if (isClosingTag && isAnno && annotationDepth)
                annotationDepth--;
            // outside annotations - only known MathML tags
            if (annotationDepth === 0 && !MATHML_ALLOWED_TAGS.has(localName)) {
                return { ok: false, reason: VALIDATION_REASON.UNKNOWN_TAG, extra: localName };
            }
            if (isClosingTag) {
                var top_1 = tagStack.pop();
                if (!top_1 || top_1 !== localName) {
                    return { ok: false, reason: VALIDATION_REASON.MISMATCH, extra: "".concat(top_1 || 'none', "!=").concat(localName) };
                }
                if (localName === 'math' && tagStack.length === 0)
                    seenMathClose = true;
            }
            else if (!isSelfClosing) {
                tagStack.push(localName);
                nodeCount++;
                if (!seenMathOpen) {
                    if (localName !== 'math')
                        return { ok: false, reason: VALIDATION_REASON.ROOT_NOT_MATH };
                    seenMathOpen = true;
                }
                if (nodeCount > maxNodes)
                    return { ok: false, reason: VALIDATION_REASON.TOO_MANY_NODES };
                if (tagStack.length > maxDepth)
                    return { ok: false, reason: VALIDATION_REASON.TOO_DEEP };
            }
            else {
                // self-closing
                nodeCount++;
                if (nodeCount > maxNodes)
                    return { ok: false, reason: VALIDATION_REASON.TOO_MANY_NODES };
                if (!seenMathOpen && localName !== 'math')
                    return { ok: false, reason: VALIDATION_REASON.ROOT_NOT_MATH };
                if (!seenMathOpen && localName === 'math') {
                    seenMathOpen = true;
                    seenMathClose = true;
                }
            }
            continue;
        }
        // Text between tags: only in text containers (outside annotations)
        if (annotationDepth > 0)
            continue;
        if (!token.trim())
            continue;
        var parent_2 = tagStack[tagStack.length - 1];
        if (!MATHML_TEXT_CONTAINERS.has(parent_2)) {
            return { ok: false, reason: VALIDATION_REASON.TEXT_OUTSIDE_TEXT_CONTAINER };
        }
    }
    if (!seenMathOpen)
        return { ok: false, reason: VALIDATION_REASON.NO_MATH };
    if (!seenMathClose || tagStack.length)
        return { ok: false, reason: VALIDATION_REASON.UNCLOSED_TAGS };
    return { ok: true };
};
exports.validateMathMLShallow = validateMathMLShallow;
//# sourceMappingURL=validate-mathML.js.map
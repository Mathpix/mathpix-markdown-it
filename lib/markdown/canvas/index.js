"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvasWarnings = exports.applyCanvasProfile = exports.CANVAS_PAGE_BODY_LIMIT = exports.HIDDEN_SOURCE_TAGS = void 0;
var tslib_1 = require("tslib");
/**
 * Canvas LMS profile: rewrites rendered HTML into the form a Canvas page keeps verbatim.
 *
 * Runs over the finished HTML rather than the token stream, so raw HTML written in the document is
 * covered too. Rules below follow instructure/canvas-lms:
 *   gems/canvas_sanitize/lib/canvas_sanitize/canvas_sanitize.rb
 *   packages/canvas-rce/src/defaultTinymceConfig.ts
 */
var structural_1 = require("../../styles/structural");
var sanitizeHtml = require('../sanitize/sanitize-html');
var MAX_HEADING_LEVEL = 6;
var HEADING_RE = /^h([1-6])$/;
/** `bolder` counts: against a normal parent it renders bold. */
var BOLD_VALUE_RE = /font-weight\s*:\s*(bold|bolder|[6-9]00)\b/i;
var CLASS_SEPARATOR_RE = /\s+/;
/** The entities a browser also decodes without a semicolon, so escaping them would show literals. */
var LEGACY_ENTITY = '(?:amp|lt|gt|quot|nbsp|copy|reg)(?![a-zA-Z0-9])';
/** An unescaped `&` is decoded by the parser: `&top_left_y=` would become `⊤left_y=`. */
var BARE_AMPERSAND_RE = new RegExp("&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\\d+|#[xX][0-9a-fA-F]+);|".concat(LEGACY_ENTITY, ")"), 'gi');
var BACKGROUND = 'background';
var BACKGROUND_IMAGE = 'background-image';
var BACKGROUND_SIZE = 'background-size';
var BACKGROUND_POSITION = 'background-position';
var BACKGROUND_REPEAT = 'background-repeat';
/** `background-image` is absent: it becomes the shorthand itself. */
var BACKGROUND_ABSORBED = [BACKGROUND_SIZE, BACKGROUND_POSITION, BACKGROUND_REPEAT];
/** The shorthand resets these, so folding beside one of them would drop it. */
var BACKGROUND_NOT_ABSORBED = [
    BACKGROUND, 'background-color', 'background-attachment',
    'background-origin', 'background-clip', 'background-blend-mode',
];
var DEFAULT_BACKGROUND_POSITION = '0 0';
var DEFAULT_BACKGROUND_REPEAT = 'no-repeat';
var SIZE_SEPARATOR = '/';
var TEXT_DECORATION = 'text-decoration';
var TEXT_DECORATION_STYLE = 'text-decoration-style';
/** A style already in the shorthand; a second one invalidates the declaration. */
var TEXT_DECORATION_STYLE_VALUE_RE = /\b(solid|double|dotted|dashed|wavy)\b/i;
var FONT_WEIGHT = 'font-weight';
/** Schemes Canvas keeps in a URL; anything else loses the attribute. */
var SCHEMES_CANVAS_KEEPS = ['http', 'https'];
var LINK_SCHEMES_CANVAS_KEEPS = ['ftp', 'http', 'https', 'mailto', 'tel'];
/**
 * Dropped here rather than never written: `type` is read by the anchor plugin, `value` by the list
 * numbering, and `number` is built into equation markup.
 */
var ATTRS_CANVAS_DROPS = { number: true, type: true, value: true };
/** The only element whose `type` Canvas keeps. */
var TYPE_CANVAS_KEEPS_ON = { ol: true };
var ALIGN = 'align';
var TABLE = 'table';
var TEXT_ALIGN = 'text-align';
/** Elements whose `align` Canvas keeps. */
var ALIGN_CANVAS_KEEPS_ON = {
    iframe: true, img: true, math: true, mlongdiv: true, mover: true, mstack: true,
    mstyle: true, mtable: true, munder: true, munderover: true, td: true, th: true, tr: true,
};
/** `align` on a table places the table itself, so it becomes a margin, not a text alignment. */
var TABLE_ALIGN_STYLES = {
    center: structural_1.TABLE_CENTER_STYLE,
    left: 'margin-right: auto;',
    right: 'margin-left: auto;',
};
var TEXT_ALIGN_VALUES = {
    left: true, right: true, center: true, justify: true,
};
/**
 * Structure the stylesheet carries. Canvas takes no stylesheet, so it travels inline. Descendant
 * rules — the author block, list markers, table cells — are handled in their renderers instead,
 * since this pass sees one element at a time.
 */
var CLASS_STYLES = {
    'main-title': (0, structural_1.canvasInlineStyle)(structural_1.MAIN_TITLE_STYLE),
    abstract: (0, structural_1.canvasInlineStyle)(structural_1.ABSTRACT_STYLE),
    'section-title': (0, structural_1.canvasInlineStyle)(structural_1.SECTION_TITLE_STYLE),
    'math-block': (0, structural_1.canvasInlineStyle)(structural_1.MATH_BLOCK_STYLE),
    'math-inline': (0, structural_1.canvasInlineStyle)(structural_1.MATH_INLINE_STYLE),
    figure_img: (0, structural_1.canvasInlineStyle)(structural_1.FIGURE_IMG_STYLE),
    table_tabular: (0, structural_1.canvasInlineStyle)(structural_1.TABLE_TABULAR_STYLE),
    tabular: (0, structural_1.canvasInlineStyle)(structural_1.TABULAR_STYLE),
    _empty: (0, structural_1.canvasInlineStyle)(structural_1.TABULAR_EMPTY_CELL_STYLE),
};
/** Canvas unwraps these, and their payload becomes visible body text. */
exports.HIDDEN_SOURCE_TAGS = {
    mathml: true, mathmlword: true, asciimath: true, linearmath: true, latex: true,
    speech: true, error: true,
    csv: true, tsv: true, 'table-markdown': true, mol: true, smiles: true,
};
/** A Canvas page body is capped at `500.kilobytes - 1` (config/initializers/active_record.rb). */
exports.CANVAS_PAGE_BODY_LIMIT = 500 * 1024 - 1;
var CHEMISTRY_SOURCE_RE = /class="smiles-source"/g;
var IMAGE_RE = /<img\b[^>]*>/g;
var NON_EMPTY_ALT_RE = /\salt\s*=\s*("[^"]*[^\s"][^"]*"|'[^']*[^\s'][^']*')/;
/**
 * Bold outside a `span`: promoting it would mean replacing an element that carries more. Hidden
 * source elements are excluded — they never reach the page, so what they carry is not a loss.
 */
var REGEXP_METACHARACTER_RE = /[.*+?^${}()|[\]\\]/g;
var NON_SPAN_BOLD_RE = new RegExp('<(?!span\\b|' +
    Object.keys(exports.HIDDEN_SOURCE_TAGS)
        .map(function (tag) { return tag.replace(REGEXP_METACHARACTER_RE, '\\$&') + '\\b'; })
        .join('|') +
    ')[a-z][a-z0-9]*\\b[^>]*style\\s*=\\s*"[^"]*font-weight\\s*:\\s*(?:bold|bolder|[6-9]00)\\b', 'gi');
/**
 * Canvas filters CSS by property name, so a rejected sub-property travels inside the shorthand it
 * does allow — but only where that shorthand would not reset something declared beside it.
 */
var foldShorthands = function (rule) {
    var occurrences = new Map();
    var position = new Map();
    var index = 0;
    rule.walkDecls(function (declaration) {
        var prop = declaration.prop.toLowerCase();
        var seen = occurrences.get(prop);
        if (seen) {
            seen.push(declaration);
        }
        else {
            occurrences.set(prop, [declaration]);
        }
        position.set(prop, index);
        index++;
    });
    /** The last declaration is the one the cascade resolves to. */
    var last = function (prop) {
        var seen = occurrences.get(prop);
        return seen ? seen[seen.length - 1] : undefined;
    };
    var removeAll = function (prop) {
        var seen = occurrences.get(prop);
        if (seen) {
            seen.forEach(function (declaration) { return declaration.remove(); });
        }
    };
    var image = last(BACKGROUND_IMAGE);
    var size = last(BACKGROUND_SIZE);
    var resetByShorthand = BACKGROUND_NOT_ABSORBED.some(function (prop) { return occurrences.has(prop); });
    if (image && size && !resetByShorthand) {
        var backgroundPosition = last(BACKGROUND_POSITION);
        var repeat = last(BACKGROUND_REPEAT);
        image.value = [
            image.value,
            backgroundPosition ? backgroundPosition.value : DEFAULT_BACKGROUND_POSITION,
            SIZE_SEPARATOR,
            size.value,
            repeat ? repeat.value : DEFAULT_BACKGROUND_REPEAT,
        ].join(' ');
        image.prop = BACKGROUND;
        BACKGROUND_ABSORBED.forEach(removeAll);
    }
    var decoration = last(TEXT_DECORATION);
    var decorationStyle = last(TEXT_DECORATION_STYLE);
    /** Declared after the sub-property, the shorthand has already reset it; folding would undo that. */
    var shorthandComesFirst = position.get(TEXT_DECORATION) < position.get(TEXT_DECORATION_STYLE);
    if (decoration && decorationStyle && shorthandComesFirst) {
        if (!TEXT_DECORATION_STYLE_VALUE_RE.test(decoration.value)) {
            decoration.value = "".concat(decoration.value, " ").concat(decorationStyle.value);
        }
        removeAll(TEXT_DECORATION_STYLE);
    }
    removeAll(FONT_WEIGHT);
};
/** Empty when Canvas offers no equivalent for the value. */
var alignToDeclaration = function (tagName, value) {
    var align = value.trim().toLowerCase();
    if (tagName === TABLE) {
        return TABLE_ALIGN_STYLES[align] || '';
    }
    if (TEXT_ALIGN_VALUES[align]) {
        return "".concat(TEXT_ALIGN, ": ").concat(align, ";");
    }
    return '';
};
var rewriteElement = function (tagName, attribs) {
    var e_1, _a, e_2, _b;
    var heading = HEADING_RE.exec(tagName);
    /** The Canvas page title is the top-level heading, so a document h1 would duplicate it. */
    if (heading) {
        tagName = 'h' + Math.min(MAX_HEADING_LEVEL, Number(heading[1]) + 1);
    }
    if (tagName === 's') {
        tagName = 'del';
    }
    /** Canvas allows sizing attributes on `mpadded` but not on `mspace`. */
    if (tagName === 'mspace' && (attribs.width || attribs.height || attribs.depth)) {
        tagName = 'mpadded';
    }
    /**
     * Renaming here rather than in the renderers keeps the closing tag right: the parser applies the
     * rename to the matching close. `foldShorthands` drops the declaration itself.
     */
    if (tagName === 'span' && BOLD_VALUE_RE.test(attribs.style || '')) {
        tagName = 'strong';
    }
    try {
        for (var _c = tslib_1.__values(Object.keys(attribs)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var name_1 = _d.value;
            if (ATTRS_CANVAS_DROPS[name_1] && !(name_1 === 'type' && TYPE_CANVAS_KEEPS_ON[tagName])) {
                delete attribs[name_1];
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (attribs[ALIGN] && !ALIGN_CANVAS_KEEPS_ON[tagName]) {
        var declaration = alignToDeclaration(tagName, attribs[ALIGN]);
        /** Prepended, so an inline style the document wrote stays more specific. */
        if (declaration) {
            attribs.style = declaration + (attribs.style ? ' ' + attribs.style : '');
        }
        delete attribs[ALIGN];
    }
    if (attribs.class) {
        try {
            for (var _e = tslib_1.__values(attribs.class.split(CLASS_SEPARATOR_RE)), _f = _e.next(); !_f.done; _f = _e.next()) {
                var cls = _f.value;
                var style = CLASS_STYLES[cls];
                if (style) {
                    attribs.style = style + (attribs.style ? ' ' + attribs.style : '');
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return { tagName: tagName, attribs: attribs };
};
var dropElement = function (frame) { return exports.HIDDEN_SOURCE_TAGS[frame.tag] === true; };
/** Escaping before the parse keeps query strings in attributes intact. */
var escapeBareAmpersands = function (html) { return html.replace(BARE_AMPERSAND_RE, '&amp;'); };
var SANITIZE_OPTIONS = {
    allowedTags: false,
    allowedAttributes: false,
    allowedSchemes: SCHEMES_CANVAS_KEEPS,
    allowedSchemesByTag: { a: LINK_SCHEMES_CANVAS_KEEPS },
    transformTags: { '*': rewriteElement },
    transformStyle: foldShorthands,
    exclusiveFilter: dropElement,
};
/**
 * @internal Applied once, by `markdownToCanvasHTML`. A second application would shift the headings
 * again and re-prepend the structural declarations.
 */
var applyCanvasProfile = function (html) {
    return html ? sanitizeHtml(escapeBareAmpersands(html), SANITIZE_OPTIONS) : html;
};
exports.applyCanvasProfile = applyCanvasProfile;
/** Canvas measures the body in bytes, and MathML is mostly multi-byte. */
var byteLength = function (text) {
    if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(text, 'utf8');
    }
    return new TextEncoder().encode(text).length;
};
var countMatches = function (html, pattern) { return (html.match(pattern) || []).length; };
/** `beforeProfile` is the rendered HTML: what the profile removed can only be counted there. */
var canvasWarnings = function (html, beforeProfile) {
    if (beforeProfile === void 0) { beforeProfile = html; }
    var bytes = byteLength(html);
    var images = html.match(IMAGE_RE) || [];
    return {
        bytes: bytes,
        overPageLimit: bytes > exports.CANVAS_PAGE_BODY_LIMIT,
        chemistry: countMatches(html, CHEMISTRY_SOURCE_RE),
        imagesWithoutAlt: images.filter(function (image) { return !NON_EMPTY_ALT_RE.test(image); }).length,
        boldDropped: countMatches(beforeProfile, NON_SPAN_BOLD_RE),
    };
};
exports.canvasWarnings = canvasWarnings;
//# sourceMappingURL=index.js.map
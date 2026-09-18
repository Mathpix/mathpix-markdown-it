/**
 * Canvas LMS profile: rewrites rendered HTML into the form a Canvas page keeps verbatim.
 *
 * Runs over the finished HTML rather than the token stream, so raw HTML written in the document is
 * covered too. Rules below follow instructure/canvas-lms:
 *   gems/canvas_sanitize/lib/canvas_sanitize/canvas_sanitize.rb
 *   packages/canvas-rce/src/defaultTinymceConfig.ts
 */
import {
  MAIN_TITLE_STYLE, ABSTRACT_STYLE, MATH_BLOCK_STYLE, MATH_INLINE_STYLE, FIGURE_IMG_STYLE,
  SECTION_TITLE_STYLE, TABULAR_STYLE, TABULAR_EMPTY_CELL_STYLE, TABLE_TABULAR_STYLE,
  TABLE_CENTER_STYLE, canvasInlineStyle,
} from '../../styles/structural';

const sanitizeHtml = require('../sanitize/sanitize-html');

const MAX_HEADING_LEVEL = 6;

const HEADING_RE = /^h([1-6])$/;
/** `bolder` counts: against a normal parent it renders bold. */
const BOLD_VALUE_RE = /font-weight\s*:\s*(bold|bolder|[6-9]00)\b/i;
const CLASS_SEPARATOR_RE = /\s+/;
/** The entities a browser also decodes without a semicolon, so escaping them would show literals. */
const LEGACY_ENTITY = '(?:amp|lt|gt|quot|nbsp|copy|reg)(?![a-zA-Z0-9])';
/** An unescaped `&` is decoded by the parser: `&top_left_y=` would become `⊤left_y=`. */
const BARE_AMPERSAND_RE =
  new RegExp(`&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\\d+|#[xX][0-9a-fA-F]+);|${LEGACY_ENTITY})`, 'gi');

const BACKGROUND = 'background';
const BACKGROUND_IMAGE = 'background-image';
const BACKGROUND_SIZE = 'background-size';
const BACKGROUND_POSITION = 'background-position';
const BACKGROUND_REPEAT = 'background-repeat';
/** `background-image` is absent: it becomes the shorthand itself. */
const BACKGROUND_ABSORBED = [BACKGROUND_SIZE, BACKGROUND_POSITION, BACKGROUND_REPEAT];
/** The shorthand resets these, so folding beside one of them would drop it. */
const BACKGROUND_NOT_ABSORBED = [
  BACKGROUND, 'background-color', 'background-attachment',
  'background-origin', 'background-clip', 'background-blend-mode',
];
const DEFAULT_BACKGROUND_POSITION = '0 0';
const DEFAULT_BACKGROUND_REPEAT = 'no-repeat';
const SIZE_SEPARATOR = '/';

const TEXT_DECORATION = 'text-decoration';
const TEXT_DECORATION_STYLE = 'text-decoration-style';
/** A style already in the shorthand; a second one invalidates the declaration. */
const TEXT_DECORATION_STYLE_VALUE_RE = /\b(solid|double|dotted|dashed|wavy)\b/i;
const FONT_WEIGHT = 'font-weight';

/** Schemes Canvas keeps in a URL; anything else loses the attribute. */
const SCHEMES_CANVAS_KEEPS = ['http', 'https'];
const LINK_SCHEMES_CANVAS_KEEPS = ['ftp', 'http', 'https', 'mailto', 'tel'];

/**
 * Dropped here rather than never written: `type` is read by the anchor plugin, `value` by the list
 * numbering, and `number` is built into equation markup.
 */
const ATTRS_CANVAS_DROPS: Record<string, true> = { number: true, type: true, value: true };

/** The only element whose `type` Canvas keeps. */
const TYPE_CANVAS_KEEPS_ON: Record<string, true> = { ol: true };

const ALIGN = 'align';
const TABLE = 'table';
const TEXT_ALIGN = 'text-align';

/** Elements whose `align` Canvas keeps. */
const ALIGN_CANVAS_KEEPS_ON: Record<string, true> = {
  iframe: true, img: true, math: true, mlongdiv: true, mover: true, mstack: true,
  mstyle: true, mtable: true, munder: true, munderover: true, td: true, th: true, tr: true,
};

/** `align` on a table places the table itself, so it becomes a margin, not a text alignment. */
const TABLE_ALIGN_STYLES: Record<string, string> = {
  center: TABLE_CENTER_STYLE,
  left: 'margin-right: auto;',
  right: 'margin-left: auto;',
};

const TEXT_ALIGN_VALUES: Record<string, true> = {
  left: true, right: true, center: true, justify: true,
};

/**
 * Structure the stylesheet carries. Canvas takes no stylesheet, so it travels inline. Descendant
 * rules — the author block, list markers, table cells — are handled in their renderers instead,
 * since this pass sees one element at a time.
 */
const CLASS_STYLES: Record<string, string> = {
  'main-title': canvasInlineStyle(MAIN_TITLE_STYLE),
  abstract: canvasInlineStyle(ABSTRACT_STYLE),
  'section-title': canvasInlineStyle(SECTION_TITLE_STYLE),
  'math-block': canvasInlineStyle(MATH_BLOCK_STYLE),
  'math-inline': canvasInlineStyle(MATH_INLINE_STYLE),
  figure_img: canvasInlineStyle(FIGURE_IMG_STYLE),
  table_tabular: canvasInlineStyle(TABLE_TABULAR_STYLE),
  tabular: canvasInlineStyle(TABULAR_STYLE),
  _empty: canvasInlineStyle(TABULAR_EMPTY_CELL_STYLE),
};

/** Canvas unwraps these, and their payload becomes visible body text. */
export const HIDDEN_SOURCE_TAGS: Record<string, true> = {
  mathml: true, mathmlword: true, asciimath: true, linearmath: true, latex: true,
  speech: true, error: true,
  csv: true, tsv: true, 'table-markdown': true, mol: true, smiles: true,
};

/** A Canvas page body is capped at `500.kilobytes - 1` (config/initializers/active_record.rb). */
export const CANVAS_PAGE_BODY_LIMIT = 500 * 1024 - 1;

const CHEMISTRY_SOURCE_RE = /class="smiles-source"/g;
const IMAGE_RE = /<img\b[^>]*>/g;
const NON_EMPTY_ALT_RE = /\salt\s*=\s*("[^"]*[^\s"][^"]*"|'[^']*[^\s'][^']*')/;
/**
 * Bold outside a `span`: promoting it would mean replacing an element that carries more. Hidden
 * source elements are excluded — they never reach the page, so what they carry is not a loss.
 */
const REGEXP_METACHARACTER_RE = /[.*+?^${}()|[\]\\]/g;
const NON_SPAN_BOLD_RE = new RegExp(
  '<(?!span\\b|' +
  Object.keys(HIDDEN_SOURCE_TAGS)
    .map(tag => tag.replace(REGEXP_METACHARACTER_RE, '\\$&') + '\\b')
    .join('|') +
  ')[a-z][a-z0-9]*\\b[^>]*style\\s*=\\s*"[^"]*font-weight\\s*:\\s*(?:bold|bolder|[6-9]00)\\b',
  'gi'
);

/** The postcss nodes the sanitizer hands to `transformStyle`. */
interface IDeclaration {
  prop: string;
  value: string;
  remove: () => void;
}

interface IStyleRule {
  walkDecls: (callback: (declaration: IDeclaration) => void) => void;
}

export interface ICanvasWarnings {
  /** Size of the result in bytes, the unit Canvas caps. */
  bytes: number;
  /** The result does not fit a Canvas page and would be refused on save. */
  overPageLimit: boolean;
  /** Structures carried as their SMILES source, since Canvas deletes the drawing. */
  chemistry: number;
  /** Images with no alt text, which Canvas reports in its own accessibility check. */
  imagesWithoutAlt: number;
  /** Bold that could not travel as `strong`, so a Canvas page renders it unweighted. */
  boldDropped: number;
}

/**
 * Canvas filters CSS by property name, so a rejected sub-property travels inside the shorthand it
 * does allow — but only where that shorthand would not reset something declared beside it.
 */
const foldShorthands = (rule: IStyleRule): void => {
  const occurrences = new Map<string, IDeclaration[]>();
  const position = new Map<string, number>();
  let index = 0;
  rule.walkDecls(declaration => {
    const prop = declaration.prop.toLowerCase();
    const seen = occurrences.get(prop);
    if (seen) {
      seen.push(declaration);
    } else {
      occurrences.set(prop, [declaration]);
    }
    position.set(prop, index);
    index++;
  });
  /** The last declaration is the one the cascade resolves to. */
  const last = (prop: string): IDeclaration => {
    const seen = occurrences.get(prop);
    return seen ? seen[seen.length - 1] : undefined;
  };
  const removeAll = (prop: string): void => {
    const seen = occurrences.get(prop);
    if (seen) {
      seen.forEach(declaration => declaration.remove());
    }
  };
  const image = last(BACKGROUND_IMAGE);
  const size = last(BACKGROUND_SIZE);
  const resetByShorthand = BACKGROUND_NOT_ABSORBED.some(prop => occurrences.has(prop));
  if (image && size && !resetByShorthand) {
    const backgroundPosition = last(BACKGROUND_POSITION);
    const repeat = last(BACKGROUND_REPEAT);
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
  const decoration = last(TEXT_DECORATION);
  const decorationStyle = last(TEXT_DECORATION_STYLE);
  /** Declared after the sub-property, the shorthand has already reset it; folding would undo that. */
  const shorthandComesFirst = position.get(TEXT_DECORATION) < position.get(TEXT_DECORATION_STYLE);
  if (decoration && decorationStyle && shorthandComesFirst) {
    if (!TEXT_DECORATION_STYLE_VALUE_RE.test(decoration.value)) {
      decoration.value = `${decoration.value} ${decorationStyle.value}`;
    }
    removeAll(TEXT_DECORATION_STYLE);
  }
  removeAll(FONT_WEIGHT);
};

/** Empty when Canvas offers no equivalent for the value. */
const alignToDeclaration = (tagName: string, value: string): string => {
  const align = value.trim().toLowerCase();
  if (tagName === TABLE) {
    return TABLE_ALIGN_STYLES[align] || '';
  }
  if (TEXT_ALIGN_VALUES[align]) {
    return `${TEXT_ALIGN}: ${align};`;
  }
  return '';
};

const rewriteElement = (tagName: string, attribs: Record<string, string>) => {
  const heading = HEADING_RE.exec(tagName);
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
  for (const name of Object.keys(attribs)) {
    if (ATTRS_CANVAS_DROPS[name] && !(name === 'type' && TYPE_CANVAS_KEEPS_ON[tagName])) {
      delete attribs[name];
    }
  }
  if (attribs[ALIGN] && !ALIGN_CANVAS_KEEPS_ON[tagName]) {
    const declaration = alignToDeclaration(tagName, attribs[ALIGN]);
    /** Prepended, so an inline style the document wrote stays more specific. */
    if (declaration) {
      attribs.style = declaration + (attribs.style ? ' ' + attribs.style : '');
    }
    delete attribs[ALIGN];
  }
  if (attribs.class) {
    for (const cls of attribs.class.split(CLASS_SEPARATOR_RE)) {
      const style = CLASS_STYLES[cls];
      if (style) {
        attribs.style = style + (attribs.style ? ' ' + attribs.style : '');
      }
    }
  }
  return { tagName: tagName, attribs: attribs };
};

const dropElement = (frame: { tag: string }): boolean => HIDDEN_SOURCE_TAGS[frame.tag] === true;

/** Escaping before the parse keeps query strings in attributes intact. */
const escapeBareAmpersands = (html: string): string => html.replace(BARE_AMPERSAND_RE, '&amp;');

const SANITIZE_OPTIONS = {
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
export const applyCanvasProfile = (html: string): string =>
  html ? sanitizeHtml(escapeBareAmpersands(html), SANITIZE_OPTIONS) : html;

/** Canvas measures the body in bytes, and MathML is mostly multi-byte. */
const byteLength = (text: string): number => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.byteLength(text, 'utf8');
  }
  return new TextEncoder().encode(text).length;
};

const countMatches = (html: string, pattern: RegExp): number => (html.match(pattern) || []).length;

/** `beforeProfile` is the rendered HTML: what the profile removed can only be counted there. */
export const canvasWarnings = (html: string, beforeProfile: string = html): ICanvasWarnings => {
  const bytes = byteLength(html);
  const images = html.match(IMAGE_RE) || [];
  return {
    bytes: bytes,
    overPageLimit: bytes > CANVAS_PAGE_BODY_LIMIT,
    chemistry: countMatches(html, CHEMISTRY_SOURCE_RE),
    imagesWithoutAlt: images.filter(image => !NON_EMPTY_ALT_RE.test(image)).length,
    boldDropped: countMatches(beforeProfile, NON_SPAN_BOLD_RE),
  };
};

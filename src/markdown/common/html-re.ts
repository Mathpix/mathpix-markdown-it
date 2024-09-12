var block_names = require('markdown-it/lib/common/html_blocks');
// var HTML_OPEN_CLOSE_TAG_RE = require('markdown-it/lib/common/html_re').HTML_OPEN_CLOSE_TAG_RE;

var attr_name     = '[a-zA-Z_:][a-zA-Z0-9:._-]*';

var unquoted      = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';

var attr_value  = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';

var attribute   = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

var open_tag    = '<([A-Za-z][A-Za-z0-9\\-]*)' + attribute + '*\\s*(\\/)?>';

var close_tag   = '<\\/([A-Za-z][A-Za-z0-9\\-]*)\\s*>';
var comment     = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
var processing  = '<[?].*?[?]>';
var declaration = '<![A-Z]+\\s+[^>]*>';
var cdata       = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';

//var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
//                         '|' + processing + '|' + declaration + '|' + cdata + ')');
export const HTML_OPEN_TAG_RE = new RegExp('^(?:' + open_tag + '|' + comment +
  '|' + processing + '|' + declaration + '|' + cdata + ')');

export const HTML_CLOSE_TAG_RE = new RegExp('^(?:' + close_tag + ')');

export const HTML_OPEN_TAG = new RegExp('^(?:' + open_tag + ')');

// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//
export const HTML_SEQUENCES = [
  [ /^<(script)(?=(\s|>|$))/i, /<\/(script)>/i, true ],
  [ /^<(pre)(?=(\s|>|$))/i, /<\/(pre)>/i, true ],
  [ /^<(style)(?=(\s|>|$))/i, /<\/(style)>/i, true ],
  [ /^<!--/,        /-->/,   true ],
  [ /^<\?/,         /\?>/,   true ],
  [ /^<![A-Z]/,     />/,     true ],
  [ /^<!\[CDATA\[/, /\]\]>/, true ],
  [ new RegExp('^<(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), '', true ],
  [ new RegExp(HTML_OPEN_TAG.source + '\\s*$'),  '', false ]
  // [ new RegExp('^</?(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true ],
  // [ new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + '\\s*$'),  /^$/, false ]
];
export const selfClosingTags = [
  "area",//
  "base",//
  "br",//
  "col",
  "embed",
  "hr",//
  "img",//
  "input",//
  "link",//
  "meta",//
  "param",
  "source",
  "track",
  "wbr"
];


export const extractFullHtmlTagContent = (html: string, tag: string): string[] => {
  const matches: string[] = []; // Store full matched <tag> elements

  try {
    const regex: RegExp = new RegExp(`<${tag}\\b[^>]*>|<\\/${tag}>`, 'gi'); // Match opening and closing <tag> tags
    const stack: number[] = []; // Stack to track opening <tag> tags
    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null) {
      const isOpeningTag: boolean = match[0].startsWith(`<${tag}`);
      const isClosingTag: boolean = match[0].startsWith(`</${tag}>`);

      if (isOpeningTag) {
        // Found an opening <tag> tag
        stack.push(match.index);
      } else if (isClosingTag && stack.length > 0) {
        // Found a closing </tag> tag
        const start: number = stack.pop(); // Pop the last opening <tag> position from the stack
        if (stack.length === 0) {
          // When the stack is empty, we've found a full <tag> block
          const fullTagContent = html.slice(start, regex.lastIndex); // Extract the full <tag> content
          matches.push(fullTagContent); // Store the full matched <tag>
        }
      }
    }

    return matches;
  } catch (err) {
    console.error("[ERROR]=>[extractFullHtmlTagContent]=>", err);
    return matches;
  }
};


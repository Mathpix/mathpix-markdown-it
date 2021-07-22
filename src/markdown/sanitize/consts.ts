import { svgTags, htmlTags } from "./tags";
import { svgAttrs, htmlAttrs } from "./attrs";

/** default sanitize allowedTags
 **  [ 'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code', 'div', 'em', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'iframe',
 **    'li', 'nl', 'ol', 'p', 'pre', 'strike', 'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul']
 **/

export const allowedTags = [
  'dd', 'del', 'details', 'div', 'dl', 'dt', 'h1', 'h2', 'iframe',
  'img', 'input', 'ins', 'figure', 'figcaption', 'kbd', 'meta', 'path', 'pre', 'q', 'rp', 'rt', 'ruby',
  's', 'samp', 'span', 'strike', 'sub', 'summary', 'sup', 'svg', 'tfoot', 'var'
];

/** all sanitize allowedTags
 [ 'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code',
 'dd', 'del', 'details', 'div', 'dl', 'dt', 'em',
 'h1', 'h2','h3', 'h4', 'h5', 'h6', 'hr',
 'i', 'iframe', 'img', 'input', 'ins', 'kbd',
 'li', 'meta', 'nl', 'ol', 'p', 'path', 'pre', 'q', 'rp', 'rt', 'ruby',
 's', 'samp', 'span','strike', 'strong', 'sub', 'summary', 'sup', 'svg',
 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul', 'var']
 **/

export const allowedAttributes =  {
  '*':        ['accesskey', 'class', 'contenteditable', 'contextmenu', 'dir',
               'hidden', 'id', 'lang', 'spellcheck', 'style', 'tabindex', 'title'],
  a:          ['href', 'name', 'target', 'aria-hidden', 'rel'],
  abbr:       ['title'],
  b:          [],
  blockquote: [],
  br:         ['clear'],
  caption:    ['align', 'valign'],
  code:       [],
  dd:         [],
  del:        ['cite', 'datetime'],
  details:    ['open'],
  div :       ['align', 'title'],
  dl:         [],
  dt:         [],
  em:         [],
  h1:         ['align'],
  h2:         ['align'],
  h3:         ['align'],
  h4:         ['align'],
  h5:         ['align'],
  h6:         ['align'],
  hr:         ['align', 'color', 'noshade', 'size', 'width'],
  i:          [],
  iframe:     ['align', 'allowfullscreen', 'frameborder', 'height', 'src', 'width'],
  img:        ['align', 'alt', 'border', 'height', 'hspace', 'src', 'vspace', 'width'],
  input:      ['align', 'alt', 'checked', 'disabled', 'type', 'value'],
  ins:        ['cite', 'datetime'],
  figure:     [],
  figcaption: [],
  kbd:        [],
  li:         ['type', 'value'],
  meta:       ['name', 'content'],
  nl:         [],
  ol:         ['type', 'reversed', 'start'],
  p:          ['align'],
  pre:        [],
  q:          ['cite'],
  rp:         [],
  rt:         [],
  ruby:       [],
  s:          [],
  samp:       [],
  span:       [],
  strike:     [],
  strong:     [],
  sub:        [],
  summary:    [],
  sup:        [],
  table:      ['align', 'background', 'bgcolor', 'border', 'bordercolor', 'cellpadding',
               'cellspacing', 'cols', 'frame', 'height', 'rules', 'summary', 'width'],
  tbody:      ['align', 'char', 'charoff', 'bgcolor', 'valign'],
  td:         ['abbr', 'align', 'axis', 'background', 'bgcolor', 'bordercolor', 'char', 'charoff',
               'colspan', 'headers', 'height', 'nowrap', 'rowspan', 'scope', 'valign', 'width'],
  tfoot:      ['align', 'bgcolor', 'char', 'charoff', 'valign'],
  th:         ['abbr', 'align', 'axis', 'background', 'bgcolor', 'bordercolor', 'char', 'charoff',
               'colspan', 'headers', 'height', 'nowrap', 'rowspan', 'scope', 'valign', 'width'],
  thead:      ['align', 'char', 'charoff', 'bgcolor', 'valign'],
  tr:         ['align', 'bgcolor', 'bordercolor', 'char', 'charoff', 'valign'],
  ul:         ['type'],
  var:        []
};

export const generateAllowedTagsAndAttrs = (addHtmlTags = false) => {
  let tags = allowedTags.concat(svgTags);
  if (addHtmlTags) {
    tags = tags.concat(htmlTags);
  }
  const attrs = {...allowedAttributes}

  if (addHtmlTags) {
    htmlTags.map(item => {
      if (!Object(allowedAttributes).hasOwnProperty(item)) {
        attrs[item] = htmlAttrs
      }
    });
  }

  svgTags.map(item => {
    if (!Object(allowedAttributes).hasOwnProperty(item)) {
      attrs[item] = svgAttrs
    }
  });

  return { allowedTags: tags, allowedAttributes: attrs };
};

export const allowedSchemes = ['http', 'https', 'mailto', 'github-windows', 'github-mac', 'data'];
export const allowedSchemesFile = ['file', 'http', 'https', 'mailto', 'github-windows', 'github-mac', 'data'];

export const allowedClasses = {
  a: ['anchor'],
  div: [
    'highlight',
    'hljs',
    'bash',
    'css',
    'coffee',
    'coffeescript',
    'diff',
    'glsl',
    'http',
    'js',
    'javascript',
    'json',
    'jsx',
    'lang-html',
    'line',
    'sh',
    'shell',
    'typescript',
    'ts',
    'xml',
    'youtube-video'
  ],
  h1: ['package-name-redundant', 'package-description-redundant'],
  input: ['task-list-item-checkbox'],
  li: ['task-list-item'],
  ol: ['contains-task-list'],
  p: ['package-description-redundant'],
  pre: ['editor', 'editor-colors'],
  svg: ['octicon', 'octicon-link'],
  ul: ['contains-task-list']
};



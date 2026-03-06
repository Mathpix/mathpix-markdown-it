import { HIGHLIGHT_COLOR, HIGHLIGHT_TEXT_COLOR } from "../markdown/common/consts";
import {
  COLOR_CODE_BG, COLOR_BLOCKQUOTE_TEXT, COLOR_BLOCKQUOTE_BORDER,
  COLOR_TABLE_BORDER, COLOR_TABLE_ROW_BG, COLOR_TABLE_ROW_BORDER, COLOR_TABLE_ROW_ALT_BG,
  COLOR_LINK, COLOR_MARK_BG, COLOR_MATH_ERROR_BG, COLOR_MATH_ERROR_TEXT,
  COLOR_TOC_SUBTITLE, COLOR_TOC_LINK, COLOR_TOC_LINK_HOVER, COLOR_TOC_LINK_ACTIVE,
} from "./colors";

export { COLOR_CODE_BG } from "./colors";

export const resetBodyStyles = `
body {
  margin: 0;
  line-height: normal;
}
`;

interface LayoutOpts {
  setTextAlignJustify: boolean;
  maxWidth: string;
  isPptx: boolean;
}

const layoutStyles = ({ setTextAlignJustify, maxWidth, isPptx }: LayoutOpts): string => {
  const justify = setTextAlignJustify ? 'text-align: justify;' : '';
  return [
    `
#setText > div {
  justify-content: inherit;
  margin-top: 0;
  margin-bottom: 1em;
  ${justify}
  ${maxWidth ? 'overflow-x: auto;' : ''}
}`,
    maxWidth && `
#setText > blockquote,
#setText > h1, #setText > h2, #setText > h3,
#setText > h4, #setText > h5, #setText > h6 {
  overflow-x: auto;
}`,
    !isPptx && `
#setText div:last-child {
  margin-bottom: 0 !important;
}`,
    `
#setText > br, #preview-content br {
  line-height: 1.2;
}`,
    `
#preview-content > div {
  margin-top: 0;
  margin-bottom: 1em;
  ${justify}
}`,
    `
.proof > div,
#preview-content .proof > div, #setText .proof > div,
.theorem > div,
#preview-content .theorem > div, #setText .theorem > div {
  margin-top: 1rem;
}`,
  ].filter(Boolean).join('');
};

const mathStyles = (maxWidth: string): string => [
    `
mjx-container {
  text-indent: 0;
  overflow-y: hidden;
  overflow-x: auto;
  padding-top: 1px;
  padding-bottom: 1px;
  ${maxWidth ? `max-width: ${maxWidth};` : ''}
}`,
    maxWidth && `
mjx-container[jax="SVG"] > svg {
  overflow-x: auto;
}`,
    `
.math-inline mjx-container {
  display: inline-block !important;
  page-break-inside: avoid;
  max-width: 100%;
  padding: 0;
  line-height: 0;
}
.math-inline[data-overflow="visible"] mjx-container {
  overflow: visible;
}
.math-inline mjx-container mjx-assistive-mml {
  max-width: 100%;
}
.math-block {
  align-items: center;
  page-break-after: auto;
  page-break-inside: avoid;
  margin: 0;
  display: block;
}
.math-inline {
  display: inline-flex;
  max-width: 100%;
}
.math-block[data-width="full"] {
  overflow-x: auto;
  display: flex;
}
.math-block[data-width="full"] mjx-container[jax=SVG][display=true] {
  display: flex;
  flex: 1 1;
  justify-content: center;
}
svg .math-inline {
  display: initial;
  max-width: initial;
}
svg .math-inline mjx-container {
  max-width: initial;
}
svg mjx-container {
  overflow: visible;
  padding: 0;
}
svg .math-block[data-width="full"] {
  overflow: visible;
}
.math-block, .math-inline {
  --mmd-highlight-color: ${HIGHLIGHT_COLOR};
  --mmd-highlight-text-color: ${HIGHLIGHT_TEXT_COLOR};
}
.math-block[data-highlight-color] mjx-container[jax="SVG"] > svg {
  background-color: var(--mmd-highlight-color);
}
.math-block[data-highlight-text-color] mjx-container[jax="SVG"] > svg {
  color: var(--mmd-highlight-text-color);
}
.math-inline[data-highlight-color] mjx-container[jax="SVG"] {
  background-color: var(--mmd-highlight-color);
}
.math-inline[data-highlight-text-color] mjx-container[jax="SVG"] {
  color: var(--mmd-highlight-text-color);
}
.math-block p {
  flex-shrink: 1;
}
.math-block mjx-container {
  margin: 0 !important;
}
.math-error {
  background-color: ${COLOR_MATH_ERROR_BG};
  color: ${COLOR_MATH_ERROR_TEXT};
}`,
].filter(Boolean).join('');

const imageStyles = (): string => `
#preview-content img, #setText img {
  max-width: 100%;
}`;

const blockquoteStyles = (useColors: boolean): string => `
#preview-content blockquote, #setText blockquote {
  page-break-inside: avoid;
  ${useColors ? `color: ${COLOR_BLOCKQUOTE_TEXT};` : ''}
  margin: 0 0 1em 0;
  padding-left: 3em;
  border-left: .5em solid ${useColors ? COLOR_BLOCKQUOTE_BORDER : 'currentColor'};
}`;

const codeBlockStyles = (useColors: boolean): string => `
#preview-content pre, #setText pre {
  border: none;
  padding: 0;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  border-radius: 6px;
  box-sizing: border-box;
  ${useColors ? `background: ${COLOR_CODE_BG};` : ''}
}
#preview-content pre code, #setText pre code {
  padding: 1rem;
  display: block;
  overflow-x: auto;
  line-height: 24px;
}`;

const tableStyles = (useColors: boolean): string => `
#preview-content table, #setText table {
  display: table;
  overflow: auto;
  max-width: 100%;
  border-collapse: collapse;
  page-break-inside: avoid;
  margin-bottom: 1em;
}
#preview-content table th, #setText table th {
  text-align: center;
  font-weight: bold;
}
#preview-content table td, #setText table td,
#preview-content table th, #setText table th {
  border: 1px solid ${useColors ? COLOR_TABLE_BORDER : 'currentColor'};
  padding: 6px 13px;
}
#preview-content table tr, #setText table tr {
  ${useColors ? `background-color: ${COLOR_TABLE_ROW_BG};` : ''}
  border-top: 1px solid ${useColors ? COLOR_TABLE_ROW_BORDER : 'currentColor'};
}
#preview-content table tr:nth-child(2n), #setText table tr:nth-child(2n) {
  ${useColors ? `background-color: ${COLOR_TABLE_ROW_ALT_BG};` : ''}
}`;

const docStructureStyles = (): string => `
.main-title,
#preview-content .main-title, #setText .main-title {
  text-align: center;
  line-height: 1.2;
  margin: 0 auto 1em auto;
}
.author,
#preview-content .author, #setText .author {
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.author p,
#preview-content .author p, #setText .author p {
  min-width: 30%;
  max-width: 50%;
  padding: 0 7px;
}
.author > p > span,
#preview-content .author > p > span, #setText .author > p > span {
  display: block;
  text-align: center;
}
.section-title,
#preview-content .section-title, #setText .section-title {
  margin-top: 1.5em;
}
.abstract,
#preview-content .abstract, #setText .abstract {
  text-align: justify;
  margin-bottom: 1em;
}
.abstract p,
#preview-content .abstract p, #setText .abstract p {
  margin-bottom: 0;
}
#preview-content sup, #setText sup {
  top: -.5em;
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
}`;

const inlineTextStyles = (useColors: boolean): string => `
.text-url,
#preview-content .text-url, #setText .text-url {
  ${useColors ? `color: ${COLOR_LINK};` : ''}
  cursor: text;
  pointer-events: none;
}
.text-url a:hover,
#preview-content .text-url a:hover, #setText .text-url a:hover {
  ${useColors ? `color: ${COLOR_LINK};` : ''}
}
mark,
#preview-content mark, #setText mark {
  ${useColors ? `background-color: ${COLOR_MARK_BG};` : ''}
}
span[data-underline-type] mark,
#preview-content span[data-underline-type] mark,
#setText span[data-underline-type] mark {
  background: inherit;
  ${useColors ? `background-color: ${COLOR_MARK_BG};` : ''}
  padding-top: 0;
  padding-bottom: 0;
}`;

const miscStyles = (): string => `
*[data-has-dotfill] {
  position: relative;
  overflow: hidden;
}
*[data-has-dotfill] .dotfill::after {
  position: absolute;
  padding-left: .25ch;
  content: " . . . . . . . . . . . . . . . . . . . "
      ". . . . . . . . . . . . . . . . . . . . . . . "
      ". . . . . . . . . . . . . . . . . . . . . . . "
      ". . . . . . . . . . . . . . . . . . . . . . . "
      ". . . . . . . . . . . . . . . . . . . . . . . "
      ". . . . . . . . . . . . . . . . . . . . . . . "
      ". . . . . . . . . . . . . . . . . . . . . . . ";
  text-align: right;
}
.smiles,
#preview-content .smiles, #setText .smiles {
  text-align: center;
}
div.svg-container,
#preview-content > div.svg-container,
#setText > div.svg-container {
  display: flex;
  justify-content: center;
}`;

const printStyles = (): string => `
@media print {
  #preview {
    font-size: 10pt !important;
  }
  .math-block svg, .math-inline svg {
    shape-rendering: crispEdges;
    margin-top: 1px;
  }
  #preview-content img, #setText img {
    display: block;
  }
  #preview-content .figure_img img, #setText .figure_img img {
    display: inline;
  }
  #preview-content h1, #preview-content h2, #preview-content h3,
  #preview-content h4, #preview-content h5, #preview-content h6,
  #setText h1, #setText h2, #setText h3,
  #setText h4, #setText h5, #setText h6 {
    page-break-inside: avoid;
    position: relative;
    border: 2px solid transparent;
  }
  #preview-content h1::after, #preview-content h2::after, #preview-content h3::after,
  #preview-content h4::after, #preview-content h5::after, #preview-content h6::after,
  #setText h1::after, #setText h2::after, #setText h3::after,
  #setText h4::after, #setText h5::after, #setText h6::after {
    content: "";
    display: block;
    height: 100px;
    margin-bottom: -100px;
    position: relative;
  }
}`;

export const MathpixStyle = (
  setTextAlignJustify: boolean = false,
  useColors: boolean = true,
  maxWidth: string = '',
  isPptx: boolean = false
): string => [
  layoutStyles({ setTextAlignJustify, maxWidth, isPptx }),
  mathStyles(maxWidth),
  imageStyles(),
  blockquoteStyles(useColors),
  codeBlockStyles(useColors),
  tableStyles(useColors),
  docStructureStyles(),
  inlineTextStyles(useColors),
  miscStyles(),
  printStyles(),
].join('');

export const PreviewStyle = `
#preview {
  font-family: 'CMU Serif', 'Georgia', Helvetica, Arial, sans-serif;
  font-size: 17px;
  visibility: visible;
  word-break: break-word;
  padding: 2.5em;
  max-width: 800px;
  margin: auto;
  box-sizing: content-box;
}
#preview h1, #preview h2, #preview h3, #preview h4, #preview h5, #preview strong {
  font-family: 'CMU Serif Bold', 'Georgia', Helvetica, Arial, sans-serif;
}
#preview i, #preview em {
  font-family: 'CMU Serif Italic', 'Georgia', Helvetica, Arial, sans-serif;
}
`;

export const TocStyle = (containerName: string = 'toc') => `
#${containerName} {
  width: 25%;
  overflow-y: auto;
  min-width: 370px;
}
@media only screen and (max-width: 960px) {
  #${containerName} { display: none; }
}
@media print {
  #${containerName} { display: none; }
}
#toc_container {
  padding: 70px 0 0 60px;
}
#toc_container .toc-title-1 {
  font-weight: 500;
}
#toc_container .toc-title-1 a {
  font-size: 1.6em;
}
#toc_container .toc-title-2 a {
  font-size: 1.3em;
}
#toc_container .toc-title-3, #toc_container .toc-title-4, #toc_container .toc-title-5, .previewPage #toc_container .toc-title-6 {
  padding-left: 20px;
}
#toc_container .toc-title-3 a, #toc_container .toc-title-4 > a, #toc_container .toc-title-5 > a, .previewPage #toc_container .toc-title-6 > a {
  font-size: 1em;
  color: ${COLOR_TOC_SUBTITLE};
}
#toc_container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
#toc_container li {
  padding-top: 20px;
}
#toc_container li a {
  color: ${COLOR_TOC_LINK};
}
#toc_container li a:hover {
  color: ${COLOR_TOC_LINK_HOVER};
}
#toc_container li a:active,
#toc_container li .selected {
  color: ${COLOR_TOC_LINK_ACTIVE} !important;
}
`;

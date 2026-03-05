import {
  COLOR_BODY_TEXT, COLOR_HEADING_TEXT, COLOR_CAPTION_TEXT,
  COLOR_LINK, COLOR_LINK_HOVER, COLOR_LINK_ACTIVE, COLOR_LINK_DISABLED,
} from "./colors";

export const ContainerStyle = (useColors: boolean = true): string => `
  html,body {
    width: 100%;
    height: 100%;
  }
  *, *::before,*::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    ${useColors ? `color: ${COLOR_BODY_TEXT};` : ''}
    font-size: 14px;
    line-height: normal;
  }
  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5em;
    ${useColors ? `color: ${COLOR_HEADING_TEXT};` : ''}
    font-weight: 500;
  }
  p {
    margin-top: 0;
    margin-bottom: 1em;
  }
  ol, ul, dl {
    margin-top: 0;
    margin-bottom: 1em;
  }
  ol ol, ul ul, ol ul, ul ol {
    margin-bottom: 0;
  }
  dt {
    font-weight: 500;
  }
  dd {
    margin-bottom: 0.5em;
    margin-left: 0;
  }
  blockquote {
    margin: 0 0 1em;
  }
  dfn {
    font-style: italic;
  }
  b, strong {
    font-weight: bolder;
  }
  small {
    font-size: 80%;
  }
  sub, sup {
    position: relative;
    font-size: 75%;
    line-height: 0;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  a {
    ${useColors ? `color: ${COLOR_LINK};` : ''}
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
  }
  a:hover {
    ${useColors ? `color: ${COLOR_LINK_HOVER};` : ''}
  }
  a:active {
    ${useColors ? `color: ${COLOR_LINK_ACTIVE};` : ''}
  }
  a:active, a:hover {
    text-decoration: none;
    outline: 0;
  }
  a[disabled] {
    ${useColors ? `color: ${COLOR_LINK_DISABLED};` : ''}
    cursor: not-allowed;
    pointer-events: none;
  }
  pre, code, kbd, samp {
    font-size: 1em;
  }
  pre {
    margin-top: 0;
    margin-bottom: 1em;
    overflow: auto;
  }
  figure {
    margin: 0 0 1em;
  }
  img {
    vertical-align: middle;
    border-style: none;
  }
  svg:not(:root) {
    overflow: hidden;
  }
  table {
    border-collapse: collapse;
  }
  caption {
    padding-top: 0.75em;
    padding-bottom: 0.3em;
    ${useColors ? `color: ${COLOR_CAPTION_TEXT};` : ''}
    text-align: left;
    caption-side: bottom;
  }
  th {
    text-align: inherit;
  }
`;

export const resetBodyStyles = `
  body {
    margin: 0;
    line-height: normal;
  }
`;
export const MathpixStyle = (setTextAlignJustify: boolean = true) => {
  return `
    #setText > div {
        justify-content: inherit;
        margin-top: 0;
        margin-bottom: 1em;
        ${setTextAlignJustify ? 'text-align: justify;' : ''}
    }
    
    #setText div:last-child {
        margin-bottom: 0 !important;
    }

    #setText > br, #preview-content br {
        line-height: 1.2;
    }

    #preview-content > div {
        margin-top: 0;
        margin-bottom: 1em;
        text-align: justify;
    }

    #preview-content table {
      margin-bottom: 1em;
    }

    #setText table {
      margin-bottom: 1em;
    }

    mjx-container {
      overflow-y: visible !important;
      padding-top: 1px;
      padding-bottom: 1px;
    }
    
    .math-inline mjx-container {
        display: inline-block !important;
        page-break-inside: avoid;
    }
    .math-block {
        align-items: center;
        min-width: min-content;
        page-break-after: auto;
        page-break-inside: avoid;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .math-block p {
        flex-shrink: 1;
    }
    .math-block mjx-container {
        margin: 0 !important;
    }
    .math-error {
        background-color: yellow;
        color: red;
    }

    img {
        max-width: 100%;
    }
    
    blockquote {
        page-break-inside: avoid;
        color: #666;
        margin: 0 0 1em 0;
        padding-left: 3em;
        border-left: .5em solid #eee;
    }

    pre {
        border: 1px solid #ccc;
        page-break-inside: avoid;
        padding: 0.5em;
        background: #f8f8fa;
    }
    .empty {
        text-align: center;
        font-size: 18px;
        padding: 50px 0 !important;
    }

    #setText table, #preview table {
        display: block; 
        overflow: auto;
        width: 100%;
        border-collapse: collapse;
        page-break-inside: avoid;
    }
      
    #setText table th, #preview table th {
        text-align: center;
        font-weight: bold;
    }
    
    #setText table td, #preview table td,
    #setText table th, #preview table th {
        border: 1px solid #dfe2e5;
        padding: 6px 13px;
    }
      
    #setText table tr, #preview table tr {
        background-color: #fff;
        border-top: 1px solid #c6cbd1;
    }
    
    #setText table tr:nth-child(2n), #preview table tr:nth-child(2n) {
        background-color: #f6f8fa;
    }

    
    .main-title, .author {
        text-align: center;
        margin: 0 auto;
    }
    
    .main-title {
        line-height: 1.2;
        margin-bottom: 1em;
    }

    .author {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .author p {
        min-width: 30%;
        max-width: 50%;
        padding: 0 7px;
    }

    .author span {
        display: block;
        text-align: center;
    }

    .section-title {
        margin-top: 1.5em;
    }

    .abstract {
        text-align: justify;
        margin-bottom: 1em;
    }

    .abstract p {
        margin-bottom: 0;
    }

    @media print {

      #preview {
        font-size: 10pt!important;
      }

      svg {
        shape-rendering: crispEdges;
      }

      .math-block svg, math-inline svg {
        margin-top: 1px;
      }

      img {
        display: block;
      }
      
      .figure_img img {
        display: inline;
      }

      .preview-right {
        word-break: break-word;
      }

      h1 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      h1::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      h2 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      h2::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      h3 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      h3::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      h4 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      h4::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      h5 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      h5::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      h6 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      h6::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
    }
`};

export const codeStyles = `
    code {
      font-family: Inconsolata;
      font-size: inherit;
      display: initial;
      background: #f8f8fa;
    }
    pre code {
      font-size: inherit;
      display: block;
      color: #333;
      overflow-x: auto;
      font-size: 15px;
    }

    .hljs-comment,
    .hljs-quote {
      color: #998;
      font-style: italic;
    }

    .hljs-command {
      color: #005cc5;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-subst {
      color: #d73a49;
      font-weight: bold;
    }

    .hljs-number,
    .hljs-literal,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-tag .hljs-attr {
      color: #005cc5;
    }

    .hljs-string,
    .hljs-doctag {
      color: #24292e;
    }

    .hljs-title,
    .hljs-section,
    .hljs-selector-id {
      color: #6f42c1;
      font-weight: bold;
    }

    .hljs-subst {
      font-weight: normal;
    }

    .hljs-type,
    .hljs-class .hljs-title {
      color: #458;
      font-weight: bold;
    }

    .hljs-tag,
    .hljs-name,
    .hljs-attribute {
      color: #000080;
      font-weight: normal;
    }

    .hljs-regexp,
    .hljs-link {
      color: #009926;
    }

    .hljs-symbol,
    .hljs-bullet {
      color: #990073;
    }

    .hljs-built_in,
    .hljs-builtin-name {
      color: #24292e;
    }

    .hljs-meta {
      color: #999;
      font-weight: bold;
    }

    .hljs-meta-keyword {
      color: #d73a49;
    }

    .hljs-meta-string {
      color: #032f62;
    }

    .hljs-deletion {
      background: #fdd;
    }

    .hljs-addition {
      background: #dfd;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: bold;
    }
`

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

  #preview  i, #preview  em {
    font-family: 'CMU Serif Italic', 'Georgia', Helvetica, Arial, sans-serif;
  }
`;

export const ContainerStyle = `
  html,body {
    width: 100%;
    height: 100%;
  }
  *, *::before,*::after {
    box-sizing: border-box;
  }
  @-ms-viewport {
    width: device-width;
  }
  body {
    margin: 0;
    color: #1E2029;
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
    color: rgba(0, 0, 0, 0.85);
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
    color: #0B93ff;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
  }
  a:hover {
    color: #33aaff;
  }
  a:active {
    color: #0070d9;
  }
  a:active, a:hover {
    text-decoration: none;
    outline: 0;
  }
  a[disabled] {
    color: rgba(0, 0, 0, 0.25);
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
    color: rgba(0, 0, 0, 0.45);
    text-align: left;
    caption-side: bottom;
  }
  th {
    text-align: inherit;
  }
`;

export const TocStyle = (containerName: string = 'toc') => `
  #${containerName} {
    width: 25%;
    overflow-y: auto;
    min-width: 370px; 
  }
  @media only screen and (max-width: 960px) {
    #{containerName}  {
      display: none; 
    } 
  }
  @media print {
    #{containerName}  {
      display: none; 
    } 
  } 
  #toc_container {
    padding: 70px 0 0 60px; 
  }
  #toc_container .toc-title-1 {
    font-weight: 500; 
  }
  #toc_container .toc-title-1 > a {
    font-size: 1.6em; 
  }
  #toc_container .toc-title-2 > a {
    font-size: 1.3em; 
  }
  #toc_container .toc-title-3,  #toc_container .toc-title-4,  #toc_container .toc-title-5, .previewPage #toc_container .toc-title-6 {
    padding-left: 20px; 
  }
  #toc_container .toc-title-3 > a,  #toc_container .toc-title-4 > a,  #toc_container .toc-title-5 > a, .previewPage #toc_container .toc-title-6 > a {
    font-size: 1em;
    color: #979797; 
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
    color: #000; 
  }
  #toc_container li a:hover {
    color: #0093FF; 
  }
  #toc_container li a:active,
  #toc_container li .selected {
    color: #047DD6 !important; 
  }
`;

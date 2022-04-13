export const resetBodyStyles = `
  body {
    margin: 0;
    line-height: normal;
  }
`;
export const MathpixStyle = (setTextAlignJustify: boolean = false, useColors: boolean = true, maxWidth: string = '', scaleEquation = true ) => {
  return `
    #setText > div {
        justify-content: inherit;
        margin-top: 0;
        margin-bottom: 1em;
        ${setTextAlignJustify ? 'text-align: justify;' : ''}
        ${maxWidth ? 'overflow-x: auto;' : ''}
    }
    
    ${maxWidth ? '#setText > blockquote, h1, h2, h3, h4, h5, h6 { overflow-x: auto; }' : ''}
    
    #setText div:last-child {
        margin-bottom: 0 !important;
    }

    #setText > br, #preview-content br {
        line-height: 1.2;
    }

    #preview-content > div {
        margin-top: 0;
        margin-bottom: 1em;
        ${setTextAlignJustify ? 'text-align: justify;' : ''}
    }

    #preview-content table {
      margin-bottom: 1em;
    }

    #setText table {
      margin-bottom: 1em;
    }

    mjx-container {
      text-indent: 0;
      overflow-y: visible !important;
      padding-top: 1px;
      padding-bottom: 1px;
      ${maxWidth ? 'max-width:' + maxWidth + ';' : ''}
      ${maxWidth ? 'overflow-x: auto;' : ''}
    }
    
    ${maxWidth ? 'mjx-container[jax="SVG"] > svg { overflow-x: auto; }' : ''}
    
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

    ${scaleEquation ? '#preview-content svg, #setText svg { min-width: initial !important;}' : ''}

    #preview-content img, #setText img {
        max-width: 100%;
    }
    
    #preview-content blockquote,  #setText blockquote {
        page-break-inside: avoid;
        ${useColors ? 'color: #666;' : ''}
        margin: 0 0 1em 0;
        padding-left: 3em;
        border-left: .5em solid #eee;
    }

    #preview-content pre, #setText pre {
        border: 1px solid #ccc;
        page-break-inside: avoid;
        padding: 0.5em;
        ${useColors ? 'background: #f8f8fa;' : ''}
    }
    .empty {
        text-align: center;
        font-size: 18px;
        padding: 50px 0 !important;
    }

    #setText table, #preview-content table {
        display: block; 
        overflow: auto;
        width: 100%;
        border-collapse: collapse;
        page-break-inside: avoid;
    }
      
    #setText table th, #preview-content table th {
        text-align: center;
        font-weight: bold;
    }
    
    #setText table td, #preview-content table td,
    #setText table th, #preview-content table th {
        border: 1px solid #dfe2e5;
        padding: 6px 13px;
    }
      
    #setText table tr, #preview-content table tr {
        ${useColors ? 'background-color: #fff;' : ''}
        border-top: 1px solid ${useColors ? '#c6cbd1' : 'currentColor'};
    }
    
    #setText table tr:nth-child(2n), #preview-content table tr:nth-child(2n) {
        ${useColors ? 'background-color: #f6f8fa;' : ''}
    }

    
    #setText .main-title, #setText .author, #preview-content .main-title, #preview-content .author  {
        text-align: center;
        margin: 0 auto;
    }
    
    #preview-content .main-title, #setText .main-title {
        line-height: 1.2;
        margin-bottom: 1em;
    }

    #preview-content .author, #setText .author  {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    #preview-content .author p, #setText .author p {
        min-width: 30%;
        max-width: 50%;
        padding: 0 7px;
    }

    #preview-content .author > p > span, #setText .author > p > span {
        display: block;
        text-align: center;
    }

    #preview-content .section-title, #setText .section-title {
        margin-top: 1.5em;
    }

    #preview-content .abstract, #setText .abstract {
        text-align: justify;
        margin-bottom: 1em;
    }

    #preview-content .abstract p, #setText .abstract p {
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

      #preview-content img, #setText img {
        display: block;
      }
      
      #preview-content .figure_img img, #setText .figure_img img {
        display: inline;
      }

      .preview-right {
        word-break: break-word;
      }

      #preview-content h1, #setText h1 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      #preview-content h1::after, #setText h1::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      #preview-content h2, #setText h2 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      #preview-content h2::after, #setText h2::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      #preview-content h3, #setText h3 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      #preview-content h3::after, #setText h3::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      #preview-content h4, #setText h4 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      #preview-content h4::after, #setText h4::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      #preview-content h5, #setText h5 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      #preview-content h5::after, #setText h5::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
  
      #preview-content h6, #setText h6 {
        page-break-inside: avoid;
        position: relative;
        border: 2px solid transparent;
      }
  
      #preview-content h6::after, #setText h6::after {
        content: "";
        display: block;
        height: 100px;
        margin-bottom: -100px;
        position: relative;
      }
    }
    #preview-content sup, #setText sup {
      top: -.5em;
      position: relative;
      font-size: 75%;
      line-height: 0;
      vertical-align: baseline;
    }
    
    #preview-content .text-url, #setText .text-url {
      ${useColors ? 'color: #0B93ff;' : ''}
      cursor: text;
      pointer-events: none;
    }
    
    #preview-content .text-url a:hover, #setText .text-url a:hover {
      ${useColors ? 'color: #0B93ff;' : ''}
    }
`};

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

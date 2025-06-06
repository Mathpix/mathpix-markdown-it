import {checkFormula} from './check-formula';
import {markdownToHTML as markdownHTML, markdownToHTMLSegments} from "../markdown";
import {MathpixStyle, PreviewStyle, TocStyle, resetBodyStyles} from "../styles";
import { ContainerStyle } from "../styles/styles-container";
import { codeStyles } from "../styles/styles-code";
import { tabularStyles } from "../styles/styles-tabular";
import { fontsStyles } from "../styles/styles-fonts";
import { listsStyles } from "../styles/styles-lists";
import {MathJax} from '../mathjax';
import { Property } from 'csstype'; // at top of file
import { ISmilesOptions } from '../markdown/md-chemistry';
import { yamlParser } from '../yaml-parser';
import { generateHtmlPage } from './html-page';
import { getMaxWidthStyle } from '../styles/halpers';
import { parseMarkdownByElement } from '../helpers/parse-mmd-element';
import { menuStyle } from '../contex-menu/styles';
import { clipboardCopyStyles } from '../copy-to-clipboard/clipboard-copy-styles';
import { eMmdRuleType } from "../markdown/common/mmdRules";
import { getDisableRuleTypes } from "../markdown/common/mmdRulesToDisable";
import { fontMetrics, IFontMetricsOptions } from "../markdown/common/text-dimentions";
import { resetSizeCounter, size, ISize } from "../markdown/common/counters";

export interface optionsMathpixMarkdown {
    alignMathBlock?: Property.TextAlign;
    display?: Property.Display;
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    isDisableFancy?: boolean;
    isDisableEmoji?: boolean;
    isDisableEmojiShortcuts?: boolean;
    isDisableRefs?: boolean;
    isDisableFootnotes?: boolean;
    disableRules?: string[];
    fontSize?: number;
    padding?: number;
    htmlTags?: boolean; // Enable HTML tags in source
    htmlDisableTagMatching?: boolean; //  Allows to turn off the validation that checks for matching opening and closing HTML tags
    breaks?: boolean,
    typographer?: boolean,
    linkify?: boolean,
    enableFileLinks?: boolean,
    validateLink?: (url: string) => void;
    xhtmlOut?: boolean,
    width?: number;
    showToc?: boolean;
    overflowY?: string; //default 'unset'
    outMath?: TOutputMath;
    mathJax?: TOutputMathJax;
    htmlSanitize?: THtmlSanitize;
    smiles?: ISmilesOptions;
    forDocx?: boolean;
    forLatex?: boolean;
    forMD?: boolean;
    forPptx?: boolean;
    openLinkInNewWindow?: boolean;
    maxWidth?: string;
    toc?: TTocOptions;
    accessibility?: TAccessibility;
    nonumbers?: boolean;
    showPageBreaks?: boolean;
    centerImages?: boolean;
    centerTables?: boolean;
    enableCodeBlockRuleForLatexCommands?: boolean;
    addPositionsToTokens?: boolean;
    highlights?: Array<THighlight>;
    parserErrors?: ParserErrors;
    codeHighlight?: CodeHighlight;
    footnotes?: Footnotes;
    copyToClipboard?: boolean;
    renderOptions?: RenderOptions;
    previewUuid?: string;
}

export type TMarkdownItOptions = {
  isDisableFancy?: boolean;
  isDisableEmoji?: boolean;
  isDisableEmojiShortcuts?: boolean;
  isDisableRefs?: boolean,
  isDisableFootnotes?: boolean,
  disableRules?: string[];
  htmlTags?: boolean,
  htmlDisableTagMatching?: boolean; //  Allows to turn off the validation that checks for matching opening and closing HTML tags
  breaks?: boolean,
  typographer?: boolean,
  linkify?: boolean,
  enableFileLinks?: boolean,
  validateLink?: (url: string) => void,
  xhtmlOut?: boolean,
  width?: number,
  lineNumbering?: boolean,
  startLine?: number,
  renderElement?: {
    inLine?: boolean,
    startLine?: number,
    class?: string,
    preview?: any
  },
  outMath?: TOutputMath,
  mathJax?: TOutputMathJax,
  htmlSanitize?: THtmlSanitize;
  smiles?: ISmilesOptions;
  forDocx?: boolean;
  forLatex?: boolean;
  forMD?: boolean;
  forPptx?: boolean;
  openLinkInNewWindow?: boolean;
  maxWidth?: string;
  htmlWrapper?: THtmlWrapper | boolean;
  toc?: TTocOptions;
  accessibility?: TAccessibility;
  nonumbers?: boolean;
  showPageBreaks?: boolean;
  centerImages?: boolean;
  centerTables?: boolean;
  enableCodeBlockRuleForLatexCommands?: boolean;
  addPositionsToTokens?: boolean;
  highlights?: Array<THighlight>;
  parserErrors?: ParserErrors;
  codeHighlight?: CodeHighlight;
  footnotes?: Footnotes;
  copyToClipboard?: boolean;
  renderOptions?: RenderOptions;
  previewUuid?: string;
  enableSizeCalculation?: boolean;
}

export type TOutputMath = {
  include_mathml?: boolean,
  include_mathml_word?: boolean,
  include_asciimath?: boolean,
  include_latex?: boolean,
  include_svg?: boolean,
  include_table_html?: boolean,
  include_tsv?: boolean,
  include_csv?: boolean,
  include_table_markdown?: boolean,
  include_smiles?: boolean,
  include_mol?: boolean,
  include_speech?: boolean,
  include_error?: boolean,
  tsv_separators?: {
    column?: string,
    row?: string,
  },  
  csv_separators?: {
    column?: string,
    row?: string,
    toQuoteAllFields?: boolean /** to quote all fields whether or not they contain delimiters */
  },  
  md_separators?: {
    column?: string,
    row?: string,
  },
  table_markdown?: {
    math_as_ascii?: boolean,
    math_inline_delimiters?: Array<string>
  },
  not_catch_errors?: boolean
}

export type TOutputMathJax = {
  mtextInheritFont?: boolean,
  asciiMath?: TAsciiMath
}

export type THtmlSanitize = {
  disallowedTagsMode?: string,
  allowedTags?: Array<string>,
  allowedAttributes?: Record<string, string[]>,
  allowedIframeHostnames?: Array<string>,
  selfClosing?: Array<string>,
  allowedSchemes?: Array<string>,
  allowedSchemesByTag?: Record<string, string[]>,
  allowedSchemesAppliedToAttributes?: Array<string>,
  allowProtocolRelative?: boolean,
  enforceHtmlBoundary?: boolean,
  skipCloseTag?: boolean
} | false;

export type TAsciiMath = {
  useBacktick?: boolean,
} | false;

export type THtmlWrapper = {
  title?: string,
  includeStyles?: boolean,
  includeFonts?: boolean
}

export type TTocOptions = {
  style?: TTocStyle,
  doNotGenerateParentId?: boolean /** Don't generate unique ParentId for nested blocks. Used to testing */
};

export type CodeHighlight = {
  auto?: boolean, //Highlighting with language detection
  code?: boolean
};

export type RenderOptions = {
  enable_markdown?: boolean,
  enable_latex?: boolean,
  enable_markdown_mmd_extensions?: boolean
}

export enum TTocStyle {
  summary = 'summary',
  list = 'list'
};

export enum ParserErrors {
  show = 'show',
  hide = 'hide',
  show_input = 'show_input',
};

export type THighlight = {
  start: number,
  end: number,
  highlight_color?: string,
  text_color?: string, 
  font_weight?: string, //not used yet
  include_block?: boolean
};

export type TAccessibility = {
  assistiveMml?: boolean, //true to enable assitive MathML
  sre?: object
};

export type Footnotes = {
  fontSize?: string;
  compact_refs?: boolean;
}

class MathpixMarkdown_Model {
    public disableFancyArrayDef = ['replacements', 'list', 'usepackage', 'toc'];
    public disableRules: string[];
    public isCheckFormula?: boolean;
    public showTimeLog?: boolean;

    setOptions(disableRules: string[], isCheckFormula?: boolean, showTimeLog?: boolean){
        this.disableRules = disableRules;
        this.isCheckFormula = isCheckFormula;
        this.showTimeLog = showTimeLog;
    }
    checkFormula = checkFormula;

  texReset = MathJax.Reset;
  getLastEquationNumber = MathJax.GetLastEquationNumber;

  getMaxWidthStyle = getMaxWidthStyle;
  
  parseMarkdownByHTML = (html: string, include_sub_math: boolean = true) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return this.parseMarkdownByElement(doc, include_sub_math)
  };
  
  parseMarkdownByElement = parseMarkdownByElement;

  markdownToHTMLWithSize = (
    markdown: string,
    options: TMarkdownItOptions = {},
    fontMetricsOptions: IFontMetricsOptions = null
  ): {html: string, size: ISize} => {
    resetSizeCounter();
    if (fontMetricsOptions) {
      fontMetrics.loadFont(fontMetricsOptions);
    }
    options.enableSizeCalculation = true;
    let html: string = this.markdownToHTML(markdown, options);
    return {
      html: html,
      size: size
    }
  }

  markdownToHTMLSegments = (markdown: string, options: TMarkdownItOptions = {}): {content: string, map: [number, number][]} => {
    const { isDisableFancy = false } = options;
    const disableRules = isDisableFancy ? this.disableFancyArrayDef : options ? options.disableRules || [] : [];
    this.setOptions(disableRules);
    return markdownToHTMLSegments(markdown, options);
  }

  markdownToHTML = (markdown: string, options: TMarkdownItOptions = {}):string => {
    const { lineNumbering = false, isDisableFancy = false,  htmlWrapper = false } = options;
    const disableRules = isDisableFancy ? this.disableFancyArrayDef : options ? options.disableRules || [] : [];
    this.setOptions(disableRules);
    let html = markdownHTML(markdown, options);
    if (!lineNumbering) {
      MathJax.Reset();
      // if (html.indexOf('clickable-link') !== -1) {
      //   html = this.checkEquationNumber(html);
      // }
    }

    if (!htmlWrapper) {
      return html;
    }

    if (typeof htmlWrapper !== "boolean") {
      const title = htmlWrapper.title
        ? htmlWrapper.title
        : '';

      const styles = htmlWrapper.includeStyles
        ? `<style>${this.getMathpixStyle(true)}</style>`
        : '';
      const fonts = htmlWrapper.includeFonts
        ? '<link rel="stylesheet" href="https://cdn.mathpix.com/fonts/cmu.css"/>'
        : '';
      return generateHtmlPage(title, html, styles, fonts);
    }

    return generateHtmlPage('Title', html, '', '');
  };

  showTocInContainer = (html: string, containerName: string = 'toc') => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const body = doc.body;
    const toc = body.getElementsByClassName('table-of-contents')[0];
    if (toc) {
      const toc_container = document.getElementById(containerName);
      if (toc_container) {
        toc_container.innerHTML = toc.innerHTML;
        const preview_right = document.getElementById("preview-right");
        if (preview_right) {
          preview_right.style.margin = 'unset';
        }
      }
    }
  };

  getTocContainerHTML = (html: string, onlyContent = true):string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const body = doc.body;
    const toc = body.getElementsByClassName('table-of-contents')[0];
    if (toc) {
      if (!onlyContent) {
        return `<div id="toc_container">` + toc.innerHTML + '</div>'
      }
      return toc.innerHTML;
    }else {
      return '';
    }
  };

  checkEquationNumber = (html: string) => {
    try {
      /** This feature is no longer needed.
       We don't remove it to avoid bugs in applications where it might be called. */
      console.warn('Warning! This feature is deprecated. No need to use it anymore');
      return html;
    } catch (e) {
      return html;
    }
  };

    handleClick = (e) => {
      const domNode = e.target.attributes;
      const preview: HTMLDivElement = <HTMLDivElement>document.getElementById("preview");
      let offsetTarget: number;

      if (domNode.href && domNode.length === 2 ) {
        e.preventDefault();
        const anchor: HTMLElement = document.getElementById(domNode.href.nodeValue.slice(1));
        if (!anchor) { return };
        offsetTarget = anchor.getBoundingClientRect().top + preview.scrollTop - 48;
        this.scrollPage(preview, offsetTarget);
      } else {
        if (domNode.length > 2 && domNode[2].value) {
          if (domNode[2].value === 'clickable-link') {
            e.preventDefault();
            const domID: string = domNode[3].value;
            const el: HTMLElement = document.getElementById(domID);
            if (!el) { return };
            if (el.classList.contains('table')||el.classList.contains('figure')) {
              offsetTarget = el.getBoundingClientRect().top + preview.scrollTop - 48;
            } else {
              offsetTarget = (el.offsetTop) - (window.innerHeight / 2) || 0;
            }
            this.scrollPage(preview, offsetTarget);
          } else {
            if (domNode[2].value && domNode[2].value.indexOf('toc-link') >= 0 ) {
              e.preventDefault();
              const selectLink = document.getElementsByClassName('toc-link');
              if (selectLink && selectLink.length > 0) {
                for (let i = 0; i< selectLink.length; i++) {
                  selectLink[i].classList.remove('selected');
                }
              }
              domNode[2].value = 'toc-link selected';
              const anchor: HTMLElement = document.getElementById(domNode.href.nodeValue.slice(1));
              if (!anchor) { return };
              window.location.hash = anchor.id;
              offsetTarget = anchor.getBoundingClientRect().top + preview.scrollTop - 48;
              this.scrollPage(preview, offsetTarget);
            }
          }
        }
      }
    };

    scrollPage = (parent, offsetTarget) => {
        const offsetStart: number = parent.scrollTop;
        const step: number = Math.abs(offsetTarget - offsetStart) / 20;
        let clickPoint: number = offsetStart;
        const refeatTimer: number = window.setInterval(() => {
            clickPoint = offsetTarget > offsetStart ? (clickPoint + step) : (clickPoint - step);
            parent.scrollTop = clickPoint;
            const scrollNext: number = (step > 1) ? Math.abs(clickPoint - offsetTarget) + 1 : Math.abs(clickPoint - offsetTarget);
            if (scrollNext <= step) {
                clearInterval(refeatTimer);
                return;
            }
        }, 10);
    };

    loadMathJax = (notScrolling:boolean=false, setTextAlignJustify: boolean=false, isResetBodyStyles: boolean=false, maxWidth: string = '', scaleEquation = true):boolean => {
        try {
            const el = document.getElementById('SVG-styles');
            if (!el) {
              const MathJaxStyle: any = MathJax.Stylesheet();
              document.head.appendChild(MathJaxStyle);
            }

            const elStyle = document.getElementById('Mathpix-styles');
            if (!notScrolling) {
              window.addEventListener('click', this.handleClick, false);
            }
            if (!elStyle) {
                const style = document.createElement("style");
                style.setAttribute("id", "Mathpix-styles");
                let bodyStyles = isResetBodyStyles ? resetBodyStyles : '';
                style.innerHTML = bodyStyles 
                  + MathpixStyle(setTextAlignJustify, true, maxWidth, scaleEquation) 
                  + codeStyles 
                  + tabularStyles() 
                  + listsStyles 
                  + TocStyle("toc")
                  + menuStyle()
                  + clipboardCopyStyles()
                ;
                document.head.appendChild(style);
            }
            return true;
        } catch (e) {
            console.log('Error load MathJax =>', e.message);
            return false;
        }
    };

    convertToHTML = (str:string, options: TMarkdownItOptions = {}) => {
      try {
        const startTime = new Date().getTime();
        const  mathString =  this.isCheckFormula ? this.checkFormula(str, this.showTimeLog): str;
        options.lineNumbering = false;
        const html = this.markdownToHTML(mathString, options);
        const endTime = new Date().getTime();
        if (this.showTimeLog){
          console.log(`===> setText: ${endTime - startTime}ms`);
        }
        return html;
      } catch (err) {
        console.error(err);
        return '';
      }
    };

    getMathjaxStyle = () => {
      try {
        const MathJaxStyle: any = MathJax.Stylesheet();
        return MathJaxStyle.children[0] && MathJaxStyle.children[0].value
          ? MathJaxStyle.children[0].value
          : MathJaxStyle.innerHTML;
      } catch (e) {
        return '';
      }
    };

    getMathpixStyleOnly = (scaleEquation = true ) => {
      let style: string =  this.getMathjaxStyle() 
        + MathpixStyle(false, true, '', scaleEquation) 
        + codeStyles 
        + tabularStyles() 
        + listsStyles
        + menuStyle()
        + clipboardCopyStyles();
      return style;
    };

    getMathpixStyle = (stylePreview: boolean = false, showToc: boolean = false, tocContainerName: string = 'toc', scaleEquation = true, isPptx = false ) => {
      let style: string = ContainerStyle() + this.getMathjaxStyle() + MathpixStyle(false, true, '', scaleEquation, isPptx) + codeStyles + tabularStyles() + listsStyles;
      if (showToc) {}
      if (!stylePreview) {
        return style;
      }
      
      return showToc 
          ? style + PreviewStyle + TocStyle(tocContainerName) + menuStyle() + clipboardCopyStyles()
          : style + PreviewStyle + menuStyle() + clipboardCopyStyles();
    };

    getMathpixMarkdownStyles = ( useColors: boolean = true, scaleEquation = true ) => {
      let style: string = ContainerStyle(useColors);
      style += this.getMathjaxStyle();
      style += MathpixStyle(false, useColors, '', scaleEquation = true );
      // style += codeStyles;
      style += tabularStyles(useColors);
      style += listsStyles;
      return style;
    };

    getMathpixFontsStyle = () => {
      return fontsStyles
    };

    render = ( text: string, options?: optionsMathpixMarkdown ):string => {
        const { alignMathBlock='center', display='block', isCheckFormula=false, showTimeLog=false,
          isDisableFancy=false, isDisableEmoji=false, isDisableEmojiShortcuts=false, isDisableRefs=false, isDisableFootnotes=false,
          fontSize=null, padding=null, htmlTags=false, htmlDisableTagMatching = false, width=0, showToc = false,
          overflowY='unset', breaks = true, typographer = true, linkify = true, xhtmlOut = false,
          outMath = {}, mathJax = {}, htmlSanitize = {}, smiles = {}, openLinkInNewWindow = true,
          maxWidth='',
          enableFileLinks=false, validateLink = null,
          toc = {},
          accessibility = null,
          nonumbers = false,
          showPageBreaks = false,
          centerImages = true,
          centerTables = true,
          enableCodeBlockRuleForLatexCommands = false,
          addPositionsToTokens = false,
          highlights = [],
          parserErrors = ParserErrors.show,
          codeHighlight = {},
          footnotes = {},
          copyToClipboard = false,
          renderOptions = null,
          previewUuid = ''
        }
         = options || {};

        const disableRules = isDisableFancy ? this.disableFancyArrayDef : options ? options.disableRules || [] : [];

        if (showToc) {
          const index = disableRules.indexOf('toc');
          if (disableRules.indexOf('toc') === -1) {
            disableRules.splice(index, 1);
          }
        } else {
          disableRules.push('toc');
        }
        const disableRuleTypes: eMmdRuleType[] = renderOptions ? getDisableRuleTypes(renderOptions) : [];
        const markdownItOptions: TMarkdownItOptions = {
          isDisableFancy: isDisableFancy,
          isDisableEmoji: isDisableEmoji,
          isDisableEmojiShortcuts: isDisableEmojiShortcuts,
          isDisableRefs: isDisableRefs,
          isDisableFootnotes: isDisableFootnotes,
          disableRules: disableRules,
          htmlTags: htmlTags && !disableRuleTypes.includes(eMmdRuleType.html),
          htmlDisableTagMatching: htmlDisableTagMatching,
          xhtmlOut: xhtmlOut,
          breaks: breaks,
          typographer: typographer,
          linkify: linkify,
          width: width,
          outMath: outMath,
          mathJax: mathJax,
          htmlSanitize: htmlSanitize,
          smiles: smiles,
          openLinkInNewWindow: openLinkInNewWindow,
          maxWidth: maxWidth,
          enableFileLinks: enableFileLinks,
          validateLink: validateLink,
          toc: toc,
          accessibility: accessibility,
          nonumbers: nonumbers,
          showPageBreaks: showPageBreaks,
          centerImages: centerImages,
          centerTables: centerTables,
          enableCodeBlockRuleForLatexCommands: enableCodeBlockRuleForLatexCommands,
          addPositionsToTokens: addPositionsToTokens,
          highlights: highlights,
          parserErrors: parserErrors,
          codeHighlight: codeHighlight,
          footnotes: footnotes,
          copyToClipboard: copyToClipboard,
          renderOptions: renderOptions,
          previewUuid: previewUuid
        };

        const styleFontSize = fontSize ? ` font-size: ${options.fontSize}px;` : '';
        const stylePadding = padding ? ` padding-left: ${options.padding}px; padding-right: ${options.padding}px;` : '';
        const styleMaxWidth = maxWidth ? ` max-width: ${maxWidth};` : '';
        this.setOptions(disableRules, isCheckFormula, showTimeLog);
        return (
            `<div id='preview' style='justify-content:${alignMathBlock};overflow-y:${overflowY};will-change:transform;'>
                <div id='container-ruller'></div>
                <div id='setText' style='display: ${display}; justify-content: inherit;${styleFontSize}${stylePadding}${styleMaxWidth}' >
                    ${this.convertToHTML(text, markdownItOptions)}
                </div>
            </div>`
        );
    };

  mmdYamlToHTML = (mmd: string, options: TMarkdownItOptions = {}, isAddYamlToHtml = false) => {
    try {
      MathJax.Reset();
      const { isDisableFancy = false } = options;
      const disableRules = isDisableFancy ? this.disableFancyArrayDef : options ? options.disableRules || [] : [];
      this.setOptions(disableRules);

      const { metadata, content, error = ''} = yamlParser(mmd, isAddYamlToHtml);
      let html = this.render(content, options);
      if (html.indexOf('clickable-link') !== -1) {
        html = this.checkEquationNumber(html);
      }
      return {
        html: html,
        metadata: metadata,
        content: content,
        error: error
      }

    } catch (err) {
      console.log('ERROR => [mmdYamlToHTML] =>' + err);
      console.error(err);
      return null
    }
  }

  renderTitleMmd = (title: string, options: TMarkdownItOptions = {}, className = 'article-title', isOnlyInner = false): string => {
    try {
      if (!title) {
        return '';
      }
      const htmlTitle = this.markdownToHTML(`\\title{${title}}`, options);
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlTitle, "text/html");
      const elTitle = doc.body.firstChild as HTMLElement;
      if (isOnlyInner) {
        return elTitle.innerHTML;
      }
      elTitle.classList.add(className);
      return elTitle.outerHTML;
    } catch (err) {
      console.error(err);
      return ''
    }
  };

  renderAuthorsMmd = (authors: string, options: TMarkdownItOptions = {}, className = 'article-author', isOnlyInner = false) => {
    try {
      if (!authors) {
        return '';
      };

      const htmlAuthors = this.markdownToHTML(`\\author{${authors}}`, options);
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlAuthors, "text/html");
      const elAuthors = doc.body.firstChild as HTMLElement;
      if (isOnlyInner) {
        return elAuthors.innerHTML;
      }
      elAuthors.classList.add(className);
      return elAuthors.outerHTML;
    } catch (err) {
      console.error(err);
      return '';
    }
  }
}

export const MathpixMarkdownModel = new MathpixMarkdown_Model();

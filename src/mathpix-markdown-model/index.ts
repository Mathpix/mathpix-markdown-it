import {checkFormula} from './check-formula';
import {markdownToHTML as markdownHTML} from "../markdown";
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

export interface optionsMathpixMarkdown {
    alignMathBlock?: Property.TextAlign;
    display?: Property.Display;
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    isDisableFancy?: boolean;
    isDisableEmoji?: boolean;
    isDisableEmojiShortcuts?: boolean;
    disableRules?: string[];
    fontSize?: number;
    padding?: number;
    htmlTags?: boolean; // Enable HTML tags in source
    breaks?: boolean,
    typographer?: boolean,
    linkify?: boolean,
    enableFileLinks?: boolean,
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
    openLinkInNewWindow?: boolean;
    maxWidth?: string;
    toc?: TTocOptions;
    accessibility?: TAccessibility;
}

export type TMarkdownItOptions = {
  isDisableFancy?: boolean;
  isDisableEmoji?: boolean;
  isDisableEmojiShortcuts?: boolean;
  disableRules?: string[];
  htmlTags?: boolean,
  breaks?: boolean,
  typographer?: boolean,
  linkify?: boolean,
  enableFileLinks?: boolean,
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
  openLinkInNewWindow?: boolean;
  maxWidth?: string;
  htmlWrapper?: THtmlWrapper | boolean;
  toc?: TTocOptions;
  accessibility?: TAccessibility;
}

export type TOutputMath = {
  include_mathml?: boolean,
  include_mathml_word?: boolean,
  include_asciimath?: boolean,
  include_latex?: boolean,
  include_svg?: boolean,
  include_table_html?: boolean,
  include_tsv?: boolean,
  include_table_markdown?: boolean,
  include_smiles?: boolean,
  include_speech?: boolean,
  include_error?: boolean,
  tsv_separators?: {
    column?: string,
    row?: string,
  },
  table_markdown?: {
    math_as_ascii?: boolean
  },
  not_catch_errors?: boolean
}

export type TOutputMathJax = {
  mtextInheritFont?: boolean,
  asciiMath?: TAsciiMath
}

export type THtmlSanitize = {
  disallowedTagsMode?: string
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
  style?: TTocStyle
};

export enum TTocStyle {
  summary = 'summary',
  list = 'list'
};

export type TAccessibility = {
  assistiveMml?: boolean, //true to enable assitive MathML
  sre?: object
};

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

  markdownToHTML = (markdown: string, options: TMarkdownItOptions = {}):string => {
    const { lineNumbering = false, isDisableFancy = false,  htmlWrapper = false } = options;
    const disableRules = isDisableFancy ? this.disableFancyArrayDef : options ? options.disableRules || [] : [];
    this.setOptions(disableRules);
    let html = markdownHTML(markdown, options);
    if (!lineNumbering) {
      MathJax.Reset();
      if (html.indexOf('clickable-link') !== -1) {
        html = this.checkEquationNumber(html);
      }
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

  getTocContainerHTML = ( html: string ):string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const body = doc.body;
    const toc = body.getElementsByClassName('table-of-contents')[0];
    if (toc) {
      return toc.innerHTML;
    }else {
      return '';
    }
  };

  checkEquationNumber = (html: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const body = doc.body;
      const links = body.getElementsByClassName('clickable-link');
      for(let i = 0; i < links.length; i++) {
        const eq = links[i].getAttribute('value');
        const equationNumber = doc.getElementById(eq);
        if (!equationNumber) {
          links[i].innerHTML=`[${decodeURIComponent(eq)}]`;
        } else {
          const numbers = equationNumber.getAttribute('number');
          if(numbers) {
            links[i].innerHTML = `[${numbers.split(',')[0]}]`
          }
        }
      }
      return body.innerHTML;
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
                  + menuStyle();
                document.head.appendChild(style);
            }
            return true;
        } catch (e) {
            console.log('Error load MathJax =>', e.message);
            return false;
        }
    };

    convertToHTML = (str:string, options: TMarkdownItOptions = {}) => {
        const startTime = new Date().getTime();
        const  mathString =  this.isCheckFormula ? this.checkFormula(str, this.showTimeLog): str;
        options.lineNumbering = false;
        const html = this.markdownToHTML(mathString, options);
        const endTime = new Date().getTime();
        if(this.showTimeLog){
            console.log(`===> setText: ${endTime - startTime}ms`);
        }
        return html;
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
        + menuStyle();
      return style;
    };

    getMathpixStyle = (stylePreview: boolean = false, showToc: boolean = false, tocContainerName: string = 'toc', scaleEquation = true ) => {
      let style: string = ContainerStyle() + this.getMathjaxStyle() + MathpixStyle(false, true, '', scaleEquation) + codeStyles + tabularStyles() + listsStyles;
      if (showToc) {}
      if (!stylePreview) {
        return style;
      }
      
      return showToc 
          ? style + PreviewStyle + TocStyle(tocContainerName) + menuStyle()
          : style + PreviewStyle + menuStyle();
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
          isDisableFancy=false, isDisableEmoji=false, isDisableEmojiShortcuts=false, fontSize=null, padding=null, htmlTags=false, width=0, showToc = false,
          overflowY='unset', breaks = true, typographer = true, linkify = true, xhtmlOut = false,
          outMath = {}, mathJax = {}, htmlSanitize = {}, smiles = {}, openLinkInNewWindow = true,
          maxWidth='',
          enableFileLinks=false,
          toc = {},
          accessibility = null
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

        const markdownItOptions: TMarkdownItOptions = {
          isDisableFancy: isDisableFancy,
          isDisableEmoji: isDisableEmoji,
          isDisableEmojiShortcuts: isDisableEmojiShortcuts,
          disableRules: disableRules,
          htmlTags: htmlTags,
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
          toc: toc,
          accessibility: accessibility
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

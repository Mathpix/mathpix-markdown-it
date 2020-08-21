import {checkFormula} from './check-formula';
import {markdownToHTML as markdownHTML} from "../markdown";
import {MathpixStyle, PreviewStyle, ContainerStyle, codeStyles, TocStyle, resetBodyStyles} from "../mathjax/styles";
import { tabularStyles } from "../mathjax/styles-tabular";
import { fontsStyles } from "../mathjax/styles-fonts";
import { listsStyles } from "../mathjax/styles-lists";
import {MathJax} from '../mathjax';
import { Property } from 'csstype'; // at top of file

export interface optionsMathpixMarkdown {
    alignMathBlock?: Property.TextAlign;
    display?: Property.Display;
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    isDisableFancy?: boolean;
    disableRules?: string[];
    fontSize?: number;
    padding?: number;
    htmlTags?: boolean; // Enable HTML tags in source
    breaks?: boolean,
    typographer?: boolean,
    linkify?: boolean,
    xhtmlOut?: boolean,
    width?: number;
    showToc?: boolean;
    overflowY?: string; //default 'unset'
    outMath?: TOutputMath;
    mathJax?: TOutputMathJax;
    htmlSanitize?: THtmlSanitize;
}

export type TMarkdownItOptions = {
  isDisableFancy?: boolean;
  disableRules?: string[];
  htmlTags?: boolean,
  breaks?: boolean,
  typographer?: boolean,
  linkify?: boolean,
  xhtmlOut?: boolean,
  width?: number,
  lineNumbering?: boolean,
  renderElement?: {
    inLine?: boolean,
    startLine?: number,
    class?: string,
    preview?: any
  },
  outMath?: TOutputMath,
  mathJax?: TOutputMathJax,
  htmlSanitize?: THtmlSanitize;
}

export type TOutputMath = {
  include_mathml?: boolean,
  include_asciimath?: boolean,
  include_latex?: boolean,
  include_svg?: boolean,
  include_table_html?: boolean,
  include_tsv?: boolean,
  tsv_separators?: {
    column?: string,
    row?: string,
  },
  not_catch_errors?: boolean
}

export type TOutputMathJax = {
  mtextInheritFont?: boolean,
}

export type THtmlSanitize = {
  disallowedTagsMode?: 'recursiveEscape'
} | false;

const formatSourceHtml = (text: string, notTrim: boolean = false) => {
  text = notTrim ? text : text.trim();
  return text
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
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

  parseMarkdownByHTML = (html: string, include_sub_math: boolean = true) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return this.parseMarkdownByElement(doc, include_sub_math)
  };

  parseMarkdownByElement = (el: HTMLElement | Document, include_sub_math: boolean = true) => {
    const res = [];
    if (!el) return null;

    const math_el = include_sub_math
      ? el.querySelectorAll('.math-inline, .math-block, .table_tabular, .inline-tabular')
      : el.querySelectorAll('div > .math-inline, div > .math-block, .table_tabular, div > .inline-tabular');
    if (!math_el) return null;


    for (let i = 0; i < math_el.length; i++) {
      for (let j = 0; j < math_el[i].children.length; j++) {
        const child = math_el[i].children[j];
        if (["MATHML", "ASCIIMATH", "LATEX", "MJX-CONTAINER", "TABLE", "TSV"].indexOf(child.tagName) !== -1) {
          if (child.tagName==="MJX-CONTAINER" || child.tagName==="TABLE") {
            if (child.tagName === "TABLE") {
              res.push({type: "html", value: child.outerHTML});
            } else {
              res.push({type: "svg", value: child.innerHTML});
            }
          } else {
            res.push({
              type: child.tagName.toLowerCase(),
              value: child.tagName === 'LATEX' || child.tagName === 'ASCIIMATH' || child.tagName === 'TSV'
              ? formatSourceHtml(child.innerHTML, child.tagName === 'TSV')
              : child.innerHTML});
          }
        }
      }
    }
    return res;
  };

  markdownToHTML = (markdown: string, options: TMarkdownItOptions = {}):string => {
    const { lineNumbering = false, isDisableFancy = false } = options;
    const disableRules = isDisableFancy ? this.disableFancyArrayDef : options ? options.disableRules || [] : [];
    this.setOptions(disableRules);
    let html = markdownHTML(markdown, options);
    if (!lineNumbering) {
      MathJax.Reset();
      if (html.indexOf('clickable-link') !== -1) {
        html = this.checkEquationNumber(html);
      }
    }

    return html;
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

    loadMathJax = (notScrolling:boolean=false, setTextAlignJustify: boolean=true, isResetBodyStyles: boolean=false):boolean => {
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
                style.innerHTML = bodyStyles + MathpixStyle(setTextAlignJustify) + codeStyles + tabularStyles + listsStyles;
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

    getMathpixStyleOnly = () => {
      let style: string =  this.getMathjaxStyle() + MathpixStyle(false) + codeStyles + tabularStyles + listsStyles;
      return style;
    };

    getMathpixStyle = (stylePreview: boolean = false, showToc: boolean = false, tocContainerName: string = 'toc') => {
      let style: string = ContainerStyle + this.getMathjaxStyle() + MathpixStyle(stylePreview) + codeStyles + tabularStyles + listsStyles;
      if (showToc) {}
      return stylePreview
        ? showToc ? style + PreviewStyle + TocStyle(tocContainerName) : style + PreviewStyle
        : style;
    };

    getMathpixFontsStyle = () => {
      return fontsStyles
    };

    render = ( text: string, options?: optionsMathpixMarkdown ):string => {
        const { alignMathBlock='center', display='block', isCheckFormula=false, showTimeLog=false,
          isDisableFancy=false, fontSize=null, padding=null, htmlTags=false, width=0, showToc = false,
          overflowY='unset', breaks = true, typographer = true, linkify = true, xhtmlOut = false,
          outMath = {}, mathJax = {}, htmlSanitize = {}}
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
          disableRules: disableRules,
          htmlTags: htmlTags,
          xhtmlOut: xhtmlOut,
          breaks: breaks,
          typographer: typographer,
          linkify: linkify,
          width: width,
          outMath: outMath,
          mathJax: mathJax,
          htmlSanitize: htmlSanitize
        };

        const styleFontSize = fontSize ? ` font-size: ${options.fontSize}px;` : '';
        const stylePadding = padding ? ` padding-left: ${options.padding}px; padding-right: ${options.padding}px;` : '';
        this.setOptions(disableRules, isCheckFormula, showTimeLog);
        return (
            `<div id='preview' style='justify-content:${alignMathBlock};overflow-y:${overflowY};will-change:transform;'>
                <div id='container-ruller'></div>
                <div id='setText' style='display: ${display}; justify-content: inherit;${styleFontSize}${stylePadding}' >
                    ${this.convertToHTML(text, markdownItOptions)}
                </div>
            </div>`
        );
    };
}

export const MathpixMarkdownModel = new MathpixMarkdown_Model();

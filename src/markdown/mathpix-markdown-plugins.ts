import { MarkdownIt } from 'markdown-it';
import { MathpixMarkdownModel, ParserErrors } from "../mathpix-markdown-model";
import { resetTextCounter } from './mdPluginText';
import { resetTheoremEnvironments } from './md-theorem/helper';
import { rest_mmd_footnotes_list } from './md-latex-footnotes/utils';

import {
  mdPluginMathJax,
  mdPluginHighlightCode,
  mdPluginText,
  mdPluginTOC,
  mdPluginAnchor,
  mdPluginTableTabular,
  mdPluginList,
  mdPluginChemistry,
  mdPluginSvgToBase64, 
  mdLatexFootnotes

} from "./mdPluginConfigured";
import { validateLinkEnableFile } from "./mdOptions";
import { injectLabelIdToParagraph } from "./rules";
import { eMmdRuleType } from "./common/mmdRules";
import { getDisableRuleTypes } from "./common/mmdRulesToDisable";

export const mathpixMarkdownPlugin = (md: MarkdownIt, options) => {
  const {width = 1200,  outMath = {}, smiles = {}, mathJax = {}, renderElement = {}, forDocx = false, forLatex = false, forMD = false,
    maxWidth = '',
    enableFileLinks = false, validateLink = null,
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
    previewUuid = "",
    enableSizeCalculation = false
  } = options;
  Object.assign(md.options, smiles);
  Object.assign(md.options, {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    forDocx: forDocx,
    forLatex: forLatex,
    forMD: forMD,
    maxWidth: maxWidth,
    enableFileLinks: enableFileLinks,
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
    previewUuid: previewUuid,
    enableSizeCalculation: enableSizeCalculation
  });

  md
    .use(mdPluginChemistry, smiles)
    .use(mdPluginTableTabular)
    .use(mdPluginList)
    .use(mdPluginMathJax({}))
    .use(mdPluginText())
    .use(mdLatexFootnotes)
    .use(mdPluginHighlightCode, codeHighlight)
    .use(mdPluginAnchor)
    .use(mdPluginTOC, {toc: toc});

  if ( forDocx ) {
    md.use(mdPluginSvgToBase64);
  }

  if (enableFileLinks || validateLink) {
    md.validateLink = validateLink 
      ? validateLink 
      : validateLinkEnableFile;
  }
  /**
   * ParserBlock.parse(str, md, env, outTokens)
   *
   * Process input string and push block tokens into `outTokens`
   **/
  if (addPositionsToTokens || md.options.highlights?.length) {
    md.block.parse = function (src, md, env, outTokens) {
      var state;
      if (!src) { return; }
      state = new this.State(src, md, env, outTokens);
      if (!env.lines) {
        /** Copy block state lines */
        env.lines = {
          bMarks: [...state.bMarks],
          eMarks: [...state.eMarks],
          line: [...state.line],
          lineMax: [...state.lineMax],
          sCount: [...state.sCount],
          tShift: [...state.tShift],
        }
      }
      this.tokenize(state, state.line, state.lineMax);
    };
    
    // Generate tokens for input range
    md.inline.tokenize = function (state) {
      var ok, i,
        rules = this.ruler.getRules(''),
        len = rules.length,
        end = state.posMax,
        maxNesting = state.md.options.maxNesting;
      while (state.pos < end) {
        // Try all possible rules.
        // On success, rule should:
        //
        // - update `state.pos`
        // - update `state.tokens`
        // - return true

        if (state.level < maxNesting) {
          for (i = 0; i < len; i++) {
            ok = rules[i](state, false);
            if (ok) {
              if (!state.pending && state.tokens?.length) {
                let token = state.tokens[state.tokens.length - 1];
                token.nextPos = state.pos;
              }
              break; 
            }
          }
        }

        if (ok) {
          if (state.pos >= end) { break; }
          continue;
        }

        state.pending += state.src[state.pos++];
      }

      if (state.pending) {
        state.pushPending();
      }
    };
    
    
    /**
     * ParserInline.parse(str, md, env, outTokens)
     *
     * Process input string and push inline tokens into `outTokens`
     **/
    md.inline.parse = function (str, md, env, outTokens) {
      var i, rules, len;
      var state = new this.State(str, md, env, outTokens);
      
      state.pushPending = () => {
        var token = new state.Token('text', '', 0);
        token.content = state.pending;
        token.level = state.pendingLevel;
        token.nextPos = state.isPendingBeforeLink ? state.pos - 1 : state.pos;
        state.tokens.push(token);
        state.pending = '';
        return token;
      };
      
      state.push = function (type, tag, nesting) {
        if (state.pending) {
          if (type === 'link_open' || type === 'sup_open' || type === 'sub_open') {
            state.isPendingBeforeLink = true;
            this.pushPending();
            state.isPendingBeforeLink = false;
          } else {
            this.pushPending();
          }
        }

        var token = new state.Token(type, tag, nesting);

        if (nesting < 0) state.level--; // closing tag
        token.level = state.level;
        if (nesting > 0) state.level++; // opening tag
        
        state.pendingLevel = state.level;
        state.tokens.push(token);
        return token;
      };
      
      this.tokenize(state);

      rules = this.ruler2.getRules('');
      len = rules.length;

      for (i = 0; i < len; i++) {
        rules[i](state);
      }
    };
  }

  injectLabelIdToParagraph(md);
};

export const setBaseOptionsMd = (baseOption, mmdOptions) => {
  const {
    htmlTags = false, xhtmlOut = false, breaks = true, typographer = true, linkify = true, openLinkInNewWindow = true
  } = mmdOptions;
  const disableRuleTypes: eMmdRuleType[] = mmdOptions?.renderOptions ? getDisableRuleTypes(mmdOptions.renderOptions) : [];
  baseOption.html = htmlTags && !disableRuleTypes.includes(eMmdRuleType.html);
  baseOption.xhtmlOut = xhtmlOut;
  baseOption.breaks = breaks;
  baseOption.langPrefix = "language-";
  baseOption.linkify = linkify;
  baseOption.typographer = typographer;
  baseOption.quotes = "“”‘’";
  baseOption.openLinkInNewWindow = openLinkInNewWindow;
};

const setOptionForPreview = (mdOption, mmdOptions) => {
  const { width = 1200,  outMath = {}, smiles = {}, mathJax = {}, renderElement = {} } = mmdOptions;

  Object.assign(mdOption, smiles);
  Object.assign(mdOption, {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement
  });

  setBaseOptionsMd(mdOption, mmdOptions);
};

export const initMathpixMarkdown = (md, callback) => {
  const { parse, renderer } = md;
  const { render } = renderer;

  md.parse = (markdown, env) => {
    resetTheoremEnvironments();
    rest_mmd_footnotes_list();
    const mmdOptions = callback();
    setOptionForPreview(md.options, mmdOptions);
    return parse.call(md, markdown, env)
  };

  renderer.render = (tokens, options, env) => {
    MathpixMarkdownModel.texReset();
    resetTextCounter();

    let html = render.call(renderer, tokens, options, env);

    const style = MathpixMarkdownModel.getMathpixMarkdownStyles(false);

    let resHtml: string = `<style id="mmd-vscode-style">${style}</style>`;
    resHtml += '\n';
    resHtml += `<div id="preview-content">${html}</div>`;
    return resHtml;
  };
  return md;
};

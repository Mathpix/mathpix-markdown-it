import type Token from 'markdown-it/lib/token';
import type Renderer from "markdown-it/lib/renderer";
import type MarkdownIt from "markdown-it";
import { PREVIEW_LINE_CLASS, PREVIEW_PARAGRAPH_PREFIX } from "../rules";
import { GetItemizeLevelTokens, GetEnumerateLevel, GetItemizeLevel } from "./re-level";
import { renderTabularInline } from "../md-renderer-rules/render-tabular";
import { needToHighlightAll, highlightText } from "../highlight/common";
import convertSvgToBase64 from "../md-svg-to-base64/convert-scv-to-base64";
import { mathTokenTypes } from "../common/consts";
import { isMathInText } from "../utils";
import {CustomMarkerHtmlResult} from "./latex-list-types";

var level_itemize = 0;
var level_enumerate = 0;
type ListState = {
  enumerateCounters: number[]; // index = level-1
};
const listState: ListState = {
  enumerateCounters: [],
};

type MarkerInfo = {
  htmlMarker: string;
  dataAttr: string;
};

type ListItemRenderMode = 'open' | 'full';

/**
 * Resets enumerate counters at the given nesting level.
 * Ensures the counters array is large enough, truncates deeper levels,
 * and sets the counter for `level` to zero (start of a new list at that level).
 *
 * @param level - Enumerate nesting level (1-based).
 */
const resetEnumerateCountersFromLevel = (level: number): void => {
  const safeLevel: number = Math.max(1, level);
  const counters: number[] = listState.enumerateCounters;
  while (counters.length < safeLevel) {
    counters.push(0);
  }
  // Drop counters for deeper levels when a new list starts at this level.
  counters.length = safeLevel;
  counters[safeLevel - 1] = 0;
};

/**
 * Increments and returns the next enumerate index for the given nesting level.
 * Ensures the counters array is large enough and truncates deeper levels
 * (so returning to a higher level resets deeper numbering).
 *
 * @param level - Enumerate nesting level (1-based).
 * @returns The next 1-based item index for this enumerate level.
 */
const nextEnumerateIndex = (level: number): number => {
  const safeLevel: number = Math.max(1, level);
  const counters: number[] = listState.enumerateCounters;
  while (counters.length < safeLevel) {
    counters.push(0);
  }
  // Drop deeper levels when we emit an item at this level.
  counters.length = safeLevel;
  counters[safeLevel - 1] = (counters[safeLevel - 1] ?? 0) + 1;
  return counters[safeLevel - 1];
};

/**
 * Clears all enumerate counters for all nesting levels.
 * Useful when starting a fresh top-level enumerate list.
 */
const resetAllEnumerateCounters = (): void => {
  listState.enumerateCounters.length = 0;
};

const list_injectLineNumbers = (tokens, idx, className = '') => {
  let line, endLine, listLine;
  if (tokens[idx].map) {
    line = tokens[idx].map[0];
    endLine = tokens[idx].map[1];
    listLine = [];
    for (let i = line; i < endLine; i++) {
      listLine.push(i);
    }
    tokens[idx].attrJoin("class", className + ' ' + PREVIEW_PARAGRAPH_PREFIX + String(line)
      + ' ' + PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
    tokens[idx].attrJoin("data_line_start", `${String(line)}`);
    tokens[idx].attrJoin("data_line_end", `${String(endLine-1)}`);
    tokens[idx].attrJoin("data_line", `${String([line, endLine])}`);
    tokens[idx].attrJoin("count_line", `${String(endLine-line)}`);
    if (tokens[idx].hasOwnProperty('parentStart')) {
      tokens[idx].attrJoin("data_parent_line_start", `${String(tokens[idx].parentStart)}`);
    }

  } else {
    tokens[idx].attrJoin("class", className );
  }
};

/**
 * Renderer for opening an itemize list (`itemize_list_open`).
 *
 * Responsibilities:
 *  - Tracks nested itemize depth with `level_itemize`.
 *  - Adds a base "itemize" class and optional line-numbering attributes.
 *  - For DOCX output (`options.forDocx`), computes custom bullet metadata
 *    (`data-custom-marker-type`, `data-custom-marker-content`) based on
 *    precomputed `itemizeLevel` and `itemizeLevelContents`.
 *  - Emits:
 *      - `<ul ... style="list-style-type: none">` for nested lists,
 *      - optionally wraps nested `<ul>` in `<li>` when a list is directly
 *        nested under another `itemize_list_open`.
 *  - For top-level lists, respects `data-padding-inline-start` attribute
 *    (translating it into inline CSS `padding-inline-start`).
 */
export const render_itemize_list_open: Renderer.RenderRule = (
  tokens: Token[],
  idx: number,
  options,
  env,
  slf: Renderer
): string => {
  const token: Token = tokens[idx];
  // Reset nesting level for top-level lists
  const prevToken: Token | undefined = tokens[idx - 1];
  level_itemize++;
  let dataAttr = "";
  const className = "itemize";
  // Attach line-numbering or basic class
  if (options?.lineNumbering) {
    list_injectLineNumbers(tokens, idx, className);
  } else {
    token.attrJoin("class", className);
  }
  // Translate data-padding-inline-start into inline style for top-level lists
  const paddingInlineAttr = token.attrGet("data-padding-inline-start");
  const paddingInlineStyle: string = paddingInlineAttr
    ? `padding-inline-start: ${paddingInlineAttr}px; `
    : "";
  // DOCX-specific: compute custom bullet metadata
  if (options.forDocx) {
    const itemizeLevelTokens: Token[][] = GetItemizeLevelTokens(token.itemizeLevel);
    if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
      let itemizeLevelContents: string[] = GetItemizeLevel(token.itemizeLevelContents);
      if (itemizeLevelContents.length >= level_itemize) {
        const levelIndex: number = level_itemize - 1;
        let markerInfo = isTextMarkerTokens(itemizeLevelTokens[levelIndex], slf, options, env);
        dataAttr += ` data-custom-marker-type="${markerInfo.markerType}"`;
        if (markerInfo.markerType === 'text') {
          dataAttr += ` data-custom-marker-content="${encodeURI(markerInfo.textContent)}"`;
        } else {
          dataAttr += ` data-custom-marker-content="${encodeURI(itemizeLevelContents[levelIndex])}"`;
        }
      }
    }
  }
  const attrs: string = slf.renderAttrs(token) + dataAttr;
  const style: string = level_itemize > 1
    ? 'list-style-type: none'
    : `${paddingInlineStyle}list-style-type: none`;
  const ulOpen: string = `<ul${attrs} style="${style}">`;
  if (prevToken?.type === 'itemize_list_open') {
    return `<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">${ulOpen}`;
  }
  if (prevToken?.type === 'enumerate_list_open') {
    return `<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">${ulOpen}`;
  }
  return ulOpen;
};

/**
 * Renderer for opening an enumerate list (`enumerate_list_open`).
 *
 * Responsibilities:
 *  - Tracks nested enumerate depth via `level_enumerate`.
 *  - Resolves the current list-style type (e.g. `decimal`, `lower-alpha`)
 *    from `token.enumerateLevel` with a fallback to `"decimal"`.
 *  - Adds CSS class `enumerate <style>` (e.g. `enumerate decimal`).
 *  - Injects line-numbering attributes when `options.lineNumbering` is enabled.
 *  - For DOCX (`options.forDocx`), adds `data-list-style-type="<style>"`.
 *  - For top-level lists, respects `data-padding-inline-start` attribute
 *    and converts it into inline `padding-inline-start` CSS.
 */
export const render_enumerate_list_open: Renderer.RenderRule = (
  tokens: Token[],
  idx: number,
  options,
  env,
  slf: Renderer
): string => {
  const token: Token = tokens[idx];
  // Reset nesting level for top-level enumerate lists
  if (token.level === 0) {
    level_enumerate = 0;
    resetAllEnumerateCounters();
  }
  const prevToken: Token | undefined = tokens[idx - 1];
  level_enumerate++;
  resetEnumerateCountersFromLevel(level_enumerate);
  let dataAttr = '';
  // Determine current enumerate style (e.g. decimal, lower-alpha, ...)
  const enumerateLevels: string[] = GetEnumerateLevel((token as any).enumerateLevel);
  const currentStyle: string =
    enumerateLevels.length >= level_enumerate
      ? enumerateLevels[level_enumerate - 1]
      : "decimal";
  const className: string = `enumerate ${currentStyle}`;
  // Line numbering or basic class
  if (options?.lineNumbering) {
    list_injectLineNumbers(tokens, idx, className);
  } else {
    token.attrJoin("class", className);
  }
  // Map data-padding-inline-start → inline CSS for top-level lists
  const paddingInlineAttr = token.attrGet("data-padding-inline-start");
  const paddingInlineStyle = paddingInlineAttr
    ? `padding-inline-start: ${paddingInlineAttr}px; `
    : "";
  // DOCX: pass style type to consumer
  if (options.forDocx) {
    dataAttr = ` data-list-style-type="${currentStyle}"`
  }
  const attrs: string = slf.renderAttrs(token) + dataAttr;
  const style = level_enumerate > 1
    ? `list-style-type: ${currentStyle}`
    : `${paddingInlineStyle}list-style-type: ${currentStyle}`;
  const olOpen: string = `<ol${attrs} style="${style}">`;
  if (prevToken?.type === 'itemize_list_open') {
    return `<li class="li_itemize" data-custom-marker="true" data-marker-empty="true">${olOpen}`;
  }
  if (prevToken?.type === 'enumerate_list_open') {
    return `<li class="li_enumerate not_number" data-custom-marker="true" data-marker-empty="true" style="display: block">${olOpen}`;
  }
  return olOpen;
};

const generateHtmlForMarkerTokens = (markerTokens, slf, options, env): {htmlMarker: string, markerType: string, textContent: string} => {
  let htmlMarker = '';
  let markerType = 'text';
  let textContent = '';
  if (markerTokens.length === 1 && mathTokenTypes.includes(markerTokens[0].type)) {
    markerType = 'math';
    if (markerTokens[0].mathEquation) {
      try {
        let svg = '';
        let svgStart = markerTokens[0].mathEquation.indexOf('<svg');
        let svgEnd = markerTokens[0].mathEquation.indexOf('</mjx-container>');
        svg = svgStart >= 0 && svgEnd > 0 ? markerTokens[0].mathEquation.slice(svgStart, svgEnd) : '';
        let resSvg = convertSvgToBase64(svg);
        htmlMarker += resSvg;
      } catch (e) {
        htmlMarker += markerTokens[0].mathEquation
      }
    } else {
      htmlMarker += slf.renderInline([markerTokens[0]], options, env);
    }
    return {
      htmlMarker: htmlMarker,
      markerType: markerType,
      textContent: ''
    };
  }
  for (let j = 0; j < markerTokens.length; j++) {
    if (markerTokens[j].type !== 'text') {
      markerType = 'multi';
    }
    if (markerTokens[j].mathEquation) {
      try {
        let svg = '';
        let svgStart = markerTokens[j].mathEquation.indexOf('<svg');
        let svgEnd = markerTokens[j].mathEquation.indexOf('</mjx-container>');
        svg = svgStart >= 0 && svgEnd > 0 ? markerTokens[j].mathEquation.slice(svgStart, svgEnd) : '';
        let resSvg = convertSvgToBase64(svg);
        htmlMarker += resSvg;
      } catch (e) {
        htmlMarker += markerTokens[j].mathEquation
      }
      continue;
    }
    let renderdToken = slf.renderInline([markerTokens[j]], options, env);
    if (markerType === 'text') {
      textContent += renderdToken
    } else {
      textContent = '';
    }
    htmlMarker += renderdToken
  }
  return {
    htmlMarker: htmlMarker,
    markerType: markerType,
    textContent: textContent
  };
};

const isTextMarkerTokens = (markerTokens, slf, options, env): {markerType: string, textContent: string} => {
  let markerType = 'text';
  if (markerTokens.length === 1 && mathTokenTypes.includes(markerTokens[0].type)) {
    markerType = 'math';
    return {
      markerType: markerType,
      textContent: ''
    };
  }
  let textContent = '';
  for (let j = 0; j < markerTokens.length; j++) {
    if (markerTokens[j].type !== 'text') {
      markerType = 'multi';
      break
    }
    textContent += slf.renderInline([markerTokens[j]], options, env);
  }
  return {
    markerType: markerType,
    textContent: textContent
  };
};

/**
 * Builds HTML for a custom \item[...] marker and reports whether the marker is empty.
 * "Empty" means: marker is present but contains only whitespace / no visible content.
 */
const generateHtmlForCustomMarker = (
  token: Token,
  options,
  slf: Renderer,
  env
): CustomMarkerHtmlResult => {
  const rawMarker: string | undefined = (token as any).marker;
  const markerTokens: Token[] = (token as any).markerTokens ?? [];
  // Marker is considered "present" only if \item[...] was used.
  const markerProvided: boolean = Object.prototype.hasOwnProperty.call(token, "marker");
  // Fast path: if we have raw marker string, use it to detect empty marker reliably.
  const hasNonEmptyMarker: boolean = markerProvided
    ? Boolean(rawMarker && rawMarker.trim().length > 0)
    : false;
  if (!markerProvided) {
    return { htmlMarker: "", markerType: "text", textContent: "", isMarkerEmpty: false };
  }
  if (options.forDocx) {
    const data = generateHtmlForMarkerTokens(markerTokens, slf, options, env);
    // Fallback empty check: if raw marker is missing, use extracted textContent
    const isEmpty = rawMarker != null
      ? rawMarker.trim().length === 0
      : (data.textContent ?? "").trim().length === 0;
    return {
      htmlMarker: data.htmlMarker ?? "",
      markerType: data.markerType ?? "text",
      textContent: data.textContent ?? "",
      isMarkerEmpty: isEmpty,
    };
  }
  // Non-DOCX path: render inline marker tokens if marker is non-empty.
  const htmlMarker = hasNonEmptyMarker
    ? slf.renderInline(markerTokens, options, env)
    : "";
  return {
    htmlMarker,
    markerType: "text",
    textContent: "",
    isMarkerEmpty: !hasNonEmptyMarker,
  };
};

/**
 * Builds HTML marker information for list items that define a custom marker.
 *
 * Extracts the rendered marker (HTML) and assembles the corresponding
 * `data-*` attributes used for HTML and DOCX export.
 */
const buildCustomMarkerInfo = (token, options, slf, env): MarkerInfo => {
  let dataAttrs: string[] = ['data-custom-marker="true"'];
  const data: CustomMarkerHtmlResult = generateHtmlForCustomMarker(token, options, slf, env);
  if (data?.isMarkerEmpty) {
    dataAttrs.push('data-marker-empty="true"');
  }
  let htmlMarker = data.htmlMarker;
  if (options.forDocx) {
    dataAttrs.push(`data-custom-marker-type="${data.markerType}"`);
    const content = data.markerType === 'text'
      ? data.textContent
      : token.marker;
    dataAttrs.push(`data-custom-marker-content="${encodeURI(content)}"`);
  }
  const dataAttr: string = dataAttrs.length ? ' ' + dataAttrs.join(' ') : '';
  return { htmlMarker, dataAttr };
}

/**
 * Builds marker information for LaTeX-style itemize list items.
 *
 * If the token defines a custom marker, delegates to `buildCustomMarkerInfo`.
 * Otherwise, derives the marker from the itemize level tokens and, when
 * exporting to DOCX, attaches appropriate `data-*` attributes (including
 * math markers and their raw LaTeX content).
 */
const buildItemizeMarkerInfo = (token, options, env, slf, level_itemize: number): MarkerInfo => {
  const itemizeLevelTokens = GetItemizeLevelTokens(token.itemizeLevel);
  let dataAttr: string = '';
  let htmlMarker: string = '·';
  if (token.hasOwnProperty('marker') && token.markerTokens) {
    return buildCustomMarkerInfo(token, options, slf, env);
  }
  if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
    if (options.forDocx) {
      const data = generateHtmlForMarkerTokens(itemizeLevelTokens[level_itemize - 1], slf, options, env);
      htmlMarker = data.htmlMarker;
      if (data.markerType === 'math') {
        const itemizeLevel = GetItemizeLevel(token.itemizeLevelContents);
        if (itemizeLevel.length >= level_itemize) {
          dataAttr += ` data-custom-marker-content="${encodeURI(itemizeLevel[level_itemize - 1])}"`;
        }
        dataAttr += ' data-custom-marker="true"';
        dataAttr += ` data-custom-marker-type="${data.markerType}"`;
      }
    } else {
      htmlMarker = slf.renderInline(itemizeLevelTokens[level_itemize - 1], options, env);
    }
  }
  return { htmlMarker, dataAttr };
}

/**
 * Core renderer for LaTeX list items (both `enumerate` and `itemize`).
 *
 * Responsibilities:
 *  - Decide whether the current <li> belongs to LaTeX list context
 *    (`parentType` is "itemize" or "enumerate") or is just a plain HTML list.
 *  - Build the correct <li> markup for:
 *      - numbered lists (`enumerate`) with optional custom markers;
 *      - bulleted lists (`itemize`) with level-dependent markers;
 *  - Inject line-numbering classes when `options.lineNumbering` is enabled;
 *  - Add a leading non-breaking space for PPTX when the item begins
 *    with a math-only inline token;
 *  - Support two modes:
 *      - "open" — return only the opening part (no content, no closing </li>);
 *      - "full" — return opening tag, `content`, and closing </li>.
 */
const renderLatexListItemCore = (
  tokens: Token[],
  index: number,
  options,
  env,
  slf: Renderer,
  sContent: string | null,
  mode: ListItemRenderMode
): string => {
  const token: Token = tokens[index];
  const isOpen = mode === "open";
  const content: string = sContent ?? "";
  // Helper: should we insert an extra &nbsp; at the start for PPTX/math-only items?
  const needsPptxLeadingSpace = (): boolean => {
    if (!options?.forPptx) return false;
    const next = tokens[index + 1];
    if (next?.type !== "inline" || !next.children?.length) return false;
    const firstChild = next.children[0];
    return ["equation_math", "equation_math_not_number", "display_math"].includes(
      firstChild.type
    );
  };
  // Not in LaTeX list context at all → render a normal <li>
  if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
    return isOpen ? "<li>" : `<li>${content}</li>`;
  }
  const isEnumerate: boolean = token.parentType === "enumerate";
  let dataAttr: string = "";
  let htmlMarker: string = "";

  // ENUMERATE
  if (isEnumerate) {
    const hasCustomMarker = token.hasOwnProperty('marker') && token.markerTokens;
    const enumerateLevel: number = Math.max(1, token.meta?.enumerateLevel ?? level_enumerate ?? 1);
    const enumerateIndex: number = nextEnumerateIndex(enumerateLevel);
    token.meta = { ...(token.meta ?? {}), enumerateLevel, enumerateIndex };
    // Case 1: custom marker (e.g. \item[foo])
    if (hasCustomMarker) {
      const className = 'li_enumerate not_number';
      if (options?.lineNumbering) {
        // line numbers
        list_injectLineNumbers(tokens, index, className);
      } else {
        tokens[index].attrJoin("class", className);
      }
      const markerInfo: MarkerInfo = buildCustomMarkerInfo(token, options, slf, env);
      dataAttr += markerInfo.dataAttr;
      htmlMarker = markerInfo.htmlMarker;
      const prefix: string = `<li${slf.renderAttrs(token)}${dataAttr} style="display: block">` +
        `<span class="li_level"${dataAttr}>${htmlMarker}</span>`;
      if (isOpen) {
        return prefix;
      }
      return `${prefix}${sContent}</li>`;
    }
    // Case 2: regular numbered enumerate element
    const className = token.meta?.isBlock
      ? 'li_enumerate block'
      : 'li_enumerate';
    if (options?.lineNumbering) {
      list_injectLineNumbers(tokens, index, className);
    } else {
      tokens[index].attrJoin("class", className);
    }
    const prefix = `<li${slf.renderAttrs(token)}>`;
    if (isOpen) {
      if (needsPptxLeadingSpace()) {
        return prefix + "<span>&nbsp;</span>";
      }
      return prefix;
    }
    return `${prefix}${sContent}</li>`;
  }
  // ITEMIZE
  const itemizeInfo: MarkerInfo = buildItemizeMarkerInfo(token, options, env, slf, level_itemize);
  token.meta = {...(token.meta ?? {}), itemizeLevel: level_itemize};
  htmlMarker = itemizeInfo.htmlMarker;
  dataAttr += itemizeInfo.dataAttr || "";
  const className = token.meta?.isBlock
    ? 'li_itemize block'
    : 'li_itemize';
  if (options?.lineNumbering) {
    list_injectLineNumbers(tokens, index, className);
  } else {
    tokens[index].attrJoin("class", className);
  }
  const prefix =
    `<li${slf.renderAttrs(token)}${dataAttr}>` +
    `<span class="li_level"${dataAttr}>${htmlMarker}</span>`;
  if (isOpen) {
    if (needsPptxLeadingSpace()) {
      return prefix + "<span>&nbsp;</span>";
    }
    return prefix;
  }
  return `${prefix}${sContent}</li>`;
}

/**
 * Renders the content of a LaTeX list item (`latex_list_item_open`).
 *
 * Responsibilities:
 *  - Renders child tokens (including nested inline/tabular content).
 *  - Marks math fragments with `data-math-in-text` when needed.
 *  - Applies highlight wrappers when `token.highlights` is present.
 *  - Adds a dummy `&nbsp;` for empty list items (to keep bullet visible).
 *  - Delegates final <li> markup to `renderLatexListItemCore`
 *    for plain / nested list cases.
 */
export const render_item_inline: Renderer.RenderRule = (
  tokens: Token[],
  idx: number,
  options: MarkdownIt.Options,
  env,
  slf: Renderer
): string => {
  const token: Token = tokens[idx];

  let renderedContent: string = '';
  const children: Token[] | null = token.children ?? null;
  if (children && children.length > 0) {
    let content: string = "";
    for (let i = 0; i < children.length; i++) {
      const childToken: Token = children[i];
      if (childToken?.children?.length > 0) {
        // Nested inline content or special inline structures
        if (childToken.type === "tabular_inline") {
          content = renderTabularInline(token.children, childToken, options, env, slf)
        } else {
          content = slf.renderInline(childToken.children, options, env);
        }
      } else {
        if (isMathInText(token.children, i, options)) {
          childToken.attrSet('data-math-in-text', "true");
        }
        content = slf.renderInline([childToken], options, env);
        // For PPTX we prepend a non-breaking space before math-only first item
        if (options?.forPptx
          && i === 0
          && ['equation_math', 'equation_math_not_number', 'display_math'].includes(childToken.type)) {
          content = '<span>&nbsp</span>' + content;
        }
      }
      renderedContent += content
    }
  }

  // Apply highlighting if requested
  if (token.highlights?.length && needToHighlightAll(token)) {
    renderedContent = highlightText(token, renderedContent);
  }
  // If this <li> is not inside LaTeX itemize/enumerate → render simple <li>
  if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
    return `<li>${renderedContent}</li>`;
  }
  // Keep bullet visible for empty list items
  if (!renderedContent) {
    renderedContent = '&nbsp';
  }
  let nextToken: Token | undefined = tokens[idx+1];
  if (nextToken?.type === 'itemize_list_open') {
    return renderLatexListItemCore(tokens, idx, options, env, slf, renderedContent, 'open');
  }
  return renderLatexListItemCore(tokens, idx, options, env, slf, renderedContent, 'full');
};

export const render_latex_list_item_open: Renderer.RenderRule = (
  tokens: Token[],
  idx: number,
  options = {},
  env = {},
  slf: Renderer
): string => {
  return renderLatexListItemCore(tokens, idx, options, env, slf, null, 'open');
};

export const render_latex_list_item_close: Renderer.RenderRule = (): string => {
  return `</li>`;
};

/**
 * Renderer for closing an itemize list (`itemize_list_close`).
 *
 * Decreases nested itemize depth and, when another `itemize_list_close`
 * follows immediately and we are still in nested context, outputs
 * `</ul></li>` to close both the nested list and its `<li>`.
 */
export const render_itemize_list_close: Renderer.RenderRule = (
  tokens: Token[],
  idx: number,
  options = {},
  env = {},
  slf: Renderer
): string => {
  level_itemize--;
  const nextToken: Token | undefined = tokens[idx + 1];
  if ((level_itemize > 0 || level_enumerate > 0)
    && nextToken?.type
    && ["enumerate_list_close", "itemize_list_close"].includes(nextToken.type)
  ) {
    return "</ul></li>";
  }
  return "</ul>";
};

export const render_enumerate_list_close: Renderer.RenderRule  = (
  tokens: Token[],
  idx: number,
  options = {},
  env = {},
  slf: Renderer
): string => {
  level_enumerate--;
  const nextToken: Token | undefined = tokens[idx + 1];
  if ((level_itemize > 0 || level_enumerate > 0)
    && nextToken?.type
    && ["enumerate_list_close", "itemize_list_close"].includes(nextToken.type)
  ) {
    return "</ol></li>";
  }
  return `</ol>`;
};

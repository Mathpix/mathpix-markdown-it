import { Renderer, Token } from 'markdown-it';
const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
import { TEXTWIDTH_RE } from '../common/consts';

export const CaptionTable: Renderer = (tokens, idx, options, env, slf) => {
  let token = tokens[idx];
  const className = token.attrGet('class') || 'caption_table';
  const printText = token.print ?? '';
  let htmlCaption = token.children?.length 
    ? slf.renderInline(token.children, options, env)
    : token.content;
  return `<div class="${className}">${printText}${htmlCaption}</div>`
};

export const InlineDecimal = (a, token) => {
  if (!token.content) {
    return '';
  }
  const arr: Array<string> = token.content.split(';');
  return `<span class="f">${arr[0]}</span><span class="decimal_left">${arr[1]?arr[1]:''}</span><span class="f">.${arr[2]?arr[2]:''}</span>`;
};

export const IncludeGraphics = (tokens, idx, options, env, slf): string => {
  const token: Token = tokens[idx];
  const RAW_WIDTH = token.attrGet('width') || '';
  const RAW_MAX_WIDTH = token.attrGet('max width') || '';
  const RAW_HEIGHT = token.attrGet('height') || '';
  const SRC = token.attrGet('src') || '';
  const ALT = token.attrGet('alt') || '';
  const HILITE = token.attrGet('data-mmd-highlight') || '';
  const TAG = token.tag || 'img';

  // wrapper styles (centering, highlighting)
  const wrapperStyles: string[] = [];
  const align = token.attrGet('align') || (options?.centerImages ? 'center' : '');
  if (align) wrapperStyles.push(`text-align: ${align};`);
  if (HILITE) wrapperStyles.push(HILITE);

  // ---- image styles ----
  const imgStyles: string[] = [];

  // height
  if (RAW_HEIGHT) {
    imgStyles.push(`height: ${RAW_HEIGHT};`);
  }

  let widthIsSet: boolean = false;
  // width
  // Support: 0.75\textwidth, \textwidth, 1\linewidth, etc.
  // Grab the factor (can be empty), then \textwidth|\linewidth
  const twMatch = RAW_WIDTH.match(TEXTWIDTH_RE);

  if (twMatch) {
    const factor: number = Math.max(0, parseFloat(twMatch[1] ?? '1')) || 1;
    const pct: number = Math.min(100, factor * 100);
    imgStyles.push(`width: ${pct}%;`);
    widthIsSet = true;
  } else if (RAW_WIDTH) {
    // Any other units (“300px”, “12cm”, “40%”, “10em”) — we give as is
    imgStyles.push(`width: ${RAW_WIDTH};`);
    widthIsSet = true;
  }
  // max width
  // Support: 0.75\textwidth, \textwidth, 1\linewidth, etc.
  // Grab the factor (can be empty), then \textwidth|\linewidth
  const twMaxMatch = RAW_MAX_WIDTH.match(TEXTWIDTH_RE);

  if (twMaxMatch) {
    const factor: number = Math.max(0, parseFloat(twMaxMatch[1] ?? '1')) || 1;
    const pct: number = Math.min(100, factor * 100);
    imgStyles.push(`max-width: ${pct}%;`);
    widthIsSet = true;
  } else if (RAW_MAX_WIDTH) {
    // Any other units (“300px”, “12cm”, “40%”, “10em”) — we give as is
    imgStyles.push(`max-width: ${RAW_MAX_WIDTH};`);
    widthIsSet = true;
  }
  if (!widthIsSet) {
    // Width not specified
    /** max-width - prevent small images from being stretched */
    imgStyles.push('max-width: 50%;');
  }

  const divStyleAttr: string = wrapperStyles.length ? ` style="${wrapperStyles.join(' ')}"` : '';
  const imgStyleAttr: string = imgStyles.length ? ` style="${imgStyles.join(' ')}"` : '';
  const srcAttr: string = SRC ? ` src="${SRC}"` : '';
  const altAttr: string = ` alt="${escapeHtml(ALT)}"`;

  return `<div class="figure_img"${divStyleAttr}><${TAG}${srcAttr}${altAttr}${imgStyleAttr}${TAG === 'img' ? '/' : ''}>${TAG === 'img' ? '' : '</' + TAG + '>'}</div>`;
};

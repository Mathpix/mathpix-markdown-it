import { Renderer, Token } from 'markdown-it';
import { getTextWidth } from "../utils";

export const CaptionTable: Renderer = (tokens, idx, options, env, slf) => {
  let token: Token = tokens[idx];
  let htmlPrint = token.print ? token.print : '';
  let htmlCaption = token.children?.length 
    ? slf.renderInline(token.children, options, env)
    : token.content;
  if (!token.attrGet('class')) {
    token.attrSet("class", "caption_table")
  }
  return `<div${slf.renderAttrs(token)}>${htmlPrint}${htmlCaption}</div>`
};

export const InlineDecimal = (a, token) => {
  if (!token.content) {
    return '';
  }
  const arr: Array<string> = token.content.split(';');
  return `<span class="f">${arr[0]}</span><span class="decimal_left">${arr[1]?arr[1]:''}</span><span class="f">.${arr[2]?arr[2]:''}</span>`;
};

export const IncludeGraphics = (a, token, slf, width, options) => {
  const textWidthTag: RegExp = /\\textwidth|\\linewidth/;
  let align = token.attrGet('align');
  if (!align && options.centerImages) {
    align = 'center';
  }
  let style = align ? `text-align: ${align}; ` : '';
  const h = token.attrGet('height');
  let styleImg = h ? `height: ${h}; ` : '';
  let w = token.attrGet('width');
  if (w) {
    if (textWidthTag.test(w)) {
      const match = w.match(textWidthTag);
      if (match) {
        const textWidth = width ? width : getTextWidth();
        let dWidth = w.slice(0, match.index).trim();
        dWidth = parseFloat(dWidth);
        dWidth = !dWidth ? 1 : dWidth;
        styleImg  += `width: ${dWidth * textWidth}px; `;
      }
    } else {
      styleImg  += `width: ${w}; `;
    }
  }
  if (!styleImg) {
    const textWidth = width ? width : getTextWidth();
    /** max-width - prevent small images from being stretched */
    styleImg  += `max-width: ${0.5 * textWidth}px; `;
  }

  const src = token.attrGet('src') ? `src=${token.attrGet('src')}` : '';
  const alt = '';

  styleImg = styleImg ? `style="${styleImg}"` : '';
  let data_mmd_highlight = token.attrGet('data-mmd-highlight');
  data_mmd_highlight = data_mmd_highlight ? data_mmd_highlight : '';
  style = style ? `style="${style}${data_mmd_highlight}"` : '';
  return `<div class="figure_img" ${style}><${token.tag} ${src} ${alt} ${styleImg}></div>`
};

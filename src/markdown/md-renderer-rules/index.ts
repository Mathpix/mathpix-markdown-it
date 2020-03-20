import { Renderer } from 'markdown-it';
import { getTextWidth } from "../utils";

export const CaptionTable: Renderer = (a, token) => {
  return `<div class=${token.attrGet('class')
    ? token.attrGet('class')
    : "caption_table"}>${token.content}</div>`
};

export const InlineDecimal = (a, token) => {
  if (!token.content) {
    return '';
  }
  const arr: Array<string> = token.content.split(';');
  return `<span class="f">${arr[0]}</span><span class="decimal_left">${arr[1]?arr[1]:''}</span><span class="f">.${arr[2]?arr[2]:''}</span>`;
};

export const IncludeGraphics = (a, token, slf, width) => {
  const textWidthTag: RegExp = /\\textwidth|\\linewidth/;
  let  style = `text-align: ${token.attrGet('align')
    ? token.attrGet('align')
    : 'center'}; `;
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
    styleImg  += `width: ${0.5 * textWidth}px; `;
  }

  const src = token.attrGet('src') ? `src=${token.attrGet('src')}` : '';
  const alt = '';

  styleImg = styleImg ? `style="${styleImg}"` : '';
  style = style ? `style="${style}"` : '';
  return `<div class="figure_img" ${style}><${token.tag} ${src} ${alt} ${styleImg}></div>`
};

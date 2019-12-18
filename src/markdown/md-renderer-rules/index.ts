import { Renderer } from 'markdown-it';
import { getTextWidth } from "../utils";

export const CaptionTable: Renderer = (a, token) => {
  return `<div class=${token.attrs[token.attrIndex('class')] 
    ? token.attrs[token.attrIndex('class')][1]
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
  let  style = `text-align: ${token.attrs[token.attrIndex('align')] ? token.attrs[token.attrIndex('align')][1]: 'center'}; `;
  const h = token.attrs[token.attrIndex('height')];
  let styleImg = h ? `height: ${h[1]}; ` : '';
  let w = token.attrs[token.attrIndex('width')];
  if (w) {
    if (textWidthTag.test(w[1])) {
      const match = w[1].match(textWidthTag);
      if (match) {
        const textWidth = width ? width : getTextWidth();
        let dWidth = w[1].slice(0, match.index).trim();
        dWidth = parseFloat(dWidth);
        dWidth = !dWidth ? 1 : dWidth;
        styleImg  += `width: ${dWidth * textWidth}px; `;
      }
    } else {
      styleImg  += `width: ${w[1]}; `;
    }
  }
  if (!styleImg) {
    const textWidth = width ? width : getTextWidth();
    styleImg  += `width: ${0.5 * textWidth}px; `;
  }

  const src = token.attrs[token.attrIndex('src')] ? `src=${token.attrs[token.attrIndex('src')][1]}` : '';
  const alt = '';

  styleImg = styleImg ? `style="${styleImg}"` : '';
  style = style ? `style="${style}"` : '';
  return `<div class="figure_img" ${style}><${token.tag} ${src} ${alt} ${styleImg}></div>`
};

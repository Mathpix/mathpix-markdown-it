import { RuleBlock, StateBlock } from 'markdown-it';
import { IParseImageParams, parseImageParams } from "../md-inline-rule/image";
const imageMarkdownRegex: RegExp = /^!\[([^\]]*)\]\(([^)]+)\)(\s*\{([^}]+)\})?/;
const linkAndTitleRegex: RegExp = /^([^" ]+)\s+"(.+)"$/;

export const imageWithSizeBlock: RuleBlock = (state: StateBlock, startLine, endLine, silent) => {
  const pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];

  if (state.src.charCodeAt(pos) !== 0x21 /* ! */) return false;
  if (state.src.charCodeAt(pos + 1) !== 0x5B /* [ */) return false;

  const line = state.src.slice(pos, max);
  const match = line.match(imageMarkdownRegex);

  if (!match) return false;

  if (silent) return true;

  const [, alt, linkAndTitle, , paramStr] = match;

  let href = '', title = '';
  const titleMatch = linkAndTitle.match(linkAndTitleRegex);
  if (titleMatch) {
    href = titleMatch[1];
    title = titleMatch[2];
  } else {
    href = linkAndTitle.trim();
  }

  let attrs = [];
  attrs = [ [ 'src', href ], [ 'alt', '' ] ];
  if (title) attrs.push(['title', title]);

  if (paramStr?.trim()) {
    let params: IParseImageParams = null;
    if (state.md.options.centerImages) {
      params = parseImageParams(paramStr, 'center');
    } else {
      params = parseImageParams(paramStr, '');
    }
    if (params) {
      attrs = attrs.concat(params.attr);
    }
  }

  const token = state.push('image_block', 'img', 0);
  token.block = true;
  token.attrs = attrs;
  token.content = alt;
  token.children = [];
  token.map = [startLine, startLine + 1];

  state.line = startLine + 1;
  return true;
};

export const renderRuleImageBlock = (tokens, idx, options, env, slf) => {
  try {
    let token = tokens[idx];
    token.attrs[token.attrIndex('alt')][1] =
      slf.renderInlineAsText(token.children, options, env);

    let align = token.attrGet('data-align');
    if (!align && options.centerImages) {
      align = 'center';
      token.attrSet('data-align', align);
    }
    let res = align
      ? `<figure style="text-align: ${align}">`
      : '<figure>';
    res += slf.renderToken(tokens, idx, options);
    res += res = '</figure>';
    return res;
  } catch (e) {
    console.log("[ERROR]=>[renderRuleImageBlock]=>e=>", e);
    return ''
  }
};

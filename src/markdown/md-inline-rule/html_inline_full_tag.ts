import { RuleInline } from 'markdown-it';
import { extractFullHtmlTagContent } from "../common/html-re";

const svgInlineRegex = /^<(svg)\b[^>]*>[\s\S]*<\/svg>/;
const preInlineRegex = /^<(pre)\b[^>]*>[\s\S]*<\/pre>/;
const codeInlineRegex = /^<(code)\b[^>]*>[\s\S]*<\/code>/;
const scriptInlineRegex = /^<(script)\b[^>]*>[\s\S]*<\/script>/;
const styleInlineRegex = /^<(style)\b[^>]*>[\s\S]*<\/style>/;
const textareaInlineRegex = /^<(textarea)\b[^>]*>[\s\S]*<\/textarea>/;
const optionInlineRegex = /^<(option)\b[^>]*>[\s\S]*<\/option>/;


// Helper function to match regex against state source
const matchTagRegex = (src: string, pos: number, options): RegExpMatchArray | null => {
  const remainder = src.slice(pos);
  let match: RegExpMatchArray | null =
    remainder.match(svgInlineRegex) ||
    remainder.match(preInlineRegex) ||
    remainder.match(codeInlineRegex);
  if (match) {
    return match;
  }
  if (options?.htmlSanitize === true || options?.htmlSanitize?.disallowedTagsMode === 'discard') {
    return remainder.match(styleInlineRegex) ||
    remainder.match(scriptInlineRegex) ||
    remainder.match(textareaInlineRegex) ||
    remainder.match(optionInlineRegex);
  }
  return null;
};

export const html_inline_full_tag: RuleInline = (state, silent) => {
  try {
    const { pos, src, posMax } = state;
    if (!state.md.options.html || pos + 2 >= posMax || src.charCodeAt(pos) !== 0x3C /* < */) {
      return false;
    }

    const match: RegExpMatchArray | null = matchTagRegex(src, pos, state.md.options);
    if (!match) {
      return false;
    }

    const tag: string = match[1];
    const matchedTagContent = extractFullHtmlTagContent(src.slice(pos), tag);
    if (!matchedTagContent?.length) {
      return false;
    }

    if (!silent) {
      const token = state.push('html_inline', '', 0);
      token.content = src.slice(pos, pos + matchedTagContent[0].length);
      token.isFullHtmlTagContent = true;
    }

    state.pos += matchedTagContent[0].length;
    return true;
  } catch (err) {
    console.error("[ERROR]=>[html_inline_full_tag]=>", err);
    return false;
  }
};

import { MarkdownIt, Token, TokenList } from 'markdown-it';
import { slugify, uniqueSlug } from './common';

const isLevelSelectedNumber = selection => level => level >= selection;
const isLevelSelectedArray = selection => level => selection.includes(level);

const types: string[] = [
  'section',
  'subsection',
  'subsubsection',
]

const anchor = (md: MarkdownIt, opts) => {
  opts = Object.assign({}, anchor.defaults, opts);

  md.core.ruler.push('anchor', state => {
    const slugs = {};
    const tokens: TokenList = state.tokens;

    const isLevelSelected = Array.isArray(opts.level)
      ? isLevelSelectedArray(opts.level)
      : isLevelSelectedNumber(opts.level)

    tokens
      .filter((token: Token) => token.type === 'heading_open')
      .filter((token: Token) => isLevelSelected(Number(token.tag.substr(1))))
      .forEach((token: Token) => {

        const tokenType: string = token.attrGet('type');
        let title: string = '';
        if (types.includes(tokenType)) {
          const t: Token = tokens[tokens.indexOf(token) + 1];
          title = types.includes(t.type) ? t.content : ''
        } else {
          // Aggregate the next token children text.
          title = tokens[tokens.indexOf(token) + 1]
            .children
            .filter(token => token.type === 'text' || token.type === 'code_inline')
            .reduce((acc, t) => acc + t.content, '');
        }

        let slug: string = token.attrGet('id') || '';

        if (!slug || slug === '') {
          slug = uniqueSlug(slugify(title), slugs);
          token.attrPush(['id', slug])
        }
      })
  })
};

anchor.defaults = {
  level: 1,
};

export default anchor;

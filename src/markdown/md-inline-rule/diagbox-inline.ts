import { RuleInline, Token, StateInline } from "markdown-it";
import { extractNextBraceContent } from "../md-block-rule/begin-tabular/sub-cell";
import { getSubTabular } from "../md-block-rule/begin-tabular/sub-tabular";
import { getMathTableContent, getSubMath } from "../md-block-rule/begin-tabular/sub-math";
import { getContent } from "../md-block-rule/begin-tabular/common";
import { reDiagbox } from "../common/consts";
import { TTokenTabular } from "../md-block-rule/begin-tabular";
import { parseAttributes } from '../common/parse-attribures';
import { getExtractedCodeBlockContent } from "../md-block-rule/begin-tabular/sub-code";

const processContent = (content: string): string => {
  try {
    const parseMath: string = getMathTableContent(content, 0);
    let processedContent: string = parseMath || getContent(content, false, true);
    const data: TTokenTabular[] = getSubTabular(processedContent, 0, true);
    if (data && data.length) {
      return data.map(item => item.content).join('');
    } else {
      processedContent = getExtractedCodeBlockContent(processedContent, 0);
      return processedContent;
    }
  } catch (err) {
    console.error("[ERROR]=>[processContent]=>", err);
    return content;
  }
};

const createDiagboxItemToken = (state: StateInline, content: string): Token => {
  const token: Token = new state.Token('diagbox_item', '', 0);
  token.content = content;
  let tokens: Token[] = [];
  state.md.inline.parse(content, state.md, state.env, tokens);
  token.children = tokens;
  return token;
};

export const inlineDiagbox: RuleInline = (state: StateInline, silent: boolean): boolean => {
  try {
    const { pos, src } = state;
    let match: RegExpExecArray;
    if (src.charCodeAt(pos) !== 0x5c /* \ */) {
      return false;
    }
    let str = src.slice(pos);
    match = reDiagbox.exec(str);

    if (!match) return false;
    if (silent) return true;

    const { index } = match;
    const options = match[2] || '';
    let isSW = false;
    if (match[1] === 'slashbox') {
      isSW = true;
    }
    const attributes: Record<string, string | boolean> = parseAttributes(options);
    if (attributes?.dir === 'SW' || attributes?.dir === 'NE') {
      isSW = true;
    }

    let [left, newIndex] = extractNextBraceContent(str, index + match[0].length);
    let [right, endIndex] = extractNextBraceContent(str, newIndex);
    left = left ? getSubMath(left) : '';
    right = right ? getSubMath(right) : '';
    left = left.split('\n').join('').trim();
    right = right.split('\n').join('').trim();
    left = left.split('\\\\').join('\n');
    right = right.split('\\\\').join('\n');

    const token: Token = isSW ? state.push('slashbox', '', 0) : state.push('backslashbox', '', 0);
    token.attrJoin('class', `diagonal-cell`);
    token.attrJoin('style', 'grid-template-columns: repeat(2, 1fr); padding: 0;');
    token.content = '';
    token.latex = match[0];
    token.children = [];

    let leftContent: string = processContent(left);
    let rightContent: string = processContent(right);
    let tokenLeft: Token = createDiagboxItemToken(state, leftContent);
    let tokenRight: Token = createDiagboxItemToken(state, rightContent);

    if (isSW) {
      tokenLeft.attrJoin('class', `cell-item diagonal-cell-topLeft`);
      let styleTopLeft: string[] = ['grid-row-start: 1;', 'grid-column-start: 1;', 'text-align: left; white-space: nowrap; min-height: 1.5em;'];
      tokenLeft.attrJoin('style', styleTopLeft.join(' '));
      token.children.push(tokenLeft);

      tokenRight.attrJoin('class', `cell-item diagonal-cell-bottomRight`);
      let styleBottomRight: string[] = ['grid-row-start: 2;', 'grid-column-start: 2;', 'text-align: right; white-space: nowrap; min-height: 1.5em; margin-top: auto;'];
      tokenRight.attrJoin('style', styleBottomRight.join(' '));
      token.children.push(tokenRight);
    } else {
      tokenRight.attrJoin('class', `cell-item diagonal-cell-topRight`);
      let styleTopRight: string[] = ['grid-row-start: 1;', 'grid-column-start: 2;', 'text-align: right; white-space: nowrap; min-height: 1.5em;'];
      tokenRight.attrJoin('style', styleTopRight.join(' '));
      token.children.push(tokenRight);

      tokenLeft.attrJoin('class', `cell-item diagonal-cell-bottomLeft`);
      let styleBottomLeft: string[] = ['grid-row-start: 2;', 'grid-column-start: 1;', 'text-align: left; white-space: nowrap; min-height: 1.5em; margin-top: auto;'];
      tokenLeft.attrJoin('style', styleBottomLeft.join(' '));
      token.children.push(tokenLeft);
    }

    state.pos += endIndex;
    return true;
  } catch (err) {
    console.error("[ERROR]=>[inlineDiagbox]=>", err);
    return false;
  }
};

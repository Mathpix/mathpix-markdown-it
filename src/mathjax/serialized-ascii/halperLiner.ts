import { IAsciiData } from "./common";
import { isLastChild } from "./node-utils";
import { regExpIsFunction } from "./helperA";

const RE_NEED_PARENS_BEFORE_FRACTION = /([\p{L}\p{N}]|[)\]}]|[!′″‴%°])$/u;
const RE_NEED_PARENS_AFTER_FRACTION = /^([\p{L}\p{N}]|[\(\[\{]|[!′″‴%°])/u;

export const amSymbolsToLiner = [
  { input: "\u005E", output: "\u0302"}, //hat
  { input: "\u007E", output: "\u0302"}, //widetilde
  { input: "~", output: "\u0303"}, //tilde
  { input: "\u2192", output: "\u20D7"}, //vec
  { input: "―", output: "\u0304"}, //bar
];

export const rootSymbols = [
  { val: 2, output: "\u221A"}, //√
  { val: 3, output: "\u221B"}, //∛
  { val: 4, output: "\u221C"}, //∜
];

export const findAmSymbolsToLiner = (input: string): string => {
  let data = amSymbolsToLiner.find(item => item.input === input);
  return  data ? data.output : ''
}

export const findRootSymbol = (val: number): string => {
  let data = rootSymbols.find(item => item.val === val);
  return data ? data.output : '';
}

export const needsParensForFollowingDivision = (s: string): boolean => {
  if (!s) return false;
  const last = Array.from(s.trimEnd()).pop(); // Unicode-безопасно
  if (!last) return false;
  return RE_NEED_PARENS_BEFORE_FRACTION.test(last);
}

export const needBrackets = (serialize, node, isFunction = false) => {
  let haveSpace: boolean = false;
  try {
    if (isLastChild(node)) {
      return false;
    }
    const index = node.parent.childNodes.findIndex(item => item === node);
    let nextNode = node.parent.childNodes[index+1];
    const data: IAsciiData = serialize.visitNode(nextNode, '');
    if (isFunction) {
      const isNextFunction = nextNode.attributes.get('isFunction');
      if (isNextFunction || regExpIsFunction.test(data.liner.trim())
        || (nextNode?.kind === 'mo' && nextNode?.texClass === -1)) {
        return false;
      }
    }
    if (data.liner?.trim()) {
      const first = Array.from(data.liner.trimStart())[0] ?? '';
      if (!first) return false;
      return RE_NEED_PARENS_AFTER_FRACTION.test(first);
    }
    return false;
  } catch (e) {
    return haveSpace;
  }
};

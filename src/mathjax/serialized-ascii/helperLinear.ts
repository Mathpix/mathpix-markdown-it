import { IAsciiData } from "./common";
import { isLastChild } from "./node-utils";
import { regExpIsFunction } from "./helperA";

const RE_NEED_PARENS_BEFORE_FRACTION = /([\p{L}\p{N}]|[)\]}]|[!′″‴%°])$/u;
const RE_NEED_PARENS_AFTER_FRACTION = /^([\p{L}\p{N}]|[\(\[\{]|[!′″‴%°])/u;
const RE_UNICODE_WHITESPACE = /\p{White_Space}/gu;
const RE_PLAIN_ROOT_DEGREE = /^\s*[234]\s*$/;

export const amSymbolsToLinear = [
  { input: "hat", output: "\u0302", outputComplex: "ˆ"}, //hat
  { input: "widehat", output: "\u0302", outputComplex: "ˆ"}, //hat
  { input: "widetilde", output: "\u0303", outputComplex: " \u0303"}, //widetilde
  { input: "tilde", output: "\u0303", outputComplex: " \u0303"}, //tilde
  { input: "vec", output: "\u20D7", outputComplex: " \u20D7"}, //vec
  { input: "bar", output: "\u0304", outputComplex: "\u00AF"}, //bar
  { input: "breve", output: "\u0306", outputComplex: " \u0306"}, //breve
  { input: "\u02d8", output: "\u0306", outputComplex: " \u0306"}, //˘ //breve
  { input: "‾", output: "\u0304", outputComplex: "\u00AF"}, //̅
  { input: "˙", output: "\u0307", outputComplex: " \u0307"}, //dot
  { input: "¨", output: "\u0308", outputComplex: " \u0308"}, //ddot
  { input: "ˇ", output: "\u030C", outputComplex: " \u030C"}, //check
  { input: "`", output: "\u0300", outputComplex: " \u0300"}, //grave
  { input: "´", output: "\u0301", outputComplex: " \u0301"}, //acute
  { input: "′", output: "′", outputComplex: "′"},
  { input: "′′", output: "′′", outputComplex: "′′"},
  { input: "\u2190", output: "\u20D6", outputComplex: " \u20D6"}, //overleftarrow
  { input: "harr", output: "\u20E1", outputComplex: " \u20E1", tag: 'mover'}, //overleftrightarrow //combining left right arrow above (U+20E1)
  { input: "↔", output: "\u20E1", outputComplex: " \u20E1", tag: 'mover'}, //overleftrightarrow //combining left right arrow above (U+20E1)
  { input: "⏞", output: "\u23DE", outputComplex: "\u23DE", isFirst: true}, //overbrace
  { input: "obrace", output: "\u23DE", outputComplex: "\u23DE", isFirst: true}, //overbrace
  { input: "\u23DF", output: "\u23DF", outputComplex: "\u23DF", isFirst: true}, //underbrace
  { input: "ubrace", output: "\u23DF", outputComplex: "\u23DF", isFirst: true}, //underbrace
  { input: "ul", output: "\u0332", outputComplex: "\u0332", isFirst: true}, //underline
  { input: "―", output: "▁", outputComplex: "▁", isFirst: true}, //underline //▁
  { input: "\u2218", output: "\u00B0", outputComplex: "\u00B0", tag: 'msup'},  //°
  { input: "˚", output: "\u030A", outputComplex: "\u030A", tag: 'mover'},  //°
  { input: "\u20DB", output: "\u20DB", outputComplex: "\u20DB", tag: 'mover'},  //dddot //combining three dots above (U+20DB)
];

export const rootSymbols = [
  { val: 2, output: "\u221A"}, //√
  { val: 3, output: "\u221B"}, //∛
  { val: 4, output: "\u221C"}, //∜
];

const SUPER: Record<string, string> = {
  "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹",
  "+":"⁺","-":"⁻","−":"⁻","=":"⁼","(":"⁽",")":"⁾",
  "i":"ⁱ","n":"ⁿ","a":"ᵃ","b":"ᵇ","c":"ᶜ","d":"ᵈ","e":"ᵉ","f":"ᶠ","g":"ᵍ","h":"ʰ",
  "j":"ʲ","k":"ᵏ","l":"ˡ","m":"ᵐ","o":"ᵒ","p":"ᵖ","r":"ʳ","s":"ˢ","t":"ᵗ","u":"ᵘ",
  "v":"ᵛ","w":"ʷ","x":"ˣ","y":"ʸ","z":"ᶻ","A":"ᴬ","B":"ᴮ","D":"ᴰ","E":"ᴱ","G":"ᴳ",
  "H":"ᴴ","I":"ᴵ","J":"ᴶ","K":"ᴷ","L":"ᴸ","M":"ᴹ","N":"ᴺ","O":"ᴼ","P":"ᴾ","R":"ᴿ",
  "T":"ᵀ","U":"ᵁ","V":"ⱽ","W":"ᵂ",
  "′": "′",
  " ": " "
};
const SUB: Record<string, string> = {
  "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉",
  "+":"₊","-":"₋","−":"₋","=":"₌","(":"₍",")":"₎",
  "a":"ₐ","e":"ₑ","h":"ₕ","i":"ᵢ","j":"ⱼ","k":"ₖ","l":"ₗ","m":"ₘ","n":"ₙ","o":"ₒ",
  "p":"ₚ","r":"ᵣ","s":"ₛ","t":"ₜ","u":"ᵤ","v":"ᵥ","x":"ₓ",
  " ": " "
};

const mapSeq = (seq: string, table: Record<string,string>): {ok: boolean, out: string} => {
  let out = "";
  for (const ch of seq) {
    const mapped = table[ch];
    if (!mapped) return { ok: false, out: "" };
    out += mapped;
  }
  return { ok: true, out };
}

export const replaceScripts = (text: string, type = 'sup') => {
  if (!text) return '';
  text = text.trim();
  if (!text) return '';
  const m = type === 'sup'
    ? mapSeq(text, SUPER)
    : mapSeq(text, SUB);
  if (m.ok && m.out) return m.out;
  return '';
}

export const findAmSymbolsToLinear = (input: string, tag = '') => {
  let linearData = null;
  if (tag) {
    linearData = amSymbolsToLinear.find(item => item.tag === tag && item.input === input);
    if (linearData) {
      return linearData;
    }
  }
  return amSymbolsToLinear.find(item => item.input === input);
}

export const findRootSymbol = (str: string): string => {
  if (!str) return '';
  if (RE_PLAIN_ROOT_DEGREE.test(str)) {
    let val = Number(str);
    let data = rootSymbols.find(item => item.val === val);
    return data ? data.output : '';
  }
  let sup = replaceScripts(str);
  if (!sup) return '';
  return ' ' + sup + rootSymbols[0].output;
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
      if (isNextFunction || regExpIsFunction.test(data.linear.trim())
        || (nextNode?.kind === 'mo' && nextNode?.texClass === -1)) {
        return false;
      }
    }
    if (data.linear?.trim()) {
      const first = Array.from(data.linear.trimStart())[0] ?? '';
      if (!first) return false;
      return RE_NEED_PARENS_AFTER_FRACTION.test(first);
    }
    return false;
  } catch (e) {
    return haveSpace;
  }
};

// The string is completely wrapped in outer ( ... ) and they are balanced
export const isWrappedWithParens = (s: string): boolean => {
  if (!s) return false;
  const t = s.trim();
  if (!(t.startsWith('(') && t.endsWith(')'))) return false;
  // Let's check that the outer pair actually covers the entire string.
  let depth = 0;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      // if the depth becomes 0 before the end of the string, the outer pair does not cover everything
      if (depth === 0 && i !== t.length - 1) return false;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
};

export const hasAnyWhitespace = (str: string): boolean => {
  return str
    .replace(RE_UNICODE_WHITESPACE, '')
    .length !== str.length;
}

export const replaceUnicodeWhitespace = (str: string): string => {
  return str.replace(RE_UNICODE_WHITESPACE, ' ');
}

export const formatLinearFromAscii = (ascii: string, childLinear?: string, tag = ''): string => {
  const linearData = findAmSymbolsToLinear(ascii, tag);
  if (!linearData) return '';
  const child = (childLinear ?? '').trim();
  const childWrapped = child.length > 1 ? `(${child})` : child;
  if (linearData.isFirst) {
    return linearData.output + childWrapped;
  } else {
    return childWrapped + (child.length > 1 ? linearData.outputComplex : linearData.output);
  }
}

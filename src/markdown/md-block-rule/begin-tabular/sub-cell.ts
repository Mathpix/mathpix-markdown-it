import { generateUniqueId } from "./common";
import { reDiagboxG } from "../../common/consts";

const diagboxTable = new Map<string, string>();

export const getSubDiagbox = (str: string): string => {
  let result: string = '';
  let lastIndex: number = 0;
  let match;
  while ((match = reDiagboxG.exec(str))) {
    const { index } = match;
    const [left, newIndex] = extractNextBraceContent(str, index + match[0].length);
    const [right, endIndex] = extractNextBraceContent(str, newIndex);
    if (!left || !right) continue;
    const fullMatch = `${match[0]}{${left}}{${right}}`;
    let id = diagboxTable.get(fullMatch);
    if (!id) {
      id = generateUniqueId();
      diagboxTable.set(fullMatch, id);
    }
    result += str.slice(lastIndex, index) + `<<${id}>>`;
    lastIndex = endIndex;
  }
  result += str.slice(lastIndex);
  return result;
};


export const extractNextBraceContent = (str: string, startIndex: number): [string, number] => {
  let depth = 0, content = '', i = startIndex;
  while (i < str.length) {
    const char = str[i];
    if (char === '{' && depth++ === 0) { i++; continue; }
    if (char === '}' && --depth === 0) return [content, i + 1];
    content += char;
    i++;
  }
  return ['', startIndex];
};

export const findInDiagboxTable = (id: string): string | undefined => {
  for (const [key, value] of diagboxTable) {
    if (value === id) {
      return key;
    }
  }
  return undefined;
};

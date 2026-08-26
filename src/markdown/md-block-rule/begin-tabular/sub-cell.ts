import { generateUniqueId } from "./common";
import { reDiagboxG } from "../../common/consts";
import { getInlineCodeListFromString, buildInlineCodePositionSet, findEndMarker } from "../../common";

const diagboxTable = new Map<string, string>();
const diagboxById = new Map<string, string>();

export const ClearDiagboxTable = (): void => {
  diagboxTable.clear();
  diagboxById.clear();
};

export const getSubDiagbox = (str: string): string => {
  let result: string = '';
  let lastIndex: number = 0;
  let match;
  // Once per string, and only if a `\diagbox` turns up: it was rebuilt twice per command.
  let codeIndex: Set<number> | null = null;
  const codePositions = (): Set<number> => {
    if (!codeIndex) {
      codeIndex = buildInlineCodePositionSet(getInlineCodeListFromString(str));
    }
    return codeIndex;
  };
  while ((match = reDiagboxG.exec(str))) {
    const { index } = match;
    const [left, newIndex] = extractNextBraceContent(str, index + match[0].length, codePositions());
    const [right, endIndex] = extractNextBraceContent(str, newIndex, codePositions());
    const fullMatch = `${match[0]}{${left}}{${right}}`;
    let id = diagboxTable.get(fullMatch);
    if (!id) {
      id = generateUniqueId();
      diagboxTable.set(fullMatch, id);
      diagboxById.set(id, fullMatch);
    }
    result += str.slice(lastIndex, index) + `<<${id}>>`;
    lastIndex = endIndex;
  }
  result += str.slice(lastIndex);
  return result;
};


// Through the shared matcher, so `\backslashbox{a \\}{b}` pairs by backslash parity like every other
// argument does: reading one `\` back made the `\\` shield the brace and cost both diagonal cells.
export const extractNextBraceContent = (
  str: string, startIndex: number, codeIndex?: Set<number>
): [string, number] => {
  if (str[startIndex] !== '{') {
    return ['', startIndex];
  }
  // Handed in by a caller reading several commands of one string: built here it cost the whole string.
  const codePositions: Set<number> = codeIndex
    ?? buildInlineCodePositionSet(getInlineCodeListFromString(str));
  const found = findEndMarker(str, startIndex, '{', '}', false, 0, codePositions);
  return found.res ? [found.content, found.nextPos] : ['', startIndex];
};

export const findInDiagboxTable = (id: string): string | undefined =>
  diagboxById.get(id);

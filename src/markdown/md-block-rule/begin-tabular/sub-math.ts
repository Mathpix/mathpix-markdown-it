import { generateUniqueId, getContent } from './common';
import {findEndMarkerPos} from "../../mdPluginRaw";
import { beginTag, endTag, findOpenCloseTagsMathEnvironment } from "../../utils";
import { addExtractedCodeBlock } from "./sub-code";
import {
  CODE_ENVS,
  doubleCurlyBracketUuidPattern,
  singleCurlyBracketPattern
} from "../../common/consts";

type TSubMath = {id: string, content: string}
var mathTable: Array<TSubMath> = [];

export const ClearSubMathLists = (): void => {
  mathTable = [];
};

export const mathTablePush = (item: TSubMath) => {
  mathTable.push(item)
}

export const getMathTableContent = (sub: string, i: number): string => {
  let resContent: string = sub;
  sub = sub.trim();
  let cellM: Array<string> =  sub.slice(i).match(doubleCurlyBracketUuidPattern);
  cellM =  cellM ? cellM : sub.slice(i).match(singleCurlyBracketPattern);
  if (!cellM) {
    return '';
  }
  for (let j = 0; j < cellM.length; j++) {
    let content: string = cellM[j].replace(/\{/g, '').replace(/\}/g, '');
    const index: number = mathTable.findIndex(item => item.id === content);
    if (index >= 0) {
      let iB: number = resContent.indexOf(cellM[j]);
      resContent = resContent.slice(0, iB) + mathTable[index].content + resContent.slice(iB + cellM[j].length);
    }
  }
  resContent = getContent(resContent);
  return resContent;
};

export const getSubMath = (str: string, startPos = 0): string => {
  const match: RegExpMatchArray = str
    .slice(startPos)
    .match(/(?:\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\})/);
  let endMarkerPos = -1;
  if (match) {
    let beginMarkerPos: number = startPos + match.index;
    let startMathPos: number = beginMarkerPos + match[0].length;
    let endMarker: string;
    if (match[0] === "\\\\[") {
      endMarker = "\\\\]";
    } else if (match[0] === "\\[") {
      endMarker = "\\]";
    } else if (match[0] === "\\\\(") {
      endMarker = "\\\\)";
    } else if (match[0] === "\\(") {
      endMarker = "\\)";
    } else if (match[0].includes("eqref")) {
      endMarker = "";
    } else if (match[0].includes("ref")) {
      endMarker = "";
    } else if (match[1] && match[1] !== 'abstract' && match[1] !== 'tabular') {
      const environment = match[1].trim();
      const openTag: RegExp = beginTag(environment, true);
      const closeTag: RegExp = endTag(environment, true);
      if (closeTag && openTag) {
        const data = findOpenCloseTagsMathEnvironment(str.slice(startPos), openTag, closeTag);
        if (data?.arrClose?.length) {
          endMarkerPos = startPos + data.arrClose[data.arrClose.length - 1]?.posStart;
        }
        endMarker = `\\end{${match[1]}}`;
      }
    } else if (match[0] === "$$") {
      endMarker = match[0];
    } else if (match[0] === "$") {
      endMarker = match[0];
    }
    endMarkerPos = endMarkerPos !== -1 
      ? endMarkerPos 
      : findEndMarkerPos(str, endMarker, startMathPos);
    if (endMarkerPos === -1) {
      /** If the end marker is not found, it is necessary to search further, excluding the current marker. */
      str = getSubMath(str, startMathPos);
      return str;
    }
    if (match[0] === "$" || match[0] === "$$") {
      const beforeEndMarker = str.charCodeAt(endMarkerPos - 1);
      if ( beforeEndMarker === 0x5c /* \ */ ||
          (beginMarkerPos > 0 && str.charCodeAt(beginMarkerPos - 1)=== 0x5c /* \ */)
      ) {
        /** If the marker is shielded, it is necessary to search further, excluding the current marker. */
        str = getSubMath(str, startMathPos);
        return str;
      }
      if (match[0] === "$") {
        const afterStartMarker = str.charCodeAt(beginMarkerPos + 1)
        if ( beforeEndMarker  === 0x20 /* space */ ||
             beforeEndMarker  === 0x09 /* \t */ ||
             beforeEndMarker  === 0x0a /* \n */ ||
             afterStartMarker === 0x20 /* space */ ||
             afterStartMarker === 0x09 /* \t */ ||
             afterStartMarker === 0x0a /* \n */
        ) {
          str = getSubMath(str, startMathPos);
          return str;
        }
      }
      // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
      const suffix = str.charCodeAt(endMarkerPos+1);
      if (suffix >= 0x30 && suffix < 0x3a) {
        str = getSubMath(str, startMathPos);
        return str;
      }
    }
    const nextPos: number = endMarkerPos + endMarker.length;

    const content: string = str.slice(beginMarkerPos, nextPos);

    const id: string = generateUniqueId();
    const isCodeEnv: boolean = match[1] && CODE_ENVS.has(match[1]);
    if (isCodeEnv) {
      addExtractedCodeBlock({ id, content });
    } else {
      mathTable.push({ id, content });
    }
    const placeholder = isCodeEnv ? `<<${id}>>` : `{${id}}`;
    str = str.slice(0, startPos) + str.slice(startPos, beginMarkerPos) + placeholder + str.slice(endMarkerPos + endMarker.length);
    str = getSubMath(str, startPos);
  }
  return str;
};

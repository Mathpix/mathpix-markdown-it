import { getContent } from './common';
import {findEndMarkerPos} from "../../mdPluginRaw";

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
  let cellM: Array<string> =  sub.slice(i).match(/(?:\{\{([\w]*)\}\})/g);
  cellM =  cellM ? cellM : sub.slice(i).match(/(?:\{([\w]*)\})/g);
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

export const getSubMath = (str: string): string => {
  const match: RegExpMatchArray = str
    .match(/(?:\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\})/);
  if (match) {
    let startMathPos: number = match.index + match[0].length;
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
      endMarker = `\\end{${match[1]}}`;
    } else if (match[0] === "$$") {
      endMarker = match[0];
    } else if (match[0] === "$") {
      endMarker = match[0];
    }

    const endMarkerPos = findEndMarkerPos(str, endMarker, startMathPos);
    if (endMarkerPos === -1) {
      return str;
    }
    if (match[0] === "$" || match[0] === "$$") {
      const beforeEndMarker = str.charCodeAt(endMarkerPos - 1);
      if ( beforeEndMarker === 0x5c /* \ */ ||
          (match.index > 0 && str.charCodeAt(match.index - 1)=== 0x5c /* \ */)
      ) {
        return str;
      }
      if (match[0] === "$") {
        const afterStartMarker = str.charCodeAt(match.index + 1)
        if ( beforeEndMarker  === 0x20 /* space */ ||
             beforeEndMarker  === 0x09 /* \t */ ||
             beforeEndMarker  === 0x0a /* \n */ ||
             afterStartMarker === 0x20 /* space */ ||
             afterStartMarker === 0x09 /* \t */ ||
             afterStartMarker === 0x0a /* \n */
        ) {
          return str;
        }
      }
      // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
      const suffix = str.charCodeAt(endMarkerPos+1);
      if (suffix >= 0x30 && suffix < 0x3a) {
        return str;
      }
    }
    const nextPos: number = endMarkerPos + endMarker.length;

    const content: string = str.slice(match.index, nextPos);

    const id: string = `f${(+new Date +  (Math.random()*100000).toFixed()).toString()}`;
    mathTable.push({id: id, content: content});
    str = str.slice(0, match.index) + `{${id}}` + str.slice(endMarkerPos + endMarker.length);
    str = getSubMath(str);
  }
  return str;
};

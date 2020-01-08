import { MarkdownIt } from 'markdown-it';
import { isSpace } from './common';
import { resetCounter } from './mdPluginText';
import {openTag as openTagTabular, closeTag as closeTagTabular} from "./md-block-rule/begin-tabular";

export default (md: MarkdownIt) => {
  md.core.ruler.after('normalize', 'separateForBlock', state => {
    resetCounter();
    const pickTag: RegExp = /\\(?:title\{([^}]*)\}|section\{([^}]*)\}|subsection\{([^}]*)\})/;
    const str: string = state.src;
    const arr: Array<string> = str.split('\n');
    const arr2: Array<string> = [];

    for (let i = 0; i < arr.length; i++) {
      const item: string = arr[i];
      const match: RegExpMatchArray = item.match(pickTag);

      if(!match) {
        arr2.push(arr[i]);
        continue;
      }
      if (match.index === 0 && match[0].length === item.length) {
        arr2.push(arr[i]);
        continue;
      }

      if (match.index === 0 || item.slice(0, match.index).trim() === ''){
        const s2: string = item.slice(0, match[0].length);
        const s3: string = item.slice(match.index+match[0].length, item.length);
        arr2.push(s2);
        arr2.push(s3);
      } else {
        const ch = item.charCodeAt(match.index-1);
        if (isSpace(ch)) {
          const s1: string = item.slice(0, match.index -1);
          const s2: string = item.slice(match.index, item.length);
          const s3: string = item.slice(match.index+match[0].length, item.length);
          arr2.push(s1);
          arr2.push(s2);
          if (s3 && s3.length > 0) {
            arr2.push(s3)
          }
        } else {
          arr2.push(item)
        }
      }
    }
    state.src = arr2.join('\n');
  });

  md.core.ruler.after('normalize', 'separateBeforeBlock', state => {
    const beginTag: RegExp = /\\(?:begin\s{0,}\{(center|left|right|table|figure)\})/;
    let closeTag: RegExp = /\\(?:end\s{0,}\{(center|left|right|table|figure)\})/;
    const endTag = (arg: string): RegExp  => { return new RegExp('\\end\s{0,}\{(' + arg + ')\}')};

    let needSep = false;

    const str: string = state.src;
    const arr: Array<string> = str.split('\n');
    const arr2: Array<string> = [];

    let isOpen: boolean = false;
    let last: string = '';

    let isOpenContent = false;
    let matchB: RegExpMatchArray; //= item.match(beginTag);
    let matchE: RegExpMatchArray; //= item.match(closeTag);
    let isInline: boolean = false;
    for (let i = 0; i < arr.length; i++) {
      const item: string = arr[i];
      if (!isOpenContent) {
        isOpenContent = openTagTabular.test(item);
      }
      if (isOpenContent) {
        if (closeTagTabular.test(item)) {
          isOpenContent = false
        }
      }
      if (isOpenContent) {
        arr2.push(item);
        last = item;
        continue
      }

      if (!matchB) {
        matchB =  item.match(beginTag);
        if (matchB) {
          const str = item.slice(0, matchB.index);
          if (str.indexOf('`') !== -1) {
            matchB = null
          } else {
            const align = matchB[1];
            closeTag = endTag(align);
          }
        }
        isInline = closeTag.test(item)
      }
      if (!matchB) {
        arr2.push(item);
        last = item;
        continue;
      }
      matchE = item.match(closeTag);


      if (matchE) {
        const str = item.slice(matchE.index);
        if (str.indexOf('`') !== -1) {
          matchE = null
        }
      }
      if (!matchE && isOpen) {
        arr2.push(item);
        last = item;
        continue;
      }

      if (matchB && matchE && isInline) {
        isOpen = false;

        if (matchB.index === 0 || item.slice(0, matchB.index).trim() === ''){
          if (last.trim().length > 0) {
            arr2.push('\n');
            if (matchE.index + matchE[0].length < item.length) {
              const s1: string = item.slice(0, matchE.index + matchE[0].length);
              const s2: string = item.slice(matchE.index + matchE[0].length, item.length);
              arr2.push(s1);
              arr2.push('\n');
              arr2.push(s2);
            } else {
              arr2.push(item);
            }
          } else {
            if (matchE.index + matchE[0].length < item.length) {
              const s1: string = item.slice(0, matchE.index + matchE[0].length);
              const s2: string = item.slice(matchE.index + matchE[0].length, item.length);
              arr2.push(s1);
              arr2.push('\n');
              arr2.push(s2);
            } else {
              arr2.push(item);
              if (i+1 < arr.length && arr[i].trim().length > 0) {
                arr2.push('\n');
              }
            }
          }
        } else {
          const s1: string = item.slice(0, matchB.index);
          arr2.push(s1);
          arr2.push('\n');

          if (matchE.index + matchE[0].length < item.length) {
            const s2: string = item.slice(matchB.index, matchE.index + matchE[0].length);
            arr2.push(s2);
            arr2.push('\n');
            const s3: string = item.slice(matchE.index + matchE[0].length, item.length);
            arr2.push(s3);
          } else {
            const s2: string = item.slice(matchB.index);
            arr2.push(s2);
          }

        }
        matchB = null;
        last = item;
        continue;

      }
      if (matchE) {
        isOpen = false;
        if (matchE.index + matchE[0].length < item.length) {
          const s1: string = item.slice(0, matchE.index + matchE[0].length);
          const s2: string = item.slice(matchE.index + matchE[0].length, item.length);
          arr2.push(s1);
          arr2.push('\n');
          arr2.push(s2);
        } else {
          arr2.push(item);
          if (i+1 < arr.length && arr[i+1].trim().length > 0
            && !closeTag.test(arr[i+1]) && arr[i+1].charCodeAt(0) !== 0x60) {
            arr2.push('\n');
          }
        }
        matchB = null;
        matchE = null;
        last = item;
        continue;
      }
      if (matchB) {
        isOpen = true;

        if (matchB.index === 0 || item.slice(0, matchB.index).trim() === ''){
          if (last.trim().length > 0 && last.charCodeAt(0) !== 0x60) {
            arr2.push('\n');
            arr2.push(item);
          } else {
            arr2.push(item);
          }
        } else {
          const s1: string = item.slice(0, needSep ? matchB.index : matchB.index);
          const s2: string = item.slice(matchB.index);
          arr2.push(s1);
          arr2.push('\n');
          arr2.push(s2);
        }
        last = item;
        continue;
      }
      arr2.push(item);
      last = item;
    }
    state.src = arr2.join('\n');
  });
}

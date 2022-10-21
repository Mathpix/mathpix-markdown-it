import { MmlNode } from "mathjax-full/js/core/MmlTree/MmlNode";
import { AMsymbols, getFunction } from "./helperA";

const regW: RegExp = /^\w/;
const regNumber = /^\d+$/;

const isFirstChild = (node) => {
  return node.parent && node.parent.childNodes[0] && node.parent.childNodes[0] === node
};
const isLastChild = (node) => {
  return node.parent && node.parent.childNodes && node.parent.childNodes[node.parent.childNodes.length -1] === node
};

const needFirstSpase = (node) => {
  try {
    if (isFirstChild(node)) {
      return false
    } else {
      const index = node.parent.childNodes.findIndex(item => item === node);
      const prev = node.parent.childNodes[index-1];
      if(prev.kind === 'mi' || prev.kind === 'mo') {
        const text = prev.childNodes[0] ? prev.childNodes[0].text : '';
        return regW.test(text[0])
      } else {
        return false
      }
    }
  } catch (e) {
    return false
  }
};

const needLastSpase = (node) => {
  let haveSpace: boolean = false;
  try {
    if (node.parent.kind === "msubsup") {
      return false
    }
    if (isLastChild(node)) {
      return false
    } else {
      const index = node.parent.childNodes.findIndex(item => item === node);
      let next = node.parent.childNodes[index+1];
      if (next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061' && !isLastChild(next)) {
        next = node.parent.childNodes[index+2];
        haveSpace = true;
      }

      if(next.kind === 'mi' || next.kind === 'mo') {
        const text = next.childNodes[0] ? next.childNodes[0].text : '';
        if (next.childNodes[0] && next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061') {
          return true
        }
        const abs = SymbolToAM(next.kind, text);
        return regW.test(abs)
      } else {
        if (next.kind === 'mrow') {
          return false
        }
        return haveSpace;
      }
    }
  } catch (e) {
    return haveSpace;
  }
};


export const SymbolToAM = (tag: string, output: string, atr = null, showStyle = false, isLogic = false, unicode = false) => {
  let tags = null;
  const atrsNames = atr ? Object.getOwnPropertyNames(atr) : [];
  output = tag !== 'mtext' ? output.split(' ').join('') : output;
  if (showStyle && atr && atrsNames.length > 0) {
    for (let [atname, atval] of Object.entries(atr)) {
      tags = AMsymbols.find(item => (item.tag === "mstyle" && item.atname === atname && item.atval === atval));
      if (tags ) {
        break
      }
    }
    if (tags && tags.input) {
      return tags.input + '(' + output + ')';
    }
  }
  if (!tags) {
    tags = AMsymbols.find(item => {
      if (tag === 'mo' || tag === 'mi') {
        return (item.tag === 'mo' || item.tag === 'mi') && item.output === output
      } else {
        return item.tag === tag && item.output === output
      }
    });
  }

  //need split
  if (!tags && atr && atrsNames.length > 0 && Object.getOwnPropertyNames(atr)&& atr.stretchy === false) {
    const sp = output.split('');
    let res = ''
    for (let i = 0; i < sp.length; i++) {
      let tags = AMsymbols.find(item => {
        if (tag === 'mo' || tag === 'mi') {
          return (item.tag === 'mo' || item.tag === 'mi') && item.output === sp[i]
        } else {
          return item.tag === tag && item.output === sp[i]
        }
      });
      res += i > 0 ? ' ' : '';
      res += tags && tags.input ? tags.input : sp[i];
    }
    return res;
  }

  return isLogic && tags?.text 
    ? tags?.text 
    : unicode && tags?.symbol ? tags?.symbol 
      : tags?.input ? tags.input : output;

};

export const FindSymbolReplace = (str: string) => {
  return str.replace(/\u00A0/g, ' ')
};

export const FindSymbolToAM = (tag: string, output: string, atr = null): string => {
  output = output.split(' ').join('');
  let tags = null;
  if (atr && atr.stretchy) {
    tags = AMsymbols.find(item => {
      if (tag === 'mo' || tag === 'mi') {
        return (item.tag === 'mo' || item.tag === 'mi') && item.output === output && item.stretchy
      } else {
        return item.tag === tag && item.output === output && item.stretchy
      }
    });
  }
  if (!tags) {
    tags = AMsymbols.find(item =>
    {
      if (tag === 'mo' || tag === 'mi') {
        return (item.tag === 'mo' || item.tag === 'mi') && item.output === output
      } else {
        return item.tag === tag && item.output === output
      }
    });
  }
  return tags ? tags.input : '';
};

const getChilrenText = (node): string => {
  let text: string = '';
  try {
    node.childNodes.forEach(child => {
      text += child.text
    });
    return text
  } catch (e) {
    return text
  }
};

const defHandle = (node, serialize) => {
    return handlerApi.handleAll(node, serialize);
};

export const getAttributes = (node: MmlNode) =>{
  return node.attributes.getAllAttributes();
}
;
const menclose = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const atr = getAttributes(node);
      let isLeft = false;
      let isRight = false;
      if (atr && atr.notation) {
        isLeft = atr.notation.toString().indexOf('left') > -1;
        isRight = atr.notation.toString().indexOf('right') > -1;
      }
      mml += isLeft ? '[' : '';
      mml += handlerApi.handleAll(node, serialize);
      if (atr && atr.lcm) {
        mml += ''
      }
      mml += isRight ? ']' : '';
      return mml;
    } catch (e) {
      console.error('mml => menclose =>', e);
      return mml;
    }
  };
};

const mtable = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const parentIsMenclose = node.Parent && node.Parent.kind === 'menclose';
      let openBranch = node.parent?.kind === 'mrow' 
        ? node.parent.properties?.open : '';      
      let closeBranch = node.parent?.kind === 'mrow' 
        ? node.parent.properties?.close : '';
      if (!openBranch && !closeBranch && node.parent?.kind === 'inferredMrow' && node.parent?.childNodes?.length > 1) {
        const sFirst = node.parent.childNodes[0].kind === 'mo' ? serialize.visitNode(node.parent.childNodes[0], '') : '';
        openBranch = sFirst?.trim() === '{' ? '{' : '';
      }
      const display = node.attributes?.attributes?.hasOwnProperty('displaystyle');// && node.prevClass !== 4;
      const isHasBranchOpen = node.parent && node.parent.kind === 'mrow'
        && node.parent.properties
        && node.parent.properties.hasOwnProperty('open') 
        && (node.parent.properties.open === "{" || node.parent.properties.open === "");
      const isHasBranchClose = node.parent && node.parent.kind === 'mrow'
        && node.parent.properties
        && node.parent.properties.hasOwnProperty('close') 
        && (node.parent.properties.close === "}" || node.parent.properties.close === "");
      
      const isNotMatrix = (openBranch === '{' && !closeBranch) 
        || display
        || (!isHasBranchClose && isHasBranchOpen);
      
      mml += isHasBranchOpen || openBranch === "{" ||
      parentIsMenclose
        ? ''
        : '{';
      for (let i = 0; i < node.childNodes.length; i++) {
        node.childNodes[i].isNotMatrix = isNotMatrix;
        if (i > 0) {
          mml += ', '
        }
        mml += serialize.visitNode(node.childNodes[i], '');
      }
      mml += isHasBranchClose || (!isHasBranchClose && isHasBranchOpen) ||
      parentIsMenclose
        ? ''
        : '}';
      return mml;
    } catch (e) {
      console.error('mml => mtable =>', e);
      return mml;
    }
  }
};

const mrow = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const isTexClass7 = node.properties && node.properties.texClass === 7
        && node.parent && node.parent.kind === 'inferredMrow';
      let openBranch = node.properties?.open;
      let closeBranch = node.properties?.close;
      /** In terms of notations, a matrix is an array of numbers enclosed by square brackets
       * while a determinant is an array of numbers enclosed by two vertical bars.
       * */
      if (openBranch === '|' && closeBranch === '|' 
        && node.childNodes.length === 3 && node.childNodes[1]?.kind === 'mtable') {
        mml += ' det(';
        mml += serialize.visitNode(node.childNodes[1], '');
        mml += ')';
        return mml;
      }

      const needBranchOpen = node.properties
        && node.properties.hasOwnProperty('open') && node.properties.open === '';
      const needBranchClose = node.properties
        && node.properties.hasOwnProperty('close') &&  node.properties.close === '';
      mml += isTexClass7 && needBranchOpen
        ? '{'
        : '';
      for (let i = 0; i < node.childNodes.length; i++) {
        mml += serialize.visitNode(node.childNodes[i], '');
      }
      mml += isTexClass7 && needBranchClose
        ? '}' : '';
      if(isTexClass7 && (needBranchClose || needBranchOpen)) {
      }
      return mml;
    } catch (e) {
      console.error('mml => mrow =>', e);
      return mml;
    }
  }
};

const mtr = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const needBranch = node.parent && node.parent.parent && node.parent.parent.texClass === 7;
      const display = node.attributes.get('displaystyle');
      let mtrContent = '';
      let isNotMatrix = node.isNotMatrix;
      for (let i = 0; i < node.childNodes.length; i++) {
        const smd = serialize.visitNode(node.childNodes[i], '');
        let smdBefore = i > 0 ? serialize.visitNode(node.childNodes[i - 1], '') : '';
        smdBefore = smdBefore?.trim();
        if (i > 0) {
          /** Do not put a comma before and after the =, >=, <=, <, > sign */
          const reOperations: RegExp = /^(?:=|>=|<=|<|>)/;
          const hasCommaBefore = smdBefore?.length && smdBefore[smdBefore.length - 1] === ',';
          if (!isNotMatrix) {
            isNotMatrix = Boolean(hasCommaBefore || (smd?.trim()?.match(reOperations) || smdBefore?.match(reOperations)));
          }
          mtrContent += display || hasCommaBefore || (smd?.trim()?.match(reOperations) || smdBefore?.match(reOperations))
            ? ''
            : ', ';
        }
        mtrContent += serialize.visitNode(node.childNodes[i], '');
      }
      mml += !isNotMatrix && (node.parent.childNodes.length > 1 || needBranch || (node.childNodes.length > 1 && !display))
        ? '{' + mtrContent + '}'
        : mtrContent;
      return mml;
    } catch (e) {
      console.error('mml => mtr =>', e);
      return mml;
    }
  }
};

const mpadded = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const mmlAdd = handlerApi.handleAll(node, serialize, mml);
      if (node.Parent && node.Parent.kind === "menclose") {
        const atr = getAttributes(node.Parent);
        if (atr && atr.notation === 'bottom' && atr.lcm) {
          if (!mmlAdd) {
            return ''
          }
        }
      }
      mml += '"';
      mml += mmlAdd;
      mml += '"';
      return mml;
    } catch (e) {
      console.error('mml => mpadded =>', e);
      return mml;
    }
  }
};

const mover = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : '';
      const secondChild = node.childNodes[1] ? node.childNodes[1] : '';
      if (secondChild && secondChild.kind === 'mo') {
        const t = serialize.visitNode(secondChild, '');
        const asc = FindSymbolToAM('mover', t, getAttributes(secondChild));
        
        if (asc) {
          const countDot = (asc.match(/\./g) || []).length;
          /** \dot x
           * x'[t]
           * dx/dt
           * */
          if (countDot > 0) {
            mml += countDot === 1 
              ? "(d/dt)" : `(d^${countDot}/dt^${countDot})`;
            mml += serialize.visitNode(firstChild, '');
            return mml;
          }
          mml += ' ' +asc + '(' ;
          mml += serialize.visitNode(firstChild, '').trim();
          mml += ')';
        } else {
          mml += serialize.visitNode(firstChild, '');
          mml += '^';
          mml += serialize.options.extraBrackets ? '(' : '';
          mml += serialize.visitNode(secondChild, '');
          mml += serialize.options.extraBrackets ? ')' : '';
        }
      } else {
        mml += handlerApi.handleAll(node, serialize);
      }
      return mml;
    } catch (e) {
      console.error('mml => mover =>', e);
      return mml;
    }
  }
};

const munder = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const sFirstChild = firstChild ? serialize.visitNode(firstChild, '') : '';
      const sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
      
      if (sFirstChild?.trim() === 'sum') {
        if (secondChild?.kind === "mi" || sSecondChild?.trim()?.length === 1) {
          mml += 'sum';
          mml += '_(' + sSecondChild + '=1)';
          mml += '^n ';
          return mml;
        }
      }

      if (secondChild && secondChild.kind === 'mo') {
        const t = serialize.visitNode(secondChild, '')
        const asc = FindSymbolToAM(node.kind, t);
        if (asc ) {
          mml += asc + '(';
          mml += serialize.visitNode(firstChild, '');
          mml += ')';
        } else {
          mml += handlerApi.handleAll(node, serialize);
        }
      } else {
        mml += firstChild ? serialize.visitNode(firstChild, '') : '';
        mml += '_';
        mml += serialize.options.extraBrackets ? '(' : '';
        mml += secondChild ? serialize.visitNode(secondChild, '') : '';
        mml += serialize.options.extraBrackets ? ')' : '';
      }
      return mml;
    } catch (e) {
      console.error('mml => munder =>', e);
      return mml;
    }
  }
};

const munderover = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const thirdChild = node.childNodes[2] ? node.childNodes[2] : null;

      mml += firstChild ? serialize.visitNode(firstChild, '') : null;
      mml += '_';
      mml += serialize.options.extraBrackets ? '(' : '';
      mml += secondChild ? serialize.visitNode(secondChild, '') : null;
      mml += serialize.options.extraBrackets ? ')' : '';
      mml += '^';
      mml += serialize.options.extraBrackets ? '(' : '';
      mml += thirdChild ? serialize.visitNode(thirdChild, '') : null;
      mml += serialize.options.extraBrackets ? ')' : '';
      mml += ' ';
      return mml;
    } catch (e) {
      console.error('mml => munderover =>', e);
      return mml;
    }
  }
};

const msub = () => {
  return  (node, serialize) => {
    let mml = '';
    let child = null;
    try {
      let firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      if (firstChild?.kind === "TeXAtom" && firstChild?.childNodes?.length === 1) {
        if (firstChild?.childNodes[0]?.kind === "inferredMrow"
          && firstChild?.childNodes[0].childNodes?.length === 1) {
          child = firstChild?.childNodes[0].childNodes[0];
        }
      }
      if (child?.kind === "mover") {
        const firstChild_ = child.childNodes[0] ? child.childNodes[0] : '';
        const secondChild_ = child.childNodes[1] ? child.childNodes[1] : '';
        const t = serialize.visitNode(secondChild_, '');
        const asc = FindSymbolToAM('mover', t, getAttributes(secondChild_));
        const countDot = (asc.match(/\./g) || []).length;
        if (countDot > 0) {
          mml += countDot === 1 ? "(d" : `(d^${countDot}`;
          mml += "(";
          mml += serialize.visitNode(firstChild_, '');
          mml += '_';
          mml += serialize.options.extraBrackets || secondChild?.kind === "mi" ? '(' : '';
          mml += secondChild ? serialize.visitNode(secondChild, '') : '';
          mml += serialize.options.extraBrackets || secondChild?.kind === "mi" ? ')' : '';
          mml += ")";
          mml += countDot === 1 ? "/dt)" : `/dt^${countDot})`;
          return mml;
        }
      }
      
      const sFirstChild = firstChild ? serialize.visitNode(firstChild, '') : '';
      mml += sFirstChild;
      let sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
      
      mml += '_';
      if (sFirstChild === "lim" && sSecondChild.indexOf("rightarrow") !== -1) {
        sSecondChild = sSecondChild.replace(/rightarrow/g, 'to')
      }
      if (sSecondChild?.trim() 
        && node.parent?.kind !== "mfrac"
        && (sFirstChild?.trim()?.length === 1 || sFirstChild?.trim() === "lim" || sFirstChild?.trim() === "log") 
        && (regNumber.test(sSecondChild) || 
          (["i", "j"].includes(sSecondChild.trim()) 
            && sFirstChild?.trim()?.length === 1
          )
        )) {
        mml += sSecondChild;
        mml += " ";
      } else {
        mml += serialize.options.extraBrackets || secondChild?.kind === "mi" 
          || node.parent?.kind === "mfrac"
        || (secondChild?.kind === "TeXAtom" && regW.test(sSecondChild)) ? '(' : '';
        mml += sSecondChild;
        mml += serialize.options.extraBrackets || secondChild?.kind === "mi" 
          || node.parent?.kind === "mfrac"
        || (secondChild?.kind === "TeXAtom" && regW.test(sSecondChild)) ? ')' : '';
      }

      return mml;
    } catch (e) {
      console.error('mml => msub =>', e);
      return mml;
    }
  }
};

const msup = () =>  {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const sFirstChild = firstChild ? serialize.visitNode(firstChild, '') : '';
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';

      if ((firstChild?.kind === "mi" && !regW.test(sFirstChild)) || firstChild?.kind === "mfrac") {
        mml += "(";
        mml += serialize.visitNode(firstChild, '');
        mml += ")";
      } else {
        mml += sFirstChild;
      }
      
      /** u^{\prime} should be u' */
      const countPrime = (
        sSecondChild.match(/'/g) 
        ||sSecondChild.match(/\u2032/g) 
        || []).length;
      if (countPrime > 0) {
        for (let i = 0; i < countPrime; i++) {
          mml += "'";
        }
        mml += ' ';
        return mml;
      }
      
      switch (sSecondChild) {
        case "\u2218":
          mml += " ";
          mml += "\u00B0"; //degrees °
          mml += " ";
          break;
        case "prime":
          mml += "'";
          break;
        default:
          mml += '^';
          mml += serialize.options.extraBrackets ? '(' : '';
          mml += sSecondChild;
          mml += serialize.options.extraBrackets ? ')' : '';
      }
      mml += ' ';
      return mml;
    } catch (e) {
      console.error('mml => msup =>', e);
      return mml;
    }
  }
};


const msubsup = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
      
      if (firstChild?.kind === 'mo') {
        const sFirstChild = serialize.visitNode(firstChild, '');
        
        if (sFirstChild?.trim() === 'int') {
            mml += sFirstChild?.trim();
            mml += '_';
            mml += secondChild ? serialize.visitNode(secondChild, ''): '';
            mml += '^';
            mml += thirdChild ? serialize.visitNode(thirdChild, '') : '';
            mml += ' ';
            return mml;
        }
      }

      const sSecondChild = secondChild ? serialize.visitNode(secondChild, ''): '';
      mml += firstChild ? serialize.visitNode(firstChild, '') : '';
      mml += '_';
      
      if (sSecondChild?.trim() && ["i", "j"].includes(sSecondChild.trim())) {
        mml += sSecondChild
      } else {
        mml += '(';
        mml += secondChild ? serialize.visitNode(secondChild, ''): '';
        mml += ')';
      }
      mml += '^';
      mml += '(';
      mml += thirdChild ? serialize.visitNode(thirdChild, '') : '';
      mml += ')';
      return mml;
    } catch (e) {
      console.error('mml => msubsup =>', e);
      return mml;
    }
  }
};
//\sqrt{expression}
const msqrt = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
        mml += 'sqrt';
        mml += serialize.visitNode(firstChild, '');
      return mml;
    } catch (e) {
      console.error('mml => msqrt =>', e);
      return mml;
    }
  }
};

/** For latex: \sqrt[n]{x} it should be x^(1/n)
 *  For latex: \sqrt[n+i]{x+y} it should be (x+y)^(1/(n+i))
 * */
const mroot = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
      if (sSecondChild === "2") {
        mml += 'sqrt';
        mml += '(';
        mml += firstChild ? serialize.visitNode(firstChild, '') : '';
        mml += ')';
        return mml;
      }
      
      mml += '(';
      mml += firstChild ? serialize.visitNode(firstChild, '') : '';
      mml += ')';
      
      mml += '^';
      mml += '(1/';
      if (secondChild && secondChild.kind === "mrow" && secondChild.childNodes.length > 1) {
        mml += '(';
        mml += sSecondChild;
        mml += ')';
      } else {
        mml += sSecondChild;
      }
      mml += ')';
      return mml;
    } catch (e) {
      console.error('mml => mroot =>', e);
      return mml;
    }
  }
};


const mfrac = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const sFirstChild = firstChild ? serialize.visitNode(firstChild, '') : '';
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
      if ((firstChild && firstChild.kind === "mrow" && firstChild.childNodes.length > 1) || serialize.options.extraBrackets) {
        mml += '(';
        mml += sFirstChild.trim();
        mml += ')';
      } else {
        mml += sFirstChild.trim();
      }
      mml += '/';

      if ((secondChild && secondChild.kind === "mrow" && secondChild.childNodes.length > 1)|| serialize.options.extraBrackets) {
        mml += '(';
        mml += sSecondChild.trim();
        mml += ')';
      } else {
        mml += sSecondChild.trim();
      }
      return mml;
    } catch (e) {
      console.error('mml => mfrac =>', e);
      return mml;
    }
  }
};

const mtext = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      if (!node.childNodes || node.childNodes.length === 0 ) {
        return mml;
      }
      const firstChild: any = node.childNodes[0];
      const value = FindSymbolReplace(firstChild.text);
      const asc = FindSymbolToAM(node.kind, value);
      if (asc) {
        mml += asc;
        return mml;
      }
      if (value[0] === '(') {
        mml += value;
      } else {
        if ( !value || ( value && !value.trim())) {
          mml += ''
        } else {
          mml += value;
        }
      }
      return mml;
    } catch (e) {
      console.error('mml => mtext =>', e);
      return mml;
    }
  }
};

const mi = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      if (!node.childNodes || node.childNodes.length === 0) {
        return mml;
      }
      const firstChild: any = node.childNodes[0];
      const value = firstChild.text;
      const atr = serialize.options.showStyle
        ? getAttributes(node)
        : null;

      let abs = SymbolToAM(node.kind, value, atr, false, serialize.isLogic, serialize.options.unicode);
      if (abs && abs.length > 1 && regW.test(abs[0])) {
        let sFunction = abs?.trim() ? getFunction(abs.trim()) : "";
        mml += needFirstSpase(node) ? ' ' : '';
        mml += abs;
        mml += needLastSpase(node) && !sFunction ? ' ' : '';
      } else {
        mml += abs ;
      }
      return mml;
    } catch (e) {
      console.error('mml => mi =>', e);
      return mml;
    }
  }
};

//<mo> -- operator, fence, separator or accent
const mo = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const value = getChilrenText(node);
      if (value === '\u2061') {
        return mml;
      }
      const atr = getAttributes(node);
      let abs = SymbolToAM(node.kind, value, atr, serialize.options.showStyle, serialize.isLogic, serialize.options.unicode);
      if (abs && abs.length > 1) {
        mml += regW.test(abs[0]) && needFirstSpase(node) ? ' ' : '';
        mml += abs;
        mml += regW.test(abs[abs.length-1]) && needLastSpase(node) ? ' ' : '';
      } else {
        mml += abs ;
      }
      
      if (node.Parent && node.Parent.kind === "mpadded" && node.Parent.Parent && node.Parent.Parent.kind === "menclose") {
        const atr = getAttributes(node.Parent.Parent);
        if ( atr.notation && atr.notation.toString().indexOf("bottom") !== -1) {
          node.Parent.Parent.attributes.attributes.lcm = true;
          return '';
        }
      }
      
      if (abs === 'int') {
        mml += ' ';
      }
      return mml;
    } catch (e) {
      console.error('mml => mo =>', e);
      return mml;
    }
  }
};

const mspace = (handlerApi) => {
  return (node, serialize) => {
    let mml = '';
    try {
      const atr = getAttributes(node);
      if (atr && atr.width === "2em") {
        mml += ', ,';
        return mml;
      }
      if (atr && atr.width === "1em") {
        mml += ',';
        return mml;
      }
      mml += handlerApi.handleAll(node, serialize, mml);
      return mml;
    } catch (e) {
      console.error('mml => mspace =>', e);
      return mml;
    }
  }
};

export const handle = (node, serialize) => {
  const handler = handlers[node.kind] || defHandle;

  return handler(node, serialize)
};

const  handleAll = (node, serialize, mml='') => {
  for (const child of node.childNodes) {
    mml += serialize.visitNode(child, '');
  }
  return mml;
};


const handlerApi = {
  handle: handle,
  handleAll: handleAll
};

const handlers = {
  mi:     mi(),
  mo:     mo(),
  mn:     mo(),
  mfrac:  mfrac(),
  msup:   msup(),
  msub:   msub(),
  msubsup:   msubsup(),
  msqrt:  msqrt(handlerApi),
  mover:  mover(handlerApi),
  munder:  munder(handlerApi),
  munderover:  munderover(),
  mspace: mspace(handlerApi),
  mtext:  mtext(),
  mtable:  mtable(),
  mrow:  mrow(),
  mtr:  mtr(),
  mpadded: mpadded(handlerApi),
  mroot: mroot(),
  menclose:  menclose(handlerApi),
};

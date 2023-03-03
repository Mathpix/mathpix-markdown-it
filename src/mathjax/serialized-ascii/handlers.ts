import { MmlNode, TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { AMsymbols, eSymbolType } from "./helperA";
import { envArraysShouldBeFlattenInTSV } from "../../helpers/consts";

const regW: RegExp = /^\w/;

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

export const getSymbolType = (tag: string, output: string) => {
  const tags = AMsymbols.find(item => (item.tag === tag && item.output === output));
  return tags ? tags.symbolType : ''
};

export const SymbolToAM = (tag: string, output: string, atr = null, showStyle = false) => {
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

  return tags ? tags.input : output

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

const getNodeFromRow = (node) => {
  if (node.childNodes.length === 1 && (
    node.childNodes[0].isKind('inferredMrow') || node.childNodes[0].isKind('TeXAtom'))) {
    node = getNodeFromRow(node.childNodes[0]);
  }
  return node;
};

const getDataForVerticalMath = (serialize, node, rowNumber) => {
  let mtdNode = getNodeFromRow(node);
  let res = {
    collChildrenCanBeVerticalMath: true,
    startedFromMathOperation: false,
    mmlCollVerticalMath: '',
    mathOperation: ''
  };
  for (let k = 0; k < mtdNode.childNodes.length; k++) {
    const child = mtdNode.childNodes[k];
    /** The element is wrapped in curly braces:
     *  e.g. {\times 1}*/
    if (child.isKind('inferredMrow') || child.isKind('TeXAtom')) {
      const data: any = getDataForVerticalMath(serialize, child, rowNumber);
      if (!data.collChildrenCanBeVerticalMath) {
        res.collChildrenCanBeVerticalMath = false;
      }
      if (data.startedFromMathOperation) {
        res.startedFromMathOperation = true;
      }
      if (data.mathOperation) {
        res.mathOperation = data.mathOperation;
      }
      res.mmlCollVerticalMath += data.mmlCollVerticalMath;
      continue;
    }
    const mmlChild = serialize.visitNode(child, '');
    const text = getChilrenText(child);
    if (child.kind === 'mo') {
      const symbolType = getSymbolType('mo', text);
      if (symbolType === eSymbolType.logical 
        || symbolType === eSymbolType.relation 
        || symbolType === eSymbolType.arrow) {
        res.collChildrenCanBeVerticalMath = false;
      }
    }
    if (!child.isKind('mstyle')) {
      if (k === 0 && child.kind === 'mo' && rowNumber > 0) {
        const text = getChilrenText(child);
        if (text === '+' || text === '-'
          || text === '\u2212' //"-"
          || text === '\u00D7' //times
          || text === '\u00F7' //div
        ) {
          res.mathOperation = mmlChild;
          res.startedFromMathOperation = true;
        }
      }
      res.mmlCollVerticalMath += mmlChild === '","' ? ',' : mmlChild;
    }
  }
  return res;
};

const mtable = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      /** MathJax: <mrow> came from \left...\right
       *   so treat as subexpression (TeX class INNER). */
      const isSubExpression = node.parent?.texClass === TEXCLASS.INNER;
      const parentIsMenclose = node.Parent?.kind === 'menclose';
      const countRow = node.childNodes.length;
      const toTsv = serialize.options.tableToTsv && !serialize.options.isSubTable
        && (node.Parent?.kind === 'math' || (parentIsMenclose && node.Parent.Parent?.kind === 'math'));
      node.attributes.setInherited('toTsv', toTsv);  
      const columnAlign = node.attributes.get('columnalign');
      const arrRowLines = node.attributes.isSet('rowlines') ? node.attributes.get('rowlines').split(' ') : [];
      const envName = node.attributes.get('name');
      /** Check if a table is enclosed in brackets */
      const isHasBranchOpen = node.parent && node.parent.kind === 'mrow' && node.parent.properties?.hasOwnProperty('open');
      const isHasBranchClose = node.parent && node.parent.kind === 'mrow' && node.parent.properties?.hasOwnProperty('close');
      const thereAreBracketsIn_parent = (isHasBranchOpen && node.parent.properties['open'])
        || (isHasBranchClose && node.parent.properties['close']);
      const thereAreBracketsIn_Parent = parentIsMenclose && node.Parent.Parent?.isKind('mrow') 
        && ((node.Parent.Parent.properties?.hasOwnProperty('open') && node.Parent.Parent.properties['open'])
          || (node.Parent.Parent.properties?.hasOwnProperty('close') && node.Parent.Parent.properties['close']));
      /** It is a matrix or system of equations with brackets */
      const isMatrixOrSystemOfEquations = thereAreBracketsIn_parent || thereAreBracketsIn_Parent;
      const itShouldBeFlatten = envArraysShouldBeFlattenInTSV.includes(envName) 
        && !isHasBranchOpen && !isHasBranchClose && !parentIsMenclose;
      /** Vertical math:
       * \begin{array}{r} and it should not be a matrix and not a system of equations */
      let isVerticalMath = columnAlign === 'right' && !isMatrixOrSystemOfEquations;
      const arrRows = [];
      let startedFromMathOperation = false;
      for (let i = 0; i < countRow; i++) {
        const mtrNode = node.childNodes[i];
        mtrNode.attributes.setInherited('toTsv', toTsv);
        mtrNode.attributes.setInherited('itShouldBeFlatten', itShouldBeFlatten);
        let mmlRow = '';
        let mmlRowVerticalMath = '';
        let mathOperation = '';
        const countColl = mtrNode.childNodes?.length;
        /** It's EqnArray or AmsEqnArray or AlignAt.
         *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
        const isEqnArrayRow = mtrNode.attributes.get('displaystyle');
        
        for (let j = 0; j < countColl; j++) {
          if (j > 0 && !isEqnArrayRow) {
            mmlRow += toTsv ? serialize.options.tsv_separators?.column || '\t'
              : itShouldBeFlatten ? ', ' : ',';
          }
          let mtdNode = mtrNode.childNodes[j];
          let mmlColl = serialize.visitNode(mtdNode, '');
          let mmlCollVerticalMath = '';
          if (isVerticalMath) {
            const dataColl = getDataForVerticalMath(serialize, mtdNode, i);
            mmlCollVerticalMath = dataColl.mmlCollVerticalMath;
            if (dataColl.startedFromMathOperation) {
              startedFromMathOperation = true;
              mathOperation = dataColl.mathOperation;
            }
            if (!dataColl.collChildrenCanBeVerticalMath) {
              isVerticalMath = false;
            }
          }
          mmlRow += !toTsv && itShouldBeFlatten ? mmlColl.trimEnd() : mmlColl;
          mmlRowVerticalMath += mmlCollVerticalMath;
        }

        /** For vertical math, if the horizontal line is in front of the answer, then replace it with an equals sign */
        if (isVerticalMath && 
          arrRowLines?.length && arrRowLines?.length > i && arrRowLines[i] !== 'none') {
          mmlRowVerticalMath += '=';
        }
        if (toTsv || itShouldBeFlatten) {
          arrRows.push({
            mmlRow: mmlRow,
            mmlRowVerticalMath: mmlRowVerticalMath,
            mathOperation: mathOperation,
            encloseToSquareBrackets: false
          });
          continue;
        }
        /** It's EqnArray or AmsEqnArray or AlignAt.
         *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
        const isEqnArray = mtrNode.attributes?.get('displaystyle');
        arrRows.push({
          mmlRow: mmlRow,
          mmlRowVerticalMath: mmlRowVerticalMath,
          mathOperation: mathOperation,
          encloseToSquareBrackets: countRow > 1 || isSubExpression || (countColl > 1 && !isEqnArray)
        });
      }
      
      /** If none of the row starts with math operation (+, -, times)
       * then it can't be vertical math */
      if (!startedFromMathOperation) {
        isVerticalMath = false;
      }
      /** Check for the need to set mathematical operations before each line */
      if (isVerticalMath && arrRows.length > 2) {
        let mathOperation = '';
        for (let i = arrRows.length - 1; i >= 0; i--) {
          if (arrRows[i].mathOperation) {
            mathOperation = arrRows[i].mathOperation;
            continue
          }
          if (mathOperation && i > 0) {
            arrRows[i].mmlRowVerticalMath = mathOperation + arrRows[i].mmlRowVerticalMath;
          }
        }
      }
      let mmlTableContent = '';
      for (let i = 0; i < arrRows.length; i++) {
        if (i > 0 && !isVerticalMath) {
          mmlTableContent += toTsv
            ? serialize.options.tsv_separators?.row || '\n'
            : itShouldBeFlatten ? ', ' : ',';
        }
        let mmlRow = isVerticalMath 
          ? arrRows[i].mmlRowVerticalMath 
          : arrRows[i].mmlRow;
        mmlTableContent += arrRows[i].encloseToSquareBrackets && !isVerticalMath
          ? '[' + mmlRow + ']'
          : mmlRow;
      }
      
      if (isVerticalMath) {
        if (node.Parent?.isKind('mrow')) {
          node.Parent.attributes.setInherited('isVerticalMath', true)
        }
        if (node.Parent?.isKind('menclose') && node.Parent?.Parent?.isKind('mrow'))  {
          node.Parent.Parent.attributes.setInherited('isVerticalMath', true)
        }
      }
      
      if (toTsv) {
        mml += '"';
        mml += mmlTableContent;
        mml += '"'
      } else {
        if (itShouldBeFlatten || isVerticalMath) {
          mml += mmlTableContent;
        } else {
          mml += isHasBranchOpen || parentIsMenclose ? '' : '{:';
          mml += mmlTableContent;
          mml += isHasBranchClose || parentIsMenclose ? '' : ':}';
        }
      }
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
      const isTexClass7 = node.properties && node.properties.texClass === TEXCLASS.INNER
        && node.parent && node.parent.kind === 'inferredMrow';
      const needBranchOpen = node.properties
        && node.properties.hasOwnProperty('open') && node.properties.open === '';
      const needBranchClose = node.properties
        && node.properties.hasOwnProperty('close') &&  node.properties.close === '';
      let mmlContent = '';
      for (let i = 0; i < node.childNodes.length; i++) {
        mmlContent += serialize.visitNode(node.childNodes[i], '');
      }
      const isVerticalMath = node.attributes.get('isVerticalMath');
      mml += isTexClass7 && needBranchOpen && !isVerticalMath
        ? '{:'
        : '';
      mml += mmlContent;
      mml += isTexClass7 && needBranchClose && !isVerticalMath
        ? ':}' : '';
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
      /** It's EqnArray or AmsEqnArray or AlignAt.
       *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
      const isEqnArray = node.attributes.get('displaystyle');
      const toTsv = node.attributes.get('toTsv');
      const itShouldBeFlatten = node.attributes.get('itShouldBeFlatten');
      for (let i = 0; i < node.childNodes.length; i++) {
        if (i > 0 && !isEqnArray) {
          mml += toTsv ? serialize.options.tsv_separators?.column || '\t' 
              : itShouldBeFlatten ? ', ' : ',';
        }
        let mmlCell = serialize.visitNode(node.childNodes[i], '');
        mml += !toTsv && itShouldBeFlatten ? mmlCell?.trimEnd() : mmlCell;
      }
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
      /** For tsv:
       * Omit the " in nested arrays
       * */
      mml += serialize.options.tableToTsv ? '' : '"';
      mml += mmlAdd;
      mml += serialize.options.tableToTsv ? '' : '"';
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
        if (asc ) {
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
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      mml += firstChild ? serialize.visitNode(firstChild, '') : '';
      mml += '_';
      mml += serialize.options.extraBrackets ? '(' : '';
      mml += secondChild ? serialize.visitNode(secondChild, '') : '';
      mml += serialize.options.extraBrackets ? ')' : '';
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
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;

      mml += firstChild ? serialize.visitNode(firstChild, '') : '';
      mml += '^';
      mml += serialize.options.extraBrackets ? '(' : '';
      mml += secondChild ? serialize.visitNode(secondChild, '') : '';
      mml += serialize.options.extraBrackets ? ')' : '';
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

      mml += firstChild ? serialize.visitNode(firstChild, '') : '';
      mml += '_';
      mml += '(';
      mml += secondChild ? serialize.visitNode(secondChild, ''): '';
      mml += ')';
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

const mroot = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      mml += 'root';
      mml += secondChild ? '(' + serialize.visitNode(secondChild, '') + ')' : '';
      mml += firstChild ? '(' + serialize.visitNode(firstChild, '') + ')' : '';
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
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      if ((firstChild && firstChild.kind === "mrow" && firstChild.childNodes.length > 1) || serialize.options.extraBrackets) {
        mml += '(';
        mml += serialize.visitNode(firstChild, '');
        mml += ')';
      } else {
        mml += serialize.visitNode(firstChild, '');
      }
      mml += '/';

      if ((secondChild && secondChild.kind === "mrow" && secondChild.childNodes.length > 1)|| serialize.options.extraBrackets) {
        mml += '(';
        mml += serialize.visitNode(secondChild, '');
        mml += ')';
      } else {
        mml += serialize.visitNode(secondChild, '');
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
      let value = FindSymbolReplace(firstChild.text);
      const asc = FindSymbolToAM(node.kind, value);
      if (asc) {
        mml += asc;
        return mml;
      }
      const toTsv = node.attributes.get('toTsv');
      if (value[0] === '(' || toTsv) {
        if (toTsv) {
          value = value.replace(/"/g, '')
        }
        mml += value;
      } else {
        if ( !value || ( value && !value.trim())) {
          mml += ''
        } else {
          /** For tsv: 
           * Omit the " in nested arrays */
          if (serialize.options.tableToTsv) {
            mml += value.replace(/"/g, '');
          } else {
            mml += '"' + value + '"';
          }
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

      let abs = SymbolToAM(node.kind, value, atr);
      if (abs && abs.length > 1 && regW.test(abs[0])) {
        mml += needFirstSpase(node) ? ' ' : '';
        mml += abs;
        mml += needLastSpase(node) ? ' ' : '';
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

const mo = () => {
  return  (node, serialize) => {
    let mml = '';
    try {
      const value = getChilrenText(node);
      if (value === '\u2061') {
        return mml;
      }
      const atr = getAttributes(node);
      let abs = SymbolToAM(node.kind, value, atr, serialize.options.showStyle);
      if (abs && abs.length > 1) {
        mml += regW.test(abs[0]) && needFirstSpase(node) ? ' ' : '';
        mml += abs;
        mml += regW.test(abs[abs.length-1]) && needLastSpase(node) ? ' ' : '';
      } else {
        if (abs === ',' && node.Parent.kind === 'mtd') {
          /** For tsv:
           * Omit the " in nested arrays */
          mml += serialize.options.tableToTsv ? '' : '"';
          mml += abs;
          mml += serialize.options.tableToTsv ? '' : '"';
        } else {
          mml += abs === '"' && serialize.options.tableToTsv ? '' : abs ;
        }
      }
      
      if (node.Parent && node.Parent.kind === "mpadded" && node.Parent.Parent && node.Parent.Parent.kind === "menclose") {
        const atr = getAttributes(node.Parent.Parent);
        if ( atr.notation && atr.notation.toString().indexOf("bottom") !== -1) {
          node.Parent.Parent.attributes.attributes.lcm = true;
          return '';
        }
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
        mml += node.parent.parent && needFirstSpase(node.parent.parent) ? ' ' : '';
        mml += 'qquad';
        mml += node.parent.parent && needLastSpase(node.parent.parent) ? ' ' : '';
        return mml;
      }
      if (atr && atr.width === "1em") {
        mml += node.parent.parent && needFirstSpase(node.parent.parent) ? ' ' : '';
        mml += 'quad';
        mml += node.parent.parent && needLastSpase(node.parent.parent) ? ' ' : '';
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

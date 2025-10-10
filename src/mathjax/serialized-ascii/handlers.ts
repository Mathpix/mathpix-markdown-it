import { MmlNode, TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { AMsymbols, eSymbolType, findAmSymbolByTag, findAmSymbolByTagStretchy, regExpIsFunction } from "./helperA";
import { envArraysShouldBeFlattenInTSV } from "../../helpers/consts";
import { IAsciiData, AddToAsciiData, getFunctionNameFromAscii, hasOnlyOneMoNode, initAsciiData } from "./common";
import {
  findAmSymbolsToLiner,
  findRootSymbol,
  needsParensForFollowingDivision,
  needBrackets
} from "./halperLiner";
import { isFirstChild, isLastChild } from "./node-utils";

const regW: RegExp = /^\w/;

export const needFirstSpaceBeforeTeXAtom = (node) => {
  if (isFirstChild(node)) {
    return false;
  }
  if (node.kind === 'TeXAtom' && node.properties?.texClass === TEXCLASS.OP) {
    const index = node.parent.childNodes.findIndex(item => item === node);
    const prev = node.parent.childNodes[index-1];
    if (prev.kind !== 'mi') {
      return false;
    }
    return true;
  }
  return false;
};

export const needLastSpaceAfterTeXAtom = (node) => {
  if (isLastChild(node)) {
    return false;
  }
  if (node.kind === 'TeXAtom' && node.properties?.texClass === TEXCLASS.OP) {
    const index = node.parent.childNodes.findIndex(item => item === node);
    let next = node.parent.childNodes[index+1];
    if (next.kind !== 'mi' && next.kind !== 'msub') {
      return false;
    }
    return true;
  }
  return false;
};


export const needFirstSpace = (node, isLiner = false) => {
  try {
    if (isFirstChild(node)) {
      return false
    } else {
      const index = node.parent.childNodes.findIndex(item => item === node);
      const prev = node.parent.childNodes[index-1];
      const hasLastSpace = prev.attributes.get('hasLastSpace');
      if (hasLastSpace) {
        return false;
      }
      if(prev.kind === 'mi' || (prev.kind === 'mo' && !isLiner)) {
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

const needLastSpace = (node, isFunction = false) => {
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
      if (next.kind === 'TeXAtom' && next.properties?.texClass === TEXCLASS.OP) {
        return true;
      }
      if (isFunction && next.kind === 'mfrac') {
        //For a function and a fractional argument, parentheses are added around the argument and this does not require adding a space after the function
        return false;
      }
      if (next.kind === 'mi' || next.kind === 'mo') {
        const text = next.childNodes[0] ? next.childNodes[0].text : '';
        if (next.childNodes[0] && next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061') {
          return true
        }
        const data = SymbolToAM(next.kind, text);
        return regW.test(data.ascii)
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
      return {
        ascii: tags.input + '(' + output + ')',
        liner: tags.output + '(' + output + ')'
      };
    }
  }
  if (!tags) {
    tags = findAmSymbolByTag(tag, output);
  }

  //need split
  if (!tags && atr && atrsNames.length > 0 && Object.getOwnPropertyNames(atr)&& atr.stretchy === false) {
    const sp = output.split('');
    let res = '';
    let res_liner = '';
    for (let i = 0; i < sp.length; i++) {
      let tags = findAmSymbolByTag(tag, sp[i]);
      res += i > 0 ? ' ' : '';
      res_liner += i > 0 ? ' ' : '';
      res += tags && tags.input ? tags.input : sp[i];
      res_liner += tags && tags.output
        ? tags.output_liner
          ? tags.output_liner
          : tags.output
        : sp[i];
    }
    return {
      ascii: res,
      liner: res_liner
    };
  }
  return {
    ascii: tags ? tags.input : output,
    liner: tags
      ? tags.output_liner
        ? tags.output_liner
        : tags.output
      : output
  };
};

export const FindSymbolReplace = (str: string) => {
  return str.replace(/\u00A0/g, ' ')
};

export const FindSymbolToAM = (tag: string, output: string, atr = null): {
  ascii: string,
  liner: string
} => {
  output = output.split(' ').join('');
  let tags = null;
  if (atr && atr.stretchy) {
    tags = findAmSymbolByTagStretchy(tag, output);
  }
  if (!tags) {
    tags = findAmSymbolByTag(tag, output);
  }
  return {
    ascii: tags ? tags.input : '',
    liner: tags
      ? tags.output_liner
        ? tags.output_liner
        : tags.output
      : output
  }
};

const getChildrenText = (node): string => {
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

const defHandle = (node, serialize): IAsciiData => {
    return handlerApi.handleAll(node, serialize);
};

export const getAttributes = (node: MmlNode) =>{
  return node.attributes.getAllAttributes();
};

const menclose = (handlerApi) => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const atr = getAttributes(node);
      let isLeft = false;
      let isRight = false;
      if (atr && atr.notation) {
        isLeft = atr.notation.toString().indexOf('left') > -1;
        isRight = atr.notation.toString().indexOf('right') > -1;
      }
      res = AddToAsciiData(res, {
        ascii: isLeft ? '[' : '',
        liner: ''
      });
      const data: IAsciiData = handlerApi.handleAll(node, serialize);
      res = AddToAsciiData(res, data);
      if (atr && atr.lcm) {
        res = AddToAsciiData(res, { ascii: '', liner: '' });
      }
      res = AddToAsciiData(res, {
        ascii: isRight ? ']' : '',
        liner: ''
      });
      return res;
    } catch (e) {
      console.error('mml => menclose =>', e);
      return res;
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
    mmlCollVerticalMath_liner: '',
    mathOperation: ''
  };
  let parenthesisLinerOpen: boolean = false;
  for (let k = 0; k < mtdNode.childNodes.length; k++) {
    if (parenthesisLinerOpen) {
      res.mmlCollVerticalMath_liner += ')';
      parenthesisLinerOpen = false;
    }
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
      res.mmlCollVerticalMath_liner += data.mmlCollVerticalMath_liner;
      continue;
    }
    const data: IAsciiData = serialize.visitNode(child, '');
    const text = getChildrenText(child);
    if (child?.kind === "mfrac"
      && (res.mmlCollVerticalMath_liner?.trim() && needsParensForFollowingDivision(res.mmlCollVerticalMath_liner)
      || needBrackets(serialize, child))
    ) {
      res.mmlCollVerticalMath_liner += '(';
      parenthesisLinerOpen = true;
    }
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
        const text = getChildrenText(child);
        if (text === '+' || text === '-'
          || text === '\u2212' //"-"
          || text === '\u00D7' //times
          || text === '\u00F7' //div
        ) {
          res.mathOperation = data.ascii;
          res.startedFromMathOperation = true;
        }
      }
      res.mmlCollVerticalMath += data.ascii === '","' ? ',' : data.ascii;
      res.mmlCollVerticalMath_liner += data.liner === '","' ? ',' : data.liner;
    }
  }
  if (parenthesisLinerOpen) {
    res.mmlCollVerticalMath_liner += ')';
  }
  return res;
};

const mtable = () => {
  return  (node, serialize): IAsciiData => {
    let mml = '';
    let mml_tsv = '';
    let mml_csv = '';
    let mml_md = '';
    try {
      /** MathJax: <mrow> came from \left...\right
       *   so treat as subexpression (TeX class INNER). */
      const isSubExpression = node.prevClass=== TEXCLASS.INNER;
      const parentIsMenclose = node.Parent?.kind === 'menclose';
      const countRow = node.childNodes.length;
      const toTsv = serialize.options.tableToTsv && !serialize.options.isSubTable
        && (node.Parent?.kind === 'math' || (parentIsMenclose && node.Parent.Parent?.kind === 'math'));      
      const toCsv = serialize.options.tableToCsv && !serialize.options.isSubTable
        && (node.Parent?.kind === 'math' || (parentIsMenclose && node.Parent.Parent?.kind === 'math'));      
      const toMd = serialize.options.tableToMd && !serialize.options.isSubTable
        && (node.Parent?.kind === 'math' || (parentIsMenclose && node.Parent.Parent?.kind === 'math'));
      node.attributes.setInherited('toTsv', toTsv);  
      node.attributes.setInherited('toCsv', toCsv);  
      node.attributes.setInherited('toMd', toMd);  
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
        mtrNode.attributes.setInherited('toCsv', toCsv);
        mtrNode.attributes.setInherited('toMd', toMd);
        mtrNode.attributes.setInherited('itShouldBeFlatten', itShouldBeFlatten);
        let mmlRow = '';
        let mmlRow_liner = '';
        let mmlRow_tsv = '';
        let mmlRow_csv = '';
        let mmlRow_md = '';
        let mmlRowVerticalMath = '';
        let mmlRowVerticalMath_liner = '';
        let mathOperation = '';
        const countColl = mtrNode.childNodes?.length;
        /** It's EqnArray or AmsEqnArray or AlignAt.
         *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
        const isEqnArrayRow = mtrNode.attributes.get('displaystyle');
        
        for (let j = 0; j < countColl; j++) {
          if (j > 0 && !isEqnArrayRow) {
            mmlRow += ',';
            mmlRow_liner += ' ';
            mmlRow_tsv += toTsv ? serialize.options.tsv_separators?.column || '\t' : itShouldBeFlatten ? ', ' : ',';
            mmlRow_csv += toCsv ? serialize.options.csv_separators?.column || ',' : itShouldBeFlatten ? ', ' : ',';
            mmlRow_md += toMd ? serialize.options.md_separators?.column || ' ' : itShouldBeFlatten ? ', ' : ',';
          }
          let mtdNode = mtrNode.childNodes[j];
          let { ascii = '', liner = '', ascii_tsv = '', ascii_csv = '', ascii_md = '' }: IAsciiData = serialize.visitNode(mtdNode, '');
          
          let mmlCollVerticalMath = '';
          let mmlCollVerticalMath_liner = '';
          if (isVerticalMath) {
            const dataColl = getDataForVerticalMath(serialize, mtdNode, i);
            mmlCollVerticalMath = dataColl.mmlCollVerticalMath;
            mmlCollVerticalMath_liner = dataColl.mmlCollVerticalMath_liner;
            if (dataColl.startedFromMathOperation) {
              startedFromMathOperation = true;
              mathOperation = dataColl.mathOperation;
            }
            if (!dataColl.collChildrenCanBeVerticalMath) {
              isVerticalMath = false;
            }
          }
          mmlRow += ascii;
          mmlRow_liner += liner;
          mmlRow_tsv += !toTsv && itShouldBeFlatten ? ascii_tsv.trimEnd() : ascii_tsv;
          mmlRow_csv += !toCsv && itShouldBeFlatten ? ascii_csv.trimEnd() : ascii_csv;
          mmlRow_md += !toMd && itShouldBeFlatten ? ascii_md.trimEnd() : ascii_md;
          mmlRowVerticalMath += mmlCollVerticalMath;
          mmlRowVerticalMath_liner += mmlCollVerticalMath_liner;
        }

        /** For vertical math, if the horizontal line is in front of the answer, then replace it with an equals sign */
        if (isVerticalMath && 
          arrRowLines?.length && arrRowLines?.length > i && arrRowLines[i] !== 'none') {
          mmlRowVerticalMath += '=';
          mmlRowVerticalMath_liner += '=';
        }
        /** It's EqnArray or AmsEqnArray or AlignAt.
         *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
        const isEqnArray = mtrNode.attributes?.get('displaystyle');
        arrRows.push({
          mmlRow: mmlRow,
          mmlRow_liner: mmlRow_liner,
          mmlRow_tsv: mmlRow_tsv,
          mmlRow_csv: mmlRow_csv,
          mmlRow_md: mmlRow_md,
          mmlRowVerticalMath: mmlRowVerticalMath,
          mmlRowVerticalMath_liner: mmlRowVerticalMath_liner,
          mathOperation: mathOperation,
          encloseToSquareBrackets: countRow > 1 || isSubExpression || (countColl > 1 && !isEqnArray),
          toTsv: toTsv,
          toCsv: toCsv,
          toMd: toMd,
          itShouldBeFlatten: itShouldBeFlatten
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
            arrRows[i].mmlRowVerticalMath_liner = mathOperation + arrRows[i].mmlRowVerticalMath_liner;
          }
        }
      }
      let mmlTableContent = '';
      let mmlTableContent_liner = '';
      let mmlTableContent_tsv = '';
      let mmlTableContent_csv = '';
      let mmlTableContent_md = '';
      for (let i = 0; i < arrRows.length; i++) {
        if (i > 0 && !isVerticalMath) {
          mmlTableContent += ',';
          mmlTableContent_liner += ' ';
          mmlTableContent_tsv += toTsv
            ? serialize.options.tsv_separators?.row || '\n'
            : itShouldBeFlatten ? ', ' : ',';          
          mmlTableContent_csv += toCsv 
              ? serialize.options.csv_separators?.row || '\n'
              : itShouldBeFlatten ? ', ' : ',';          
          mmlTableContent_md += toMd 
              ? serialize.options.md_separators?.row || ' <br> '
              : itShouldBeFlatten ? ', ' : ',';
        }
        let mmlRow = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow;
        let mmlRow_liner = isVerticalMath ? arrRows[i].mmlRowVerticalMath_liner : arrRows[i].mmlRow_liner;
        let mmlRow_tsv = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_tsv;
        let mmlRow_csv = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_csv;
        let mmlRow_md = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_md;
        mmlTableContent += arrRows[i].encloseToSquareBrackets && !isVerticalMath
            ? '[' + mmlRow + ']'
            : mmlRow;
        mmlTableContent_liner += mmlTableContent_liner && !isVerticalMath ? '\n' : '';
        mmlTableContent_liner += mmlRow_liner;
        mmlTableContent_tsv += arrRows[i].encloseToSquareBrackets
          && !arrRows[i].itShouldBeFlatten && !arrRows[i].toTsv && !isVerticalMath
            ? '[' + mmlRow_tsv + ']'
            : mmlRow_tsv;        
        mmlTableContent_csv += arrRows[i].encloseToSquareBrackets
          && !arrRows[i].itShouldBeFlatten && !arrRows[i].toCsv && !isVerticalMath
            ? '[' + mmlRow_csv + ']'
            : mmlRow_csv;        
        mmlTableContent_md += arrRows[i].encloseToSquareBrackets
          && !arrRows[i].itShouldBeFlatten && !arrRows[i].toMd && !isVerticalMath
            ? '[' + mmlRow_md + ']'
            : mmlRow_md;
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
        mml_tsv += '"' + mmlTableContent_tsv + '"';
      } else {
        if (itShouldBeFlatten || isVerticalMath) {
          mml_tsv += mmlTableContent_tsv;
        } else {
          mml_tsv += isHasBranchOpen || parentIsMenclose ? '' : '{:';
          mml_tsv += mmlTableContent_tsv;
          mml_tsv += isHasBranchClose || parentIsMenclose ? '' : ':}';
        }
      }
      if (toCsv) {
        mml_csv += mmlTableContent_csv;
      } else {
        if (itShouldBeFlatten || isVerticalMath) {
          mml_csv += mmlTableContent_csv;
        } else {
          mml_csv += isHasBranchOpen || parentIsMenclose ? '' : '{:';
          mml_csv += mmlTableContent_csv;
          mml_csv += isHasBranchClose || parentIsMenclose ? '' : ':}';
        }
      }      
      if (toMd) {
        mml_md += mmlTableContent_md;
      } else {
        if (itShouldBeFlatten || isVerticalMath) {
          mml_md += mmlTableContent_md;
        } else {
          mml_md += isHasBranchOpen || parentIsMenclose ? '' : '{:';
          mml_md += mmlTableContent_md;
          mml_md += isHasBranchClose || parentIsMenclose ? '' : ':}';
        }
      }
      
      if (isVerticalMath) {
        mml += mmlTableContent;
      } else {
        mml += isHasBranchOpen || parentIsMenclose ? '' : '{:';
        mml += mmlTableContent;
        mml += isHasBranchClose || parentIsMenclose ? '' : ':}';
      }
      return {
        ascii: mml,
        liner: mmlTableContent_liner,
        ascii_tsv: mml_tsv,
        ascii_csv: mml_csv,
        ascii_md: mml_md,
      }
    } catch (e) {
      console.error('mml => mtable =>', e);
      return {
        ascii: mml,
        liner: mml,
        ascii_tsv: mml_tsv,
        ascii_csv: mml_csv,
        ascii_md: mml_md,
      }
    }
  }
};

const mrow = () => {
  return (node, serialize): IAsciiData => {
    try {
      const isTexClass7 = node.properties && node.properties.texClass === TEXCLASS.INNER
        && node.parent && node.parent.kind === 'inferredMrow';
      const needBranchOpen = node.properties
        && node.properties.hasOwnProperty('open') && node.properties.open === '';
      const needBranchClose = node.properties
        && node.properties.hasOwnProperty('close') &&  node.properties.close === '';
      let mmlContent = '';
      let mmlContent_liner = '';
      let mmlContent_tsv = '';
      let mmlContent_csv = '';
      let mmlContent_md = '';

      let beforeAscii: string = '';
      let childBefore = null;
      let parenthesisOpen: boolean = false;
      for (let i = 0; i < node.childNodes.length; i++) {
        const data: IAsciiData = serialize.visitNode(node.childNodes[i], '');
        if (parenthesisOpen) {
          let text: string = getFunctionNameFromAscii(data.ascii, node.childNodes[i]);
          if (!text || regExpIsFunction.test(text)) {
            mmlContent += ')';
            mmlContent_liner += ')';
            mmlContent_tsv += ')';
            mmlContent_csv += ')';
            mmlContent_md += ')';
            parenthesisOpen = false;
          }
        }
        if (node.childNodes[i].kind === "mfrac" && beforeAscii?.trim()) {
          if (regExpIsFunction.test(beforeAscii.trim()) || (childBefore?.kind === 'mo' && childBefore?.texClass === -1)) {
            mmlContent += '(';
            mmlContent_liner += '(';
            mmlContent_tsv += '(';
            mmlContent_csv += '(';
            mmlContent_md += '(';
            parenthesisOpen = true;
          }
        }
        mmlContent += data.ascii;
        mmlContent_liner += data.liner;
        mmlContent_tsv += data.ascii_tsv;
        mmlContent_csv += data.ascii_csv;
        mmlContent_md += data.ascii_md;
        beforeAscii = mmlContent;
        childBefore = node.childNodes[i];
      }
      if (parenthesisOpen) {
        mmlContent += ')';
        mmlContent_liner += ')';
        mmlContent_tsv += ')';
        mmlContent_csv += ')';
        mmlContent_md += ')';
      }
      const isVerticalMath = node.attributes.get('isVerticalMath');
      let open = isTexClass7 && needBranchOpen && !isVerticalMath ? '{:' : '';
      let close = isTexClass7 && needBranchClose && !isVerticalMath ? ':}' : '';
      return {
        ascii: open + mmlContent + close,
        // liner: open + mmlContent_liner + close,
        liner: mmlContent_liner,
        ascii_tsv: open + mmlContent_tsv + close,
        ascii_csv: open + mmlContent_csv + close,
        ascii_md: open + mmlContent_md + close,
      }
    } catch (e) {
      console.error('mml => mrow =>', e);
      return initAsciiData();
    }
  }
};

const mtr = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      /** It's EqnArray or AmsEqnArray or AlignAt.
       *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
      const isEqnArray = node.attributes.get('displaystyle');
      const toTsv = node.attributes.get('toTsv');
      const toCsv = node.attributes.get('toCsv');
      const toMd = node.attributes.get('toMd');
      const itShouldBeFlatten = node.attributes.get('itShouldBeFlatten');
      for (let i = 0; i < node.childNodes.length; i++) {
        if (i > 0 && !isEqnArray) {
          res = AddToAsciiData(res, {
            ascii: ',',
            liner: ' ',
            ascii_tsv: toTsv ? serialize.options.tsv_separators?.column || '\t' : itShouldBeFlatten ? ', ' : ',',
            ascii_csv: toCsv ? serialize.options.csv_separators?.column || ',' : itShouldBeFlatten ? ', ' : ',',
            ascii_md: toMd ? serialize.options.md_separators?.column || ' ' : itShouldBeFlatten ? ', ' : ',',
          });
        }
        let {ascii = '', liner = '', ascii_tsv = '', ascii_csv = '', ascii_md = ''}: IAsciiData = serialize.visitNode(node.childNodes[i], '');
        res = AddToAsciiData(res, {
          ascii: ascii,
          liner: liner,
          ascii_tsv: !toTsv && itShouldBeFlatten ? ascii_tsv?.trimEnd() : ascii_tsv,
          ascii_csv: !toCsv && itShouldBeFlatten ? ascii_csv?.trimEnd() : ascii_csv,
          ascii_md: !toMd && itShouldBeFlatten ? ascii_md?.trimEnd() : ascii_md,
      });
      }
      return res;
    } catch (e) {
      console.error('mml => mtr =>', e);
      return res;
    }
  }
};

const mpadded = (handlerApi) => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const mmlAdd: IAsciiData = handlerApi.handleAll(node, serialize);
      if (node.Parent && node.Parent.kind === "menclose") {
        const atr = getAttributes(node.Parent);
        if (atr && atr.notation === 'bottom' && atr.lcm) {
          if (!mmlAdd || !mmlAdd.ascii) {
            return res;
          }
        }
      }
      /** For tsv/csv:
       * Omit the " in nested arrays
       * */
      res = AddToAsciiData(res, {
        ascii: '"',
        liner: '"',
        ascii_tsv: serialize.options.tableToTsv ? '' : '"',
        ascii_csv: '',
        ascii_md: ''
      });
      res = AddToAsciiData(res, mmlAdd);
      res = AddToAsciiData(res, {
        ascii: '"',
        liner: '"',
        ascii_tsv: serialize.options.tableToTsv ? '' : '"',
        ascii_csv: '',
        ascii_md: ''
      });
      return res;
    } catch (e) {
      console.error('mml => mpadded =>', e);
      return res;
    }
  }
};

const mover = (handlerApi) => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : '';
      const secondChild = node.childNodes[1] ? node.childNodes[1] : '';
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      if (secondChild && secondChild.kind === 'mo') {
        const t = dataSecondChild.ascii;
        const data = FindSymbolToAM('mover', t, getAttributes(secondChild));
        if (data.ascii) {
          let liner = findAmSymbolsToLiner(data.liner);
          if (liner) {
            liner = dataFirstChild?.liner?.trim() + liner
          }
          res = AddToAsciiData(res, { ascii: ' ', liner: ' ' });
          res = AddToAsciiData(res, {
            ascii: data.ascii,
            liner: liner ? '' : data.liner,
          });
          res = AddToAsciiData(res, {
            ascii: '(',
            liner: dataFirstChild?.liner?.trim()?.length > 1  ? '(' : '',
          });
          res = AddToAsciiData(res, {
            ascii: dataFirstChild? dataFirstChild.ascii ? dataFirstChild.ascii.trim() : dataFirstChild.ascii : '',
            liner: liner ? liner : dataFirstChild ? dataFirstChild.liner ? dataFirstChild.liner.trim() : dataFirstChild.liner : '',
            ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv ? dataFirstChild.ascii_tsv.trim() : dataFirstChild.ascii_tsv : '',
            ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv ? dataFirstChild.ascii_csv.trim() : dataFirstChild.ascii_csv : '',
            ascii_md: dataFirstChild ? dataFirstChild.ascii_md ? dataFirstChild.ascii_md.trim() : dataFirstChild.ascii_md : '',
          });
          res = AddToAsciiData(res, {
            ascii: ')',
            liner: dataFirstChild?.liner?.trim()?.length > 1  ? ')' : ''
          });
        } else {
          res = AddToAsciiData(res, {
            ascii: dataFirstChild ? dataFirstChild.ascii : '',
            liner: dataFirstChild ? dataFirstChild.liner : '',
            ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
            ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
            ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
          });
          res = AddToAsciiData(res, {ascii: '^', liner: '^'});
          res = AddToAsciiData(res, {
            ascii: serialize.options.extraBrackets ? '(' : '',
            liner: dataSecondChild?.liner?.length ? '(' : '',
          });
          res = AddToAsciiData(res, {
            ascii: dataSecondChild ? dataSecondChild.ascii : '',
            liner: dataSecondChild ? dataSecondChild.liner : '',
            ascii_tsv: dataSecondChild ? dataSecondChild.ascii_tsv : '',
            ascii_csv: dataSecondChild ? dataSecondChild.ascii_csv : '',
            ascii_md: dataSecondChild ? dataSecondChild.ascii_md : ''
          });
          res = AddToAsciiData(res, {
            ascii: serialize.options.extraBrackets ? ')' : '',
            liner: dataSecondChild?.liner?.length ? ')' : '',
          });
        }
      } else {
        const data: IAsciiData = handlerApi.handleAll(node, serialize);
        res = AddToAsciiData(res, data);
      }
      return res;
    } catch (e) {
      console.error('mml => mover =>', e);
      return res;
    }
  }
};

const munder = (handlerApi) => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      if (secondChild && secondChild.kind === 'mo') {
        const t = dataSecondChild.ascii;
        const data = FindSymbolToAM(node.kind, t);
        if (data.ascii) {
          res = AddToAsciiData(res, {
            ascii: data.ascii + '(',
            liner: data.liner + '('
          });
          res = AddToAsciiData(res, {
            ascii: dataFirstChild ? dataFirstChild.ascii : '',
            liner: dataFirstChild ? dataFirstChild.liner : '',
            ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
            ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
            ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
          });
          res = AddToAsciiData(res, {
            ascii: data.ascii + ')',
            liner: data.liner + ')'
          });
        } else {
          const data: IAsciiData = handlerApi.handleAll(node, serialize);
          res = AddToAsciiData(res, data);
        }
      } else {
        res = AddToAsciiData(res, {
          ascii: dataFirstChild ? dataFirstChild.ascii : '',
          liner: dataFirstChild ? dataFirstChild.liner : '',
          ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
          ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
          ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
        });
        res = AddToAsciiData(res, {ascii: '_', liner: '_'});
        res = AddToAsciiData(res, {
          ascii: serialize.options.extraBrackets ? '(' : '',
          liner: serialize.options.extraBrackets ? '(' : '',
        });
        res = AddToAsciiData(res, {
          ascii: dataSecondChild ? dataSecondChild.ascii : '',
          liner: dataSecondChild ? dataSecondChild.liner : '',
          ascii_tsv: dataSecondChild ? dataSecondChild.ascii_tsv : '',
          ascii_csv: dataSecondChild ? dataSecondChild.ascii_csv : '',
          ascii_md: dataSecondChild ? dataSecondChild.ascii_md : ''
        });
        res = AddToAsciiData(res, {
          ascii: serialize.options.extraBrackets ? ')' : '',
          liner: serialize.options.extraBrackets ? ')' : '',
        });
      }
      return res;
    } catch (e) {
      console.error('mml => munder =>', e);
      return res;
    }
  }
};

const munderover = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      const dataThirdChild: IAsciiData = thirdChild ? serialize.visitNode(thirdChild, '') : null;
      res = AddToAsciiData(res, {
        ascii: dataFirstChild.ascii ? dataFirstChild.ascii : '',
        liner: dataFirstChild.liner ? dataFirstChild.liner : '',
        ascii_tsv: dataFirstChild.ascii_tsv ? dataFirstChild.ascii_tsv : '',
        ascii_csv: dataFirstChild.ascii_csv ? dataFirstChild.ascii_csv : '',
        ascii_md: dataFirstChild.ascii_md ? dataFirstChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {ascii: '_', liner: '_'});
      res = AddToAsciiData(res, {
        ascii: serialize.options.extraBrackets ? '(' : '',
        liner: serialize.options.extraBrackets ? '(' : '',
      });
      res = AddToAsciiData(res, {
        ascii: dataSecondChild.ascii ? dataSecondChild.ascii : '',
        liner: dataSecondChild.liner ? dataSecondChild.liner : '',
        ascii_tsv: dataSecondChild.ascii_tsv ? dataSecondChild.ascii_tsv : '',
        ascii_csv: dataSecondChild.ascii_csv ? dataSecondChild.ascii_csv : '',
        ascii_md: dataSecondChild.ascii_md ? dataSecondChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {
        ascii: serialize.options.extraBrackets ? ')' : '',
        liner: serialize.options.extraBrackets ? ')' : '',
      });
      res = AddToAsciiData(res, {ascii: '^', liner: '^'});
      res = AddToAsciiData(res, {
        ascii: serialize.options.extraBrackets ? '(' : '',
        liner: serialize.options.extraBrackets ? '(' : '',
      });
      res = AddToAsciiData(res, {
        ascii: dataThirdChild.ascii ? dataThirdChild.ascii : '',
        liner: dataThirdChild.liner ? dataThirdChild.liner : '',
        ascii_tsv: dataThirdChild.ascii_tsv ? dataThirdChild.ascii_tsv : '',
        ascii_csv: dataThirdChild.ascii_csv ? dataThirdChild.ascii_csv : '',
        ascii_md: dataThirdChild.ascii_md ? dataThirdChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {
        ascii: serialize.options.extraBrackets ? ')' : '',
        liner: serialize.options.extraBrackets ? ')' : '',
      });
      return res;
    } catch (e) {
      console.error('mml => munderover =>', e);
      return res;
    }
  }
};

const msub = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      res = AddToAsciiData(res, {
        ascii: dataFirstChild ? dataFirstChild.ascii : '',
        liner: dataFirstChild ? dataFirstChild.liner : '',
        ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
        ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
        ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {ascii: '_', liner: '_'});
      res = AddToAsciiData(res, {
        ascii: serialize.options.extraBrackets ? '(' : '',
        liner: dataSecondChild?.liner?.length > 1 ? '(' : '',
      });
      res = AddToAsciiData(res, {
        ascii: dataSecondChild ? dataSecondChild.ascii : '',
        liner: dataSecondChild ? dataSecondChild.liner : '',
        ascii_tsv: dataSecondChild ? dataSecondChild.ascii_tsv : '',
        ascii_csv: dataSecondChild ? dataSecondChild.ascii_csv : '',
        ascii_md: dataSecondChild ? dataSecondChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {
        ascii: serialize.options.extraBrackets ? ')' : '',
        liner: dataSecondChild?.liner?.length > 1 ? ')' : '',
      });
      return res;
    } catch (e) {
      console.error('mml => msub =>', e);
      return res;
    }
  }
};

const msup = () =>  {
  return (node, serialize): IAsciiData => {
    let res : IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      let flattenSup: boolean = hasOnlyOneMoNode(secondChild);
      secondChild.attributes.setInherited('flattenSup', flattenSup);
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      res = AddToAsciiData(res, {
        ascii: dataFirstChild ? dataFirstChild.ascii : '',
        liner: dataFirstChild ? dataFirstChild.liner : '',
        ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
        ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
        ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {ascii: '^', liner: '^'});
      const ignoreBrackets = node.attributes.get('ignoreBrackets');
      if (ignoreBrackets && !dataSecondChild.ascii) {
        return res;
      }
      res = AddToAsciiData(res, {
        ascii: serialize.options.extraBrackets ? '(' : '',
        liner: dataSecondChild.liner?.length > 1 ? '(' : '',
      });
      res = AddToAsciiData(res, {
        ascii: dataSecondChild ? dataSecondChild.ascii : '',
        liner: dataSecondChild ? dataSecondChild.liner : '',
        ascii_tsv: dataSecondChild ? dataSecondChild.ascii_tsv : '',
        ascii_csv: dataSecondChild ? dataSecondChild.ascii_csv : '',
        ascii_md: dataSecondChild ? dataSecondChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {
        ascii: serialize.options.extraBrackets ? ')' : '',
        liner: dataSecondChild.liner?.length > 1 ? ')' : '',
      });
      return res;
    } catch (e) {
      console.error('mml => msup =>', e);
      return res;
    }
  }
};

const msubsup = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      const dataThirdChild: IAsciiData = thirdChild ? serialize.visitNode(thirdChild, '') : null;
      res = AddToAsciiData(res, {
        ascii: dataFirstChild ? dataFirstChild.ascii : '',
        liner: dataFirstChild ? dataFirstChild.liner : '',
        ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
        ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
        ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {ascii: '_', liner: '_'});
      res = AddToAsciiData(res, {
        ascii: '(',
        liner: dataSecondChild?.liner?.length > 1 ? '(' : ''
      });
      res = AddToAsciiData(res, {
        ascii: dataSecondChild ? dataSecondChild.ascii : '',
        liner: dataSecondChild ? dataSecondChild.liner : '',
        ascii_tsv: dataSecondChild ? dataSecondChild.ascii_tsv : '',
        ascii_csv: dataSecondChild ? dataSecondChild.ascii_csv : '',
        ascii_md: dataSecondChild ? dataSecondChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {
        ascii: ')',
        liner: dataSecondChild?.liner?.length > 1 ? ')' : ''
      });
      res = AddToAsciiData(res, {ascii: '^', liner: '^'});
      res = AddToAsciiData(res, {
        ascii: '(',
        liner: dataThirdChild?.liner?.length > 1 ? '(' : ''
      });
      res = AddToAsciiData(res, {
        ascii: dataThirdChild ? dataThirdChild.ascii : '',
        liner: dataThirdChild ? dataThirdChild.liner : '',
        ascii_tsv: dataThirdChild ? dataThirdChild.ascii_tsv : '',
        ascii_csv: dataThirdChild ? dataThirdChild.ascii_csv : '',
        ascii_md: dataThirdChild ? dataThirdChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {
        ascii: ')',
        liner: dataThirdChild?.liner?.length > 1 ? ')' : ''
      });
      return res;
    } catch (e) {
      console.error('mml => msubsup =>', e);
      return res;
    }
  }
};

const msqrt = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      res = AddToAsciiData(res, {
        ascii: 'sqrt',
        liner: '√'
      });
      res = AddToAsciiData(res, {
        ascii: dataFirstChild ? dataFirstChild.ascii : '',
        liner: dataFirstChild ? dataFirstChild.liner : '',
        ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
        ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
        ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
      });
      return res;
    } catch (e) {
      console.error('mml => msqrt =>', e);
      return res;
    }
  }
};

const mroot = () => {
  return (node, serialize): IAsciiData => {
    let res : IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      let liner: string = /^\s*[234]\s*$/.test(dataSecondChild.liner)
        ? findRootSymbol(Number(dataSecondChild.liner))
        : '';
      res = AddToAsciiData(res, {
        ascii: 'root',
        liner: liner ? liner : 'root'
      });
      res = AddToAsciiData(res, {
        ascii: secondChild ? '(' : '',
        liner: liner ? '' : secondChild ? '(' : '',
      });
      res = AddToAsciiData(res, {
        ascii: dataSecondChild ? dataSecondChild.ascii : '',
        liner: liner ? '' : dataSecondChild ? dataSecondChild.liner : '',
        ascii_tsv: dataSecondChild ? dataSecondChild.ascii_tsv : '',
        ascii_csv: dataSecondChild ? dataSecondChild.ascii_csv : '',
        ascii_md: dataSecondChild ? dataSecondChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {
        ascii: secondChild ? ')' : '',
        liner: liner ? '' : secondChild ? ')' : '',
      });
      res = AddToAsciiData(res, {
        ascii: firstChild ? '(' : '',
        liner: dataFirstChild.liner?.length > 1 ? '(' : '',
      });
      res = AddToAsciiData(res, {
        ascii: dataFirstChild ? dataFirstChild.ascii : '',
        liner: dataFirstChild ? dataFirstChild.liner : '',
        ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
        ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
        ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
      });
      res = AddToAsciiData(res, {
        ascii: firstChild ? ')' : '',
        liner: dataFirstChild.liner?.length > 1 ? ')' : '',
      });
      return res;
    } catch (e) {
      console.error('mml => mroot =>', e);
      return res;
    }
  }
};

const mfrac = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      if ((firstChild && firstChild.kind === "mrow" && firstChild.childNodes.length > 1) || serialize.options.extraBrackets) {
        res = AddToAsciiData(res, {
          ascii: '(',
          liner: dataFirstChild.liner?.length > 1 ? '(' : ''
        });
        res = AddToAsciiData(res, {
          ascii: dataFirstChild ? dataFirstChild.ascii : '',
          liner: dataFirstChild ? dataFirstChild.liner : '',
          ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
          ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
          ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
        });
        res = AddToAsciiData(res, {
          ascii: ')',
          liner: dataFirstChild.liner?.length > 1 ? ')' : ''
        });
      } else {
        res = AddToAsciiData(res, {
          ascii: dataFirstChild ? dataFirstChild.ascii : '',
          liner: dataFirstChild ? dataFirstChild.liner : '',
          ascii_tsv: dataFirstChild ? dataFirstChild.ascii_tsv : '',
          ascii_csv: dataFirstChild ? dataFirstChild.ascii_csv : '',
          ascii_md: dataFirstChild ? dataFirstChild.ascii_md : ''
        });
      }
      res = AddToAsciiData(res, {ascii: '/', liner: '/'});

      if ((secondChild && secondChild.kind === "mrow" && secondChild.childNodes.length > 1)|| serialize.options.extraBrackets) {
        res = AddToAsciiData(res, {
          ascii: '(',
          liner: dataSecondChild.liner?.length > 1 ? '(' : ''
        });
        res = AddToAsciiData(res, {
          ascii: dataSecondChild ? dataSecondChild.ascii : '',
          liner: dataSecondChild ? dataSecondChild.liner : '',
          ascii_tsv: dataSecondChild ? dataSecondChild.ascii_tsv : '',
          ascii_csv: dataSecondChild ? dataSecondChild.ascii_csv : '',
          ascii_md: dataSecondChild ? dataSecondChild.ascii_md : ''
        });
        res = AddToAsciiData(res, {
          ascii: ')',
          liner: dataSecondChild.liner?.length > 1 ? ')' : ''
        });
      } else {
        res = AddToAsciiData(res, {
          ascii: dataSecondChild ? dataSecondChild.ascii : '',
          liner: dataSecondChild ? dataSecondChild.liner : '',
          ascii_tsv: dataSecondChild ? dataSecondChild.ascii_tsv : '',
          ascii_csv: dataSecondChild ? dataSecondChild.ascii_csv : '',
          ascii_md: dataSecondChild ? dataSecondChild.ascii_md : ''
        });
      }
      return res;
    } catch (e) {
      console.error('mml => mfrac =>', e);
      return res;
    }
  }
};

const mtext = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      if (!node.childNodes || node.childNodes.length === 0 ) {
        return res;
      }
      const firstChild: any = node.childNodes[0];
      let value = FindSymbolReplace(firstChild.text);
      const data = FindSymbolToAM(node.kind, value);
      if (data.ascii) {
        res = AddToAsciiData(res, {
          ascii: data.ascii,
          liner: data.liner
        });
        return res;
      }
      const toTsv = node.attributes.get('toTsv');
      const toCsv = node.attributes.get('toCsv');
      const toMd = node.attributes.get('toMd');
      if (value[0] === '(' || toTsv || toCsv || toMd) {
        res = AddToAsciiData(res, {
          ascii: value[0] === '(' ? value.replace(/"/g, '') : value,
          liner: value[0] === '(' ? value.replace(/"/g, '') : value,
          ascii_tsv: toTsv ? value.replace(/"/g, '') : value,
          ascii_csv: toCsv ? value.replace(/"/g, '') : value,
          ascii_md: value
        });
      } else {
        if ( !value || ( value && !value.trim())) {
          res = AddToAsciiData(res, {ascii: '', liner: ''});
        } else {
          /** For tsv/csv: 
           * Omit the " in nested arrays */
          res = AddToAsciiData(res, {
            ascii: '"' +value + '"',
            // liner: '"' +value + '"',
            liner: value,
            ascii_tsv: serialize.options.tableToTsv
              ? value.replace(/"/g, '')
              : '"' + value + '"',
            ascii_csv: serialize.options.tableToCsv
              ? value.replace(/"/g, '')
              : value,
            ascii_md: value
          });
        }
      }
      return res;
    } catch (e) {
      console.error('mml => mtext =>', e);
      return res;
    }
  }
};

const mi = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      if (!node.childNodes || node.childNodes.length === 0) {
        return res;
      }
      const firstChild: any = node.childNodes[0];
      const value = firstChild.text;
      const atr = serialize.options.showStyle
        ? getAttributes(node)
        : null;
      let data = SymbolToAM(node.kind, value, atr);
      if (data.ascii && data.ascii.length > 1 && regW.test(data.ascii[0])) {
        const isFunction = regExpIsFunction.test(data.ascii.trim());
        if (isFunction) {
          node.Parent.attributes.setInherited('isFunction', isFunction);
        }
        res = AddToAsciiData(res, {
          ascii: needFirstSpace(node) ? ' ' : '',
          liner: needFirstSpace(node, true) ? ' ' : ''
        });
        res = AddToAsciiData(res, {
          ascii: data.ascii,
          liner: data.liner || data.ascii
        });
        const hasLastSpace = needLastSpace(node, isFunction);
        node.attributes.setInherited('hasLastSpace', hasLastSpace);
        res = AddToAsciiData(res, {
          ascii: hasLastSpace ? ' ' : '',
          liner: hasLastSpace ? ' ' : ''
        });
      } else {
        res = AddToAsciiData(res, {
          ascii: data.ascii,
          liner: data.liner || data.ascii
        });
      }
      return res;
    } catch (e) {
      console.error('mml => mi =>', e);
      return res;
    }
  }
};

const mo = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const value = getChildrenText(node);
      const flattenSup = node.attributes.get('flattenSup');
      if (flattenSup && value === '\u2227' /*wedge*/) {
        node.Parent.attributes.setInherited('ignoreBrackets', true);
        return res;
      }
      if (value === '\u2061') {
        return res;
      }
      const atr = getAttributes(node);
      let data = SymbolToAM(node.kind, value, atr, serialize.options.showStyle);
      if (data.ascii && data.ascii.length > 1) {
        res = AddToAsciiData(res, {
          ascii: regW.test(data.ascii[0]) && needFirstSpace(node) ? ' ' : '',
          liner: regW.test(data.ascii[0]) && needFirstSpace(node) ? ' ' : ''
        });
        res = AddToAsciiData(res, {
          ascii: data.ascii,
          liner: data.liner || data.ascii
        });
        const isNeedLastSpace = needLastSpace(node);
        const hasLastSpace = regW.test(data.ascii[data.ascii.length-1]) && isNeedLastSpace;
        const hasLastSpaceLiner = regW.test(data.liner[data.liner.length-1]) && isNeedLastSpace;
        node.attributes.setInherited('hasLastSpace', hasLastSpace);
        res = AddToAsciiData(res, {
          ascii: hasLastSpace ? ' ' : '',
          liner: hasLastSpaceLiner ? ' ' : ''
        });
      } else {
        if (data.ascii === "―" && node.Parent.kind === "munder") {
          data.ascii = "_";
        }
        if (data.ascii === ',' && (node.Parent.kind === 'mtd' || (node.Parent.kind === 'TeXAtom' && node.Parent.Parent.kind === 'mtd'))) {
          /** For tsv/csv:
           * Omit the " in nested arrays */
          res = AddToAsciiData(res, {
            ascii: '"' + data.ascii + '"',
            liner: data.liner || data.ascii,
            ascii_tsv: `${serialize.options.tableToTsv ? data.ascii : '"' + data.ascii + '"'}`,
            ascii_csv: data.ascii,
            ascii_md: data.ascii
        });
        } else {
          res = AddToAsciiData(res, {
            ascii: data.ascii,
            liner: data.liner || data.ascii,
            ascii_tsv: data.ascii === '"' ? '' : data.ascii,
            ascii_csv: data.ascii === '"' ? '' : data.ascii,
            ascii_md: data.ascii
        });
        }
      }
      
      if (node.Parent && node.Parent.kind === "mpadded" && node.Parent.Parent && node.Parent.Parent.kind === "menclose") {
        const atr = getAttributes(node.Parent.Parent);
        if ( atr.notation && atr.notation.toString().indexOf("bottom") !== -1) {
          node.Parent.Parent.attributes.attributes.lcm = true;
          return initAsciiData();
        }
      }
      return res;
    } catch (e) {
      console.error('mml => mo =>', e);
      return res;
    }
  }
};

const mspace = (handlerApi) => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = initAsciiData();
    try {
      const atr = getAttributes(node);
      if (atr && atr.width === "2em") {
        res = AddToAsciiData(res, {
          ascii: node.parent.parent && needFirstSpace(node.parent.parent) ? ' ' : '',
          liner: node.parent.parent && needFirstSpace(node.parent.parent) ? ' ' : ''
        });
        res = AddToAsciiData(res, {ascii: 'qquad', liner: '  '});
        if (node.parent?.parent) {
          const hasLastSpace = needLastSpace(node.parent.parent);
          node.parent.parent.attributes.setInherited('hasLastSpace', hasLastSpace);
          res = AddToAsciiData(res, {
            ascii: hasLastSpace ? ' ' : '',
            liner: hasLastSpace ? ' ' : ''
          });
        }
        return res;
      }
      if (atr && atr.width === "1em") {
        res = AddToAsciiData(res, {
          ascii: node.parent.parent && needFirstSpace(node.parent.parent) ? ' ' : '',
          liner: node.parent.parent && needFirstSpace(node.parent.parent) ? ' ' : ''
        });
        res = AddToAsciiData(res, {ascii: 'quad', liner: ' '});
        if (node.parent?.parent) {
          const hasLastSpace = needLastSpace(node.parent.parent);
          node.parent.parent.attributes.setInherited('hasLastSpace', hasLastSpace);
          res = AddToAsciiData(res, {
            ascii: hasLastSpace ? ' ' : '',
            liner: hasLastSpace ? ' ' : ''
          });
        }
        return res;
      }
      const data: IAsciiData = handlerApi.handleAll(node, serialize);
      res = AddToAsciiData(res, data);
      return res;
    } catch (e) {
      console.error('mml => mspace =>', e);
      return res;
    }
  }
};

export const handle = (node, serialize): IAsciiData => {
  const handler = handlers[node.kind] || defHandle;
  let res: IAsciiData = handler(node, serialize);
  node.currentData = res;
  return res
};

const handleAll = (node, serialize): IAsciiData => {
  let res: IAsciiData = initAsciiData();
  try {
    for (const child of node.childNodes) {
      const data: IAsciiData = serialize.visitNode(child, '');
      res = AddToAsciiData(res, data);
      child.currentData = res;
    }
    node.currentData = res;
    return res;
  } catch (e) {
    console.error('mml => handleAll =>', e);
    return res;
  }
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
  msqrt:  msqrt(),
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

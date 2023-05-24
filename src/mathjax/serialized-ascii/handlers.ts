import { MmlNode, TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { AMsymbols, eSymbolType } from "./helperA";
import { envArraysShouldBeFlattenInTSV } from "../../helpers/consts";
import { IAsciiData, AddToAsciiData } from "./common";

const regW: RegExp = /^\w/;
const regLetter: RegExp = /^[a-zA-Z]/;

const isFirstChild = (node) => {
  return node.parent && node.parent.childNodes[0] && node.parent.childNodes[0] === node
};

const isLastChild = (node) => {
  return node.parent && node.parent.childNodes && node.parent.childNodes[node.parent.childNodes.length -1] === node
};

export const needFirstSpace = (node, currentText, serialize) => {
  try {
    if (isFirstChild(node)) {
      return false
    } else {
      const index = node.parent.childNodes.findIndex(item => item === node);
      let prev = node.parent.childNodes[index-1];
      if (prev.kind === 'mo' && index - 2 >= 0 && getChildrenText(prev) === '\u2061') {
        /** Ignore empty mo node */
        prev = node.parent.childNodes[index-2];
      }
      const lastResAscii = serialize.resAscii?.length 
        ? serialize.resAscii[serialize.resAscii.length-1] 
        : null;
      let lastSymbol = lastResAscii && lastResAscii.res?.ascii?.length
        ? lastResAscii.res?.ascii[lastResAscii.res.ascii.length - 1]
        : '';
      if (((prev.kind === 'mi' || prev.kind === 'mo' ) && currentText?.length > 1 && regW.test(lastSymbol)) 
        ||  prev.texClass === TEXCLASS.OP) {
        if (prev.childNodes[0] && prev.childNodes[0].hasOwnProperty('text') && prev.childNodes[0].text) {
          const text = prev.childNodes[0].text;
          if (currentText?.length) {
            return regW.test(lastSymbol) && regLetter.test(currentText[0])
          }
          return regW.test(text[0]) && regW.test(lastSymbol)
        }
        return regW.test(lastSymbol)
      } else {
        return false
      }
    }
  } catch (e) {
    return false
  }
};

export const needFirstSpaceBeforeCurrentNode = (node, serialize) => {
  try {
    if (isFirstChild(node)) {
      return false
    } else {
      const lastResAscii = serialize.resAscii?.length
        ? serialize.resAscii[serialize.resAscii.length-1]
        : null;
      let lastSymbol = lastResAscii && lastResAscii.res?.ascii?.length
        ? lastResAscii.res?.ascii[lastResAscii.res.ascii.length - 1]
        : '';
      return node.texClass === TEXCLASS.OP && regW.test(lastSymbol);
    }
  } catch (e) {
    return false
  }
};

export const needLastSpace = (node, currentText) => {
  let haveSpace: boolean = false;
  try {
    if (node.parent.kind === "msubsup" || node.parent.kind === "msup") {
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
      if (((next.kind === 'mi' || next.kind === 'mo') && currentText?.length > 1)
        || next.texClass === TEXCLASS.OP) {
        if (next.childNodes[0] && next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061') {
          return true
        }
        const text = next.childNodes[0] && next.childNodes[0].hasOwnProperty('text') ? next.childNodes[0].text : '';
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
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: '',
    };
    try {
      const atr = getAttributes(node);
      let isLeft = false;
      let isRight = false;
      if (atr && atr.notation) {
        isLeft = atr.notation.toString().indexOf('left') > -1;
        isRight = atr.notation.toString().indexOf('right') > -1;
      }
      res = AddToAsciiData(res, [isLeft ? '[' : '']);
      const data: IAsciiData = handlerApi.handleAll(node, serialize);
      res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
      if (atr && atr.lcm) {
        res = AddToAsciiData(res, ['']);
      }
      res = AddToAsciiData(res, [isRight ? ']' : '']);
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
    const data: IAsciiData = serialize.visitNode(child, '');
    const text = getChildrenText(child);
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
    }
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
      const isSubExpression = node.parent?.texClass === TEXCLASS.INNER;
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
        let mmlRow_tsv = '';
        let mmlRow_csv = '';
        let mmlRow_md = '';
        let mmlRowVerticalMath = '';
        let mathOperation = '';
        const countColl = mtrNode.childNodes?.length;
        /** It's EqnArray or AmsEqnArray or AlignAt.
         *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
        const isEqnArrayRow = mtrNode.attributes.get('displaystyle');
        
        for (let j = 0; j < countColl; j++) {
          if (j > 0 && !isEqnArrayRow) {
            mmlRow += ',';
            mmlRow_tsv += toTsv ? serialize.options.tsv_separators?.column || '\t' : itShouldBeFlatten ? ', ' : ',';
            mmlRow_csv += toCsv ? serialize.options.csv_separators?.column || ',' : itShouldBeFlatten ? ', ' : ',';
            mmlRow_md += toMd ? serialize.options.md_separators?.column || ' ' : itShouldBeFlatten ? ', ' : ',';
          }
          let mtdNode = mtrNode.childNodes[j];
          let { ascii = '', ascii_tsv = '', ascii_csv = '', ascii_md = '' }: IAsciiData = serialize.visitNode(mtdNode, '');
          
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
          mmlRow += ascii;
          mmlRow_tsv += !toTsv && itShouldBeFlatten ? ascii_tsv.trimEnd() : ascii_tsv;
          mmlRow_csv += !toCsv && itShouldBeFlatten ? ascii_csv.trimEnd() : ascii_csv;
          mmlRow_md += !toMd && itShouldBeFlatten ? ascii_md.trimEnd() : ascii_md;
          mmlRowVerticalMath += mmlCollVerticalMath;
        }

        /** For vertical math, if the horizontal line is in front of the answer, then replace it with an equals sign */
        if (isVerticalMath && 
          arrRowLines?.length && arrRowLines?.length > i && arrRowLines[i] !== 'none') {
          mmlRowVerticalMath += '=';
        }
        /** It's EqnArray or AmsEqnArray or AlignAt.
         *  eqnarray*, align, align*, split, gather, gather*, aligned, gathered, alignat, alignat*, alignedat */
        const isEqnArray = mtrNode.attributes?.get('displaystyle');
        arrRows.push({
          mmlRow: mmlRow,
          mmlRow_tsv: mmlRow_tsv,
          mmlRow_csv: mmlRow_csv,
          mmlRow_md: mmlRow_md,
          mmlRowVerticalMath: mmlRowVerticalMath,
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
          }
        }
      }
      let mmlTableContent = '';
      let mmlTableContent_tsv = '';
      let mmlTableContent_csv = '';
      let mmlTableContent_md = '';
      for (let i = 0; i < arrRows.length; i++) {
        if (i > 0 && !isVerticalMath) {
          mmlTableContent += ',';          
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
        let mmlRow_tsv = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_tsv;
        let mmlRow_csv = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_csv;
        let mmlRow_md = isVerticalMath ? arrRows[i].mmlRowVerticalMath : arrRows[i].mmlRow_md;
        mmlTableContent += arrRows[i].encloseToSquareBrackets && !isVerticalMath
            ? '[' + mmlRow + ']'
            : mmlRow;        
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
        ascii_tsv: mml_tsv,
        ascii_csv: mml_csv,
        ascii_md: mml_md,
      }
    } catch (e) {
      console.error('mml => mtable =>', e);
      return {
        ascii: mml,
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
      let mmlContent_tsv = '';
      let mmlContent_csv = '';
      let mmlContent_md = '';
      for (let i = 0; i < node.childNodes.length; i++) {
        const data: IAsciiData = serialize.visitNode(node.childNodes[i], '');
        mmlContent += data.ascii;
        mmlContent_tsv += data.ascii_tsv;
        mmlContent_csv += data.ascii_csv;
        mmlContent_md += data.ascii_md;
      }
      const isVerticalMath = node.attributes.get('isVerticalMath');
      let open = isTexClass7 && needBranchOpen && !isVerticalMath ? '{:' : '';
      let close = isTexClass7 && needBranchClose && !isVerticalMath ? ':}' : '';
      return {
        ascii: open + mmlContent + close,
        ascii_tsv: open + mmlContent_tsv + close,
        ascii_csv: open + mmlContent_csv + close,
        ascii_md: open + mmlContent_md + close,
      }
    } catch (e) {
      console.error('mml => mrow =>', e);
      return {
        ascii: '',
        ascii_tsv: '',
        ascii_csv: '',
        ascii_md: '',
      }
    }
  }
};

const mtr = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: '',
    };
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
          res = AddToAsciiData(res, [
            ',',
            toTsv ? serialize.options.tsv_separators?.column || '\t' : itShouldBeFlatten ? ', ' : ',',
            toCsv ? serialize.options.csv_separators?.column || ',' : itShouldBeFlatten ? ', ' : ',',
            toMd ? serialize.options.md_separators?.column || ' ' : itShouldBeFlatten ? ', ' : ',',
          ]);
        }
        let {ascii = '', ascii_tsv = '', ascii_csv = '', ascii_md = ''}: IAsciiData = serialize.visitNode(node.childNodes[i], '');
        res = AddToAsciiData(res, [
          ascii, 
          !toTsv && itShouldBeFlatten ? ascii_tsv?.trimEnd() : ascii_tsv,
          !toCsv && itShouldBeFlatten ? ascii_csv?.trimEnd() : ascii_csv,
          !toMd && itShouldBeFlatten ? ascii_md?.trimEnd() : ascii_md,
        ]);
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
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
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
      res = AddToAsciiData(res, [
        '"', 
        serialize.options.tableToTsv ? '' : '"', 
        '',
        ''
      ]);
      res = AddToAsciiData(res, [mmlAdd.ascii, mmlAdd.ascii_tsv, mmlAdd.ascii_csv, mmlAdd.ascii_md]);
      res = AddToAsciiData(res, [
        '"', 
        serialize.options.tableToTsv ? '' : '"', 
        '',
        ''
      ]);
      return res;
    } catch (e) {
      console.error('mml => mpadded =>', e);
      return res;
    }
  }
};

const mover = (handlerApi) => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : '';
      const secondChild = node.childNodes[1] ? node.childNodes[1] : '';
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      if (secondChild && secondChild.kind === 'mo') {
        const t = dataSecondChild.ascii;
        const asc = FindSymbolToAM('mover', t, getAttributes(secondChild));
        if (asc) {
          res = AddToAsciiData(res, [' ' +asc + '(']);
          res = AddToAsciiData(res, [
            dataFirstChild ? dataFirstChild.ascii ? dataFirstChild.ascii.trim() : dataFirstChild.ascii : '',
            dataFirstChild ? dataFirstChild.ascii_tsv ? dataFirstChild.ascii_tsv.trim() : dataFirstChild.ascii_tsv : '',
            dataFirstChild ? dataFirstChild.ascii_csv ? dataFirstChild.ascii_csv.trim() : dataFirstChild.ascii_csv : '',
            dataFirstChild ? dataFirstChild.ascii_md ? dataFirstChild.ascii_md.trim() : dataFirstChild.ascii_md : '',
          ]);
          res = AddToAsciiData(res, [')']);
        } else {
          res = AddToAsciiData(res, [
            dataFirstChild ? dataFirstChild.ascii : '',
            dataFirstChild ? dataFirstChild.ascii_tsv : '',
            dataFirstChild ? dataFirstChild.ascii_csv : '',
            dataFirstChild ? dataFirstChild.ascii_md : ''
          ]);
          res = AddToAsciiData(res, ['^']);
          res = AddToAsciiData(res, [serialize.options.extraBrackets ? '(' : '']);
          res = AddToAsciiData(res, [
            dataSecondChild ? dataSecondChild.ascii : '',
            dataSecondChild ? dataSecondChild.ascii_tsv : '',
            dataSecondChild ? dataSecondChild.ascii_csv : '',
            dataSecondChild ? dataSecondChild.ascii_md : ''
          ]);
          res = AddToAsciiData(res, [serialize.options.extraBrackets ? ')' : '']);
        }
      } else {
        const data: IAsciiData = handlerApi.handleAll(node, serialize);
        res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
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
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      if (secondChild && secondChild.kind === 'mo') {
        const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
        const t = dataSecondChild.ascii;
        const asc = FindSymbolToAM(node.kind, t);
        if (asc) {
          res = AddToAsciiData(res, [asc + '(']);
          serialize.resAscii.push({kind: '', res: {...res}});
          const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
          res = AddToAsciiData(res, [
            dataFirstChild ? dataFirstChild.ascii : '',
            dataFirstChild ? dataFirstChild.ascii_tsv : '',
            dataFirstChild ? dataFirstChild.ascii_csv : '',
            dataFirstChild ? dataFirstChild.ascii_md : ''
          ]);
          res = AddToAsciiData(res, [asc + ')']);
        } else {
          const data: IAsciiData = handlerApi.handleAll(node, serialize);
          res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
        }
      } else {
        const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
        res = AddToAsciiData(res, [
          dataFirstChild ? dataFirstChild.ascii : '',
          dataFirstChild ? dataFirstChild.ascii_tsv : '',
          dataFirstChild ? dataFirstChild.ascii_csv : '',
          dataFirstChild ? dataFirstChild.ascii_md : ''
        ]);
        res = AddToAsciiData(res, ['_']);
        res = AddToAsciiData(res, [serialize.options.extraBrackets ? '(' : '']);
        serialize.resAscii.push({kind: '', res: {...res}});
        const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
        res = AddToAsciiData(res, [
          dataSecondChild ? dataSecondChild.ascii : '',
          dataSecondChild ? dataSecondChild.ascii_tsv : '',
          dataSecondChild ? dataSecondChild.ascii_csv : '',
          dataSecondChild ? dataSecondChild.ascii_md : ''
        ]);
        res = AddToAsciiData(res, [serialize.options.extraBrackets ? ')' : '']);
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
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      res = AddToAsciiData(res, [
        dataFirstChild.ascii ? dataFirstChild.ascii : '',
        dataFirstChild.ascii_tsv ? dataFirstChild.ascii_tsv : '',
        dataFirstChild.ascii_csv ? dataFirstChild.ascii_csv : '',
        dataFirstChild.ascii_md ? dataFirstChild.ascii_md : ''
      ]);      
      res = AddToAsciiData(res, ['_']);
      res = AddToAsciiData(res, [serialize.options.extraBrackets ? '(' : '']);
      serialize.resAscii.push({kind: '', res: {...res}});
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      res = AddToAsciiData(res, [
        dataSecondChild.ascii ? dataSecondChild.ascii : '',
        dataSecondChild.ascii_tsv ? dataSecondChild.ascii_tsv : '',
        dataSecondChild.ascii_csv ? dataSecondChild.ascii_csv : '',
        dataSecondChild.ascii_md ? dataSecondChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, [serialize.options.extraBrackets ? ')' : '']);
      res = AddToAsciiData(res, ['^']);
      res = AddToAsciiData(res, [serialize.options.extraBrackets ? '(' : '']);
      serialize.resAscii.push({kind: '', res: {...res}});
      const dataThirdChild: IAsciiData = thirdChild ? serialize.visitNode(thirdChild, '') : null;
      res = AddToAsciiData(res, [
        dataThirdChild.ascii ? dataThirdChild.ascii : '',
        dataThirdChild.ascii_tsv ? dataThirdChild.ascii_tsv : '',
        dataThirdChild.ascii_csv ? dataThirdChild.ascii_csv : '',
        dataThirdChild.ascii_md ? dataThirdChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, [serialize.options.extraBrackets ? ')' : '']);
      return res;
    } catch (e) {
      console.error('mml => munderover =>', e);
      return res;
    }
  }
};

const msub = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      res = AddToAsciiData(res, [
        dataFirstChild ? dataFirstChild.ascii : '',
        dataFirstChild ? dataFirstChild.ascii_tsv : '',
        dataFirstChild ? dataFirstChild.ascii_csv : '',
        dataFirstChild ? dataFirstChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, ['_']);
      res = AddToAsciiData(res, [serialize.options.extraBrackets ? '(' : '']);
      serialize.resAscii.push({kind: '', res: {...res}});
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      res = AddToAsciiData(res, [
        dataSecondChild ? dataSecondChild.ascii : '',
        dataSecondChild ? dataSecondChild.ascii_tsv : '',
        dataSecondChild ? dataSecondChild.ascii_csv : '',
        dataSecondChild ? dataSecondChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, [serialize.options.extraBrackets ? ')' : '']);
      return res;
    } catch (e) {
      console.error('mml => msub =>', e);
      return res;
    }
  }
};

const msup = () =>  {
  return (node, serialize): IAsciiData => {
    let res : IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      res = AddToAsciiData(res, [
        dataFirstChild ? dataFirstChild.ascii : '',
        dataFirstChild ? dataFirstChild.ascii_tsv : '',
        dataFirstChild ? dataFirstChild.ascii_csv : '',
        dataFirstChild ? dataFirstChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, ['^']);
      res = AddToAsciiData(res, [serialize.options.extraBrackets ? '(' : '']);
      serialize.resAscii.push({kind: '', res: {...res}});
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      res = AddToAsciiData(res, [
        dataSecondChild ? dataSecondChild.ascii : '',
        dataSecondChild ? dataSecondChild.ascii_tsv : '',
        dataSecondChild ? dataSecondChild.ascii_csv : '',
        dataSecondChild ? dataSecondChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, [serialize.options.extraBrackets ? ')' : '']);
      return res;
    } catch (e) {
      console.error('mml => msup =>', e);
      return res;
    }
  }
};

const msubsup = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      const thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      res = AddToAsciiData(res, [
        dataFirstChild ? dataFirstChild.ascii : '',
        dataFirstChild ? dataFirstChild.ascii_tsv : '',
        dataFirstChild ? dataFirstChild.ascii_csv : '',
        dataFirstChild ? dataFirstChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, ['_']);
      res = AddToAsciiData(res, ['(']);
      serialize.resAscii.push({kind: '', res: {...res}})
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      res = AddToAsciiData(res, [
        dataSecondChild ? dataSecondChild.ascii : '',
        dataSecondChild ? dataSecondChild.ascii_tsv : '',
        dataSecondChild ? dataSecondChild.ascii_csv : '',
        dataSecondChild ? dataSecondChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, [')']);
      res = AddToAsciiData(res, ['^']);
      res = AddToAsciiData(res, ['(']);
      serialize.resAscii.push({kind: '', res: {...res}})
      const dataThirdChild: IAsciiData = thirdChild ? serialize.visitNode(thirdChild, '') : null;
      res = AddToAsciiData(res, [
        dataThirdChild ? dataThirdChild.ascii : '',
        dataThirdChild ? dataThirdChild.ascii_tsv : '',
        dataThirdChild ? dataThirdChild.ascii_csv : '',
        dataThirdChild ? dataThirdChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, [')']);
      return res;
    } catch (e) {
      console.error('mml => msubsup =>', e);
      return res;
    }
  }
};

const msqrt = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      res = AddToAsciiData(res, ['sqrt']);
      serialize.resAscii.push({kind: '', res: {...res}});
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      res = AddToAsciiData(res, [
        dataFirstChild ? dataFirstChild.ascii : '',
        dataFirstChild ? dataFirstChild.ascii_tsv : '',
        dataFirstChild ? dataFirstChild.ascii_csv : '',
        dataFirstChild ? dataFirstChild.ascii_md : ''
      ]);
      return res;
    } catch (e) {
      console.error('mml => msqrt =>', e);
      return res;
    }
  }
};

const mroot = () => {
  return (node, serialize): IAsciiData => {
    let res : IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      res = AddToAsciiData(res, ['root']);
      res = AddToAsciiData(res, [secondChild ? '(' : '']);
      serialize.resAscii.push({kind: '', res: {...res}});
      const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
      res = AddToAsciiData(res, [
        dataSecondChild ? dataSecondChild.ascii : '',
        dataSecondChild ? dataSecondChild.ascii_tsv : '',
        dataSecondChild ? dataSecondChild.ascii_csv : '',
        dataSecondChild ? dataSecondChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, [secondChild ? ')' : '']);
      res = AddToAsciiData(res, [firstChild ? '(' : '']);
      serialize.resAscii.push({kind: '', res: {...res}});
      const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
      res = AddToAsciiData(res, [
        dataFirstChild ? dataFirstChild.ascii : '',
        dataFirstChild ? dataFirstChild.ascii_tsv : '',
        dataFirstChild ? dataFirstChild.ascii_csv : '',
        dataFirstChild ? dataFirstChild.ascii_md : ''
      ]);
      res = AddToAsciiData(res, [firstChild ? ')' : '']);
      serialize.resAscii.push({kind: '', res: {...res}});
      return res;
    } catch (e) {
      console.error('mml => mroot =>', e);
      return res;
    }
  }
};

const mfrac = () => {
  return (node, serialize): IAsciiData => {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const firstChild = node.childNodes[0] ? node.childNodes[0] : null;
      const secondChild = node.childNodes[1] ? node.childNodes[1] : null;
      if ((firstChild && firstChild.kind === "mrow" && firstChild.childNodes.length > 1) || serialize.options.extraBrackets) {
        res = AddToAsciiData(res, ['(']);
        serialize.resAscii.push({kind: '', res: {...res}});
        const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
        res = AddToAsciiData(res, [
          dataFirstChild ? dataFirstChild.ascii : '',
          dataFirstChild ? dataFirstChild.ascii_tsv : '',
          dataFirstChild ? dataFirstChild.ascii_csv : '',
          dataFirstChild ? dataFirstChild.ascii_md : ''
        ]);     
        res = AddToAsciiData(res, [')']);
        serialize.resAscii.push({kind: '', res: {...res}});
      } else {
        const dataFirstChild: IAsciiData = firstChild ? serialize.visitNode(firstChild, '') : null;
        res = AddToAsciiData(res, [
          dataFirstChild ? dataFirstChild.ascii : '',
          dataFirstChild ? dataFirstChild.ascii_tsv : '',
          dataFirstChild ? dataFirstChild.ascii_csv : '',
          dataFirstChild ? dataFirstChild.ascii_md : ''
        ]);
      }
      res = AddToAsciiData(res, ['/']);
      serialize.resAscii.push({kind: '', res: {...res}});

      if ((secondChild && secondChild.kind === "mrow" && secondChild.childNodes.length > 1)|| serialize.options.extraBrackets) {
        res = AddToAsciiData(res, ['(']);
        serialize.resAscii.push({kind: '', res: {...res}});
        const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
        res = AddToAsciiData(res, [
          dataSecondChild ? dataSecondChild.ascii : '',
          dataSecondChild ? dataSecondChild.ascii_tsv : '',
          dataSecondChild ? dataSecondChild.ascii_csv : '',
          dataSecondChild ? dataSecondChild.ascii_md : ''
        ]);
        res = AddToAsciiData(res, [')']);
        serialize.resAscii.push({kind: '', res: {...res}});
      } else {
        const dataSecondChild: IAsciiData = secondChild ? serialize.visitNode(secondChild, '') : null;
        res = AddToAsciiData(res, [
          dataSecondChild ? dataSecondChild.ascii : '',
          dataSecondChild ? dataSecondChild.ascii_tsv : '',
          dataSecondChild ? dataSecondChild.ascii_csv : '',
          dataSecondChild ? dataSecondChild.ascii_md : ''
        ]);
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
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      if (!node.childNodes || node.childNodes.length === 0 ) {
        return res;
      }
      const firstChild: any = node.childNodes[0];
      let value = FindSymbolReplace(firstChild.text);
      const asc = FindSymbolToAM(node.kind, value);
      if (asc) {
        res = AddToAsciiData(res, [asc]);
        return res;
      }
      const toTsv = node.attributes.get('toTsv');
      const toCsv = node.attributes.get('toCsv');
      const toMd = node.attributes.get('toMd');
      if (value[0] === '(' || toTsv || toCsv || toMd) {
        res = AddToAsciiData(res, [
          value[0] === '(' ? value.replace(/"/g, '') : value,
          toTsv ? value.replace(/"/g, '') : value,
          toCsv ? value.replace(/"/g, '') : value,
          value
        ]);
      } else {
        if ( !value || ( value && !value.trim())) {
          res = AddToAsciiData(res, ['']);
        } else {
          /** For tsv/csv: 
           * Omit the " in nested arrays */
          res = AddToAsciiData(res, [
            '"' + value + '"',
            serialize.options.tableToTsv
              ? value.replace(/"/g, '')
              : '"' + value + '"',
            serialize.options.tableToCsv
              ? value.replace(/"/g, '')
              : value,
            value
          ]);
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
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      if (!node.childNodes || node.childNodes.length === 0) {
        return res;
      }
      const firstChild: any = node.childNodes[0];
      const value = firstChild.text;
      const atr = serialize.options.showStyle
        ? getAttributes(node)
        : null;
      let abs = SymbolToAM(node.kind, value, atr);
      if (abs && abs.length && regW.test(abs[0])) {
        res = AddToAsciiData(res, [needFirstSpace(node, abs, serialize) ? ' ' : '']);
        res = AddToAsciiData(res, [abs]);
        res = AddToAsciiData(res, [needLastSpace(node, abs) ? ' ' : '']);
      } else {
        res = AddToAsciiData(res, [abs]);
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
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const value = getChildrenText(node);
      if (value === '\u2061') {
        return res;
      }
      const atr = getAttributes(node);
      let abs = SymbolToAM(node.kind, value, atr, serialize.options.showStyle);
      if (abs && abs.length > 1) {
        res = AddToAsciiData(res, [regW.test(abs[0]) && needFirstSpace(node, abs, serialize) ? ' ' : '']);
        res = AddToAsciiData(res, [abs]);
        res = AddToAsciiData(res, [regW.test(abs[abs.length-1]) && needLastSpace(node, abs) ? ' ' : '']);
      } else {
        if (abs === ',' && node.Parent.kind === 'mtd') {
          /** For tsv/csv:
           * Omit the " in nested arrays */
          res = AddToAsciiData(res, [
            '"' + abs + '"',
            `${serialize.options.tableToTsv ? abs : '"' + abs + '"'}`,
            abs,
            abs
          ]);
        } else {
          res = AddToAsciiData(res, [
            abs,
            abs === '"' ? '' : abs,
            abs === '"' ? '' : abs,
            abs
          ]);
        }
      }
      
      if (node.Parent && node.Parent.kind === "mpadded" && node.Parent.Parent && node.Parent.Parent.kind === "menclose") {
        const atr = getAttributes(node.Parent.Parent);
        if ( atr.notation && atr.notation.toString().indexOf("bottom") !== -1) {
          node.Parent.Parent.attributes.attributes.lcm = true;
          return {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
          }
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
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const atr = getAttributes(node);
      if (atr && atr.width === "2em") {
        res = AddToAsciiData(res, [node.parent.parent && needFirstSpace(node.parent.parent, 'qquad', serialize) ? ' ' : '']);
        res = AddToAsciiData(res, ['qquad']);
        res = AddToAsciiData(res, [node.parent.parent && needLastSpace(node.parent.parent, 'qquad') ? ' ' : '']);
        return res;
      }
      if (atr && atr.width === "1em") {
        res = AddToAsciiData(res, [node.parent.parent && needFirstSpace(node.parent.parent, 'quad', serialize) ? ' ' : '']);
        res = AddToAsciiData(res, ['quad']);
        res = AddToAsciiData(res, [node.parent.parent && needLastSpace(node.parent.parent, 'quad') ? ' ' : '']);
        return res;
      }
      const data: IAsciiData = handlerApi.handleAll(node, serialize);
      res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
      return res;
    } catch (e) {
      console.error('mml => mspace =>', e);
      return res;
    }
  }
};

export const handle = (node, serialize): IAsciiData => {
  const handler = handlers[node.kind] || defHandle;
  return handler(node, serialize)
};

const handleAll = (node, serialize): IAsciiData => {
  let res: IAsciiData = {
    ascii: '',
    ascii_tsv: '',
    ascii_csv: '',
    ascii_md: ''
  };
  try {
    for (const child of node.childNodes) {
      const data: IAsciiData = serialize.visitNode(child, '');
      res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
    }
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

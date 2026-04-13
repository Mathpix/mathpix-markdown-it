import { MathNode } from "../types";
import { MLABELEDTR, BLOCK_CODE_FUNCS } from "../consts";
import { getProp, getContentChildren } from "../common";
import { TypstMathNode, TypstMathResult, FuncArg, ITypstMathSerializer, astNodeStore } from "./types";
import {
  seq, operator, funcCall,
  posArg, namedArg,
  mathVal, boolVal,
  alignment, space, matrixRow,
} from "./builders";
import { serializeTypstMath } from "./serialize";
import { isNumcasesTable, isInsideMatrixCell, isInsideEqnArrayCellWithSiblings, computeAugment } from "./table-helpers";
import {
  buildNumcasesGrid, buildEqnArrayAsMatResult, buildTaggedEqnArrayResult,
  buildUntaggedEqnArrayResult, buildMatrixResult,
} from "./table-builders";

/** Same scope as containsBlockCodeFunc in dispatcher.ts: recurses only
 *  into SeqNode children, not FuncCall.args / Delimited.body. */
const hasBlockCodeFunc = (node: TypstMathNode): boolean => {
  if (node.type === 'func' && node.hash && BLOCK_CODE_FUNCS.has(node.name)) {
    return true;
  }
  if (node.type === 'seq') {
    return node.children.some(hasBlockCodeFunc);
  }
  return false;
};

export const mtableAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const countRow = node.childNodes.length;
  const envName = String(node.attributes.get('name') || '');
  // Check for enclosing brackets from \left...\right
  const parentMrow = node.parent?.kind === 'mrow' ? node.parent : null;
  const hasParentDelims = parentMrow
    && (getProp<string>(parentMrow, 'open') !== undefined
      || getProp<string>(parentMrow, 'close') !== undefined);
  const isSoleContent = hasParentDelims
    && getContentChildren(parentMrow!).length === 1;
  const closeStr = hasParentDelims ? String(getProp<string>(parentMrow, 'close') ?? '') : '';
  const parentContent = hasParentDelims ? getContentChildren(parentMrow!) : [];
  const isFirstWithInvisibleClose = hasParentDelims && !isSoleContent
    && !closeStr && parentContent[0] === node;
  const openProp = (isSoleContent || isFirstWithInvisibleClose) ? getProp<string>(parentMrow, 'open') : undefined;
  const closeProp = isSoleContent ? getProp<string>(parentMrow, 'close') : undefined;
  const branchOpen: string = openProp !== undefined ? String(openProp) : '';
  const branchClose: string = closeProp !== undefined ? String(closeProp) : '';
  // Determine cases/eqnArray/matrix
  const firstRowDisplaystyle = node.childNodes.length > 0
    && node.childNodes[0].attributes?.get('displaystyle') === true;
  const isReverseCases = branchOpen === '' && branchClose === '}' && firstRowDisplaystyle;
  const isCases = envName === 'cases' || (branchOpen === '{' && branchClose === '') || isReverseCases;
  const isNumcases = isNumcasesTable(node);
  const hasLines = node.attributes.isSet('rowlines') || node.attributes.isSet('columnlines');
  const isEqnArray = !isNumcases && !isCases && node.childNodes.length > 0
    && node.childNodes[0].attributes?.get('displaystyle') === true;
  const insideMatCell = isInsideMatrixCell(node);
  const columnAlign = String(node.attributes.get('columnalign') || '').trim();
  const isGatheredLike = isEqnArray && columnAlign === 'center'
    && node.childNodes.every((row: MathNode) => (row.childNodes?.length ?? 0) <= 1);
  const insideEqnArrayCell = isGatheredLike && isInsideEqnArrayCellWithSiblings(node);
  const isNested = isEqnArray && (insideMatCell || insideEqnArrayCell);
  const eqnArrayAsMat = isNested || (isEqnArray && hasLines);
  if (isNumcases) {
    return buildNumcasesGrid(node, serialize, countRow);
  }
  // Collect row data
  const rowNodes: TypstMathNode[] = [];
  const rowNodesInline: TypstMathNode[] = [];
  let hasInlineDiff = false;
  const nestedRawRows: TypstMathNode[][] = [];
  const nestedRawRowsInline: TypstMathNode[][] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    const countColl = mtrNode.childNodes?.length || 0;
    const startCol = mtrNode.kind === MLABELEDTR ? 1 : 0;
    const cellNodes: TypstMathNode[] = [];
    const cellNodesInline: TypstMathNode[] = [];
    for (let j = startCol; j < countColl; j++) {
      const mtdNode = mtrNode.childNodes[j];
      const result = serialize.visitNodeFull(mtdNode);
      const blockNode = result.node;
      const inlineNode = result.nodeInline ?? result.node;
      // Block-level code-mode funcs (#align, #grid, #math.equation) break math
      // flow in eqnArray rows. Use inline variant to keep everything in math mode.
      // Inline #box/#circle are safe and do NOT trigger this.
      const useInlineForBlock = isEqnArray && result.nodeInline !== undefined
        && hasBlockCodeFunc(blockNode);
      cellNodes.push(useInlineForBlock ? inlineNode : blockNode);
      cellNodesInline.push(inlineNode);
      if (result.nodeInline !== undefined) {
        hasInlineDiff = true;
      }
    }
    if (eqnArrayAsMat) {
      nestedRawRows.push(cellNodes);
      nestedRawRowsInline.push(cellNodesInline);
    } else if (isEqnArray) {
      // Join cells with & alignment markers in rl-pairs:
      // &quad between pairs (wide gap), & within pair (tight gap).
      // compact=true suppresses extra space after the marker.
      const pairParts: TypstMathNode[] = [];
      const pairPartsInline: TypstMathNode[] = [];
      for (let k = 0; k < cellNodes.length; k += 2) {
        if (k > 0) {
          pairParts.push(alignment('&quad', true));
          pairPartsInline.push(alignment('&quad', true));
        }
        pairParts.push(cellNodes[k]);
        pairPartsInline.push(cellNodesInline[k]);
        if (k + 1 < cellNodes.length) {
          pairParts.push(alignment('&', true));
          pairPartsInline.push(alignment('&', true));
          pairParts.push(cellNodes[k + 1]);
          pairPartsInline.push(cellNodesInline[k + 1]);
        }
      }
      rowNodes.push(seq(pairParts));
      rowNodesInline.push(seq(pairPartsInline));
    } else if (isCases) {
      // Cases: join cells with & alignment (escaping handled by serializer's MatrixCell context)
      const parts: TypstMathNode[] = [];
      for (let k = 0; k < cellNodes.length; k++) {
        if (k > 0) {
          parts.push(alignment('&'));
        }
        parts.push(cellNodes[k]);
      }
      rowNodes.push(seq(parts));
    } else {
      // Matrix: MatrixRowNode escapes each cell individually, then joins with ", "
      rowNodes.push(matrixRow(cellNodes));
      rowNodesInline.push(matrixRow(cellNodesInline));
    }
  }
  let result: TypstMathResult;
  if (eqnArrayAsMat) {
    const maxCols = nestedRawRows.reduce((m, r) => Math.max(m, r.length), 0);
    const isGathered = envName === 'gathered' || envName === 'gather' || envName === 'gather*'
      || isGatheredLike;
    // Analyze column usage in rl-pairs
    const hasEvenContent = nestedRawRows.some(r =>
      r.some((c, k) => k % 2 === 0 && serializeTypstMath(c).trim() !== ''));
    let nestedAlign: string;
    if (isGathered || maxCols <= 0) {
      nestedAlign = '';
    } else if (!hasEvenContent) {
      nestedAlign = '#left';
    } else {
      nestedAlign = '#right';
    }
    // Flatten each row's cells into a single node (space-joined)
    const nestedRowNodes = nestedRawRows.map(r => {
      if (r.length <= 1) {
        return r[0] ?? seq([]);
      }
      // Join cells with space
      const parts: TypstMathNode[] = [];
      for (let k = 0; k < r.length; k++) {
        if (k > 0) {
          parts.push(space(null));
        }
        parts.push(r[k]);
      }
      return seq(parts);
    });
    const nestedRowNodesInline = nestedRawRowsInline.map(r => {
      if (r.length <= 1) {
        return r[0] ?? seq([]);
      }
      const parts: TypstMathNode[] = [];
      for (let k = 0; k < r.length; k++) {
        if (k > 0) {
          parts.push(space(null));
        }
        parts.push(r[k]);
      }
      return seq(parts);
    });
    const augment = hasLines ? computeAugment(node) : '';
    return buildEqnArrayAsMatResult(nestedRowNodes, nestedRowNodesInline, nestedAlign, augment, isNested);
  } else if (isEqnArray) {
    const hasAnyTag = node.childNodes.some(
      (child: MathNode) => child.kind === MLABELEDTR
    );
    const store = astNodeStore.get(node);
    const preContentNode = store?.preContent ?? null;
    const postContentNode = store?.postContent ?? null;
    const inlineRows = hasInlineDiff ? rowNodesInline : undefined;
    if (hasAnyTag) {
      return buildTaggedEqnArrayResult(node, serialize, rowNodes, countRow, preContentNode, postContentNode, inlineRows);
    } else {
      return buildUntaggedEqnArrayResult(rowNodes, preContentNode, postContentNode, inlineRows);
    }
  } else if (isCases) {
    const casesArgs: FuncArg[] = [];
    if (isReverseCases) {
      casesArgs.push(namedArg('reverse', boolVal(true)));
    }
    for (const rowNode of rowNodes) {
      casesArgs.push(posArg(mathVal(rowNode)));
    }
    result = {
      node: funcCall('cases', casesArgs)
    };
  } else {
    result = buildMatrixResult(node, rowNodes, branchOpen, branchClose,
      hasInlineDiff ? rowNodesInline : undefined);
  }
  // Wrap in display() for block output when inside a mat() cell
  if (insideMatCell) {
    const blockNode = result.node;
    const inlineNode = result.nodeInline ?? blockNode;
    result = {
      node: funcCall('display', [posArg(mathVal(blockNode))]),
      nodeInline: inlineNode,
    };
  }
  return result;
};

/** mtr: join cell children with comma separator — fully typed. */
export const mtrAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const children: TypstMathNode[] = [];
  for (let i = 0; i < node.childNodes.length; i++) {
    if (i > 0) {
      children.push(operator(','));
    }
    children.push(serialize.visitNode(node.childNodes[i]));
  }
  return {
    node: seq(children)
  };
};

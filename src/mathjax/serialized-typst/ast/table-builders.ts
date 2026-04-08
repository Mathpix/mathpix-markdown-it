import { MathNode } from "../types";
import {
  DATA_TAG_AUTO, DEFAULT_EQ_NUMBERING,
  OPEN_BRACKETS, MLABELEDTR,
  BOX_STROKE, BOX_INSET,
} from "../consts";
import { getProp, escapeTypstContent } from "../common";
import { delimiterToTypst } from "../bracket-utils";
import { TypstMathNode, TypstMathResult, FuncArg, FuncCallNode, DelimitedKind, ITypstMathSerializer } from "./types";
import { FuncEscapeContext } from "./serialize-context";
import {
  seq, raw, funcCall, delimited, label,
  posArg, namedArg,
  mathVal, boolVal, rawVal, inlineMathVal, callVal,
  linebreak, alignment,
} from "./builders";
import {
  getLabelKey, serializeTagContent, extractTagFromConditionCell,
  computeAugment,
  buildFigureTag, buildAutoTagWithLabel, AUTO_TAG_ENTRY,
  visitPrefixBeforeMo, visitCellWithoutTag,
} from "./table-helpers";

/** Counter reset — emitted after explicit-tag equations to prevent counter increment. */
const COUNTER_RESET: TypstMathNode = raw('#counter(math.equation).update(n => n - 1)', { leadingNewline: true });

/** numcases/subnumcases → #grid() with cases + numbering column. */
export const buildNumcasesGrid = (
  node: MathNode, serialize: ITypstMathSerializer, countRow: number,
): TypstMathResult => {
  const firstRow = node.childNodes[0];
  const prefixCell = firstRow.childNodes[1];
  const prefixNode = visitPrefixBeforeMo(prefixCell, serialize, '{');
  const rowTagSources: { source: 'condition' | 'label' | 'auto'; content: string; labelKey: string | null }[] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    const labelCell = (mtrNode.kind === MLABELEDTR && mtrNode.childNodes.length > 0) ? mtrNode.childNodes[0] : null;
    const labelKey = labelCell ? getLabelKey(labelCell) : null;
    const condCell = mtrNode.childNodes[mtrNode.childNodes.length - 1];
    const condTag = extractTagFromConditionCell(condCell);
    if (condTag) {
      rowTagSources.push({
        source: 'condition',
        content: condTag,
        labelKey
      });
    } else if (labelCell) {
      const isAutoNumber = !!getProp<boolean>(labelCell, DATA_TAG_AUTO);
      if (!isAutoNumber) {
        const tagContent = serializeTagContent(labelCell, serialize);
        rowTagSources.push({
          source: 'label',
          content: tagContent,
          labelKey
        });
      } else {
        rowTagSources.push({
          source: 'auto',
          content: '',
          labelKey
        });
      }
    } else {
      rowTagSources.push({
        source: 'auto',
        content: '',
        labelKey: null
      });
    }
  }
  const caseRowNodes: TypstMathNode[] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    const startCol = mtrNode.kind === MLABELEDTR ? 2 : 1;
    const cellNodes: TypstMathNode[] = [];
    for (let j = startCol; j < mtrNode.childNodes.length; j++) {
      const mtdNode = mtrNode.childNodes[j];
      let cellNode: TypstMathNode;
      if (j === mtrNode.childNodes.length - 1 && rowTagSources[i].source === 'condition') {
        cellNode = visitCellWithoutTag(mtdNode, serialize);
      } else {
        cellNode = serialize.visitNode(mtdNode);
      }
      cellNodes.push(cellNode);
    }
    if (cellNodes.length === 1) {
      caseRowNodes.push(cellNodes[0]);
    } else {
      const parts: TypstMathNode[] = [];
      for (let k = 0; k < cellNodes.length; k++) {
        if (k > 0) {
          parts.push(alignment('&'));
        }
        parts.push(cellNodes[k]);
      }
      caseRowNodes.push(seq(parts));
    }
  }
  const casesArgs: FuncArg[] = caseRowNodes.map(r => posArg(mathVal(r)));
  const casesNode = funcCall('cases', casesArgs);
  const mathContentNode: TypstMathNode = prefixNode
    ? seq([prefixNode, casesNode])
    : casesNode;
  const inlineNode = mathContentNode;
  const tagEntries: string[] = [];
  for (let i = 0; i < countRow; i++) {
    const info = rowTagSources[i];
    let tagText = '';
    if (info.source === 'condition') {
      tagText = `(${escapeTypstContent(info.content)})`;
    } else if (info.source === 'label' && info.content) {
      tagText = info.content;
    }
    if (tagText && info.labelKey) {
      tagEntries.push(buildFigureTag(tagText, info.labelKey));
    } else if (tagText) {
      tagEntries.push(`[${tagText}]`);
    } else if (info.labelKey) {
      tagEntries.push(buildAutoTagWithLabel(info.labelKey));
    } else {
      tagEntries.push(AUTO_TAG_ENTRY);
    }
  }
  const mathEqNode = funcCall('math.equation', [
    namedArg('block', boolVal(true)),
    namedArg('numbering', rawVal('none')),
    posArg(inlineMathVal(mathContentNode, true)),
  ]);
  const innerGridArgs: FuncArg[] = [
    namedArg('row-gutter', rawVal('0.65em')),
  ];
  for (const entry of tagEntries) {
    innerGridArgs.push(posArg(rawVal(entry)));
  }
  const innerGridNode = funcCall('grid', innerGridArgs);
  const outerGridNode = funcCall('grid', [
    namedArg('columns', rawVal('(1fr, auto)')),
    namedArg('align', rawVal('(left, right + horizon)')),
    posArg(callVal(mathEqNode)),
    posArg(callVal(innerGridNode)),
  ], {
    hash: true
  });
  return {
    node: outerGridNode,
    nodeInline: inlineNode
  };
};

/** Join row nodes with \\ separators, optionally prepending preContent. */
export const joinRowNodes = (rowNodes: TypstMathNode[], preContentNode: TypstMathNode | null): TypstMathNode => {
  const children: TypstMathNode[] = [];
  if (preContentNode) {
    children.push(preContentNode);
    children.push(linebreak());
  }
  for (let i = 0; i < rowNodes.length; i++) {
    if (i > 0) {
      children.push(linebreak());
    }
    children.push(rowNodes[i]);
  }
  return seq(children);
};

/** Build a mat(delim: #none, ...) node for eqnArray rendered as mat. */
const buildEqnArrayMatNode = (
  rowNodes: TypstMathNode[], align: string, augment: string,
): FuncCallNode => {
  const args: FuncArg[] = [];
  args.push(namedArg('delim', rawVal('#none')));
  if (align) {
    args.push(namedArg('align', rawVal(align)));
  }
  if (augment) {
    args.push(namedArg('augment', rawVal(augment)));
  }
  for (const rowNode of rowNodes) {
    args.push(posArg(mathVal(rowNode)));
  }
  return funcCall('mat', args, {
    semicolonSep: true,
    escapeContext: FuncEscapeContext.MatrixCell
  });
};

/** eqnArray rendered as mat() — nested or has lines. */
export const buildEqnArrayAsMatResult = (
  rowNodes: TypstMathNode[], rowNodesInline: TypstMathNode[],
  align: string, augment: string, addDisplay: boolean,
): TypstMathResult => {
  const matNode = buildEqnArrayMatNode(rowNodes, align, augment);
  const matInlineNode = buildEqnArrayMatNode(rowNodesInline, align, augment);
  const blockNode: TypstMathNode = addDisplay
    ? funcCall('display', [posArg(mathVal(matNode))])
    : matNode;
  return {
    node: blockNode,
    nodeInline: matInlineNode
  };
};

/** eqnArray with tags → number-align / separate / no-tag strategies. */
export const buildTaggedEqnArrayResult = (
  node: MathNode, serialize: ITypstMathSerializer,
  rowNodes: TypstMathNode[], countRow: number,
  preContentNode: TypstMathNode | null, postContentNode: TypstMathNode | null,
  rowNodesInline?: TypstMathNode[],
): TypstMathResult => {
  const rowTagInfos: { isTagged: boolean; isAutoTag: boolean; isExplicitTag: boolean; tagContent: string; labelKey: string | null }[] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    if (mtrNode.kind === MLABELEDTR && mtrNode.childNodes.length > 0) {
      const labelCell = mtrNode.childNodes[0];
      const tagContent = serializeTagContent(labelCell, serialize);
      const isAutoNumber = !!getProp<boolean>(labelCell, DATA_TAG_AUTO);
      const labelKey = getLabelKey(labelCell);
      rowTagInfos.push({
        isTagged: !!tagContent,
        isAutoTag: isAutoNumber && !!tagContent,
        isExplicitTag: !isAutoNumber && !!tagContent,
        tagContent: tagContent || '',
        labelKey,
      });
    } else {
      rowTagInfos.push({
        isTagged: false,
        isAutoTag: false,
        isExplicitTag: false,
        tagContent: '',
        labelKey: null
      });
    }
  }
  const explicitTagIndices = rowTagInfos.map((r, i) => r.isExplicitTag ? i : -1).filter(i => i >= 0);
  const autoTagIndices = rowTagInfos.map((r, i) => r.isAutoTag ? i : -1).filter(i => i >= 0);
  const totalTagged = explicitTagIndices.length + autoTagIndices.length;
  if (explicitTagIndices.length === 1 && autoTagIndices.length === 0 && countRow > 1) {
    const tagIdx = explicitTagIndices[0];
    const info = rowTagInfos[tagIdx];
    const rowNodesCopyNA = [...rowNodes];
    if (postContentNode && rowNodesCopyNA.length > 0) {
      rowNodesCopyNA[rowNodesCopyNA.length - 1] = seq([rowNodesCopyNA[rowNodesCopyNA.length - 1], postContentNode]);
    }
    const totalRows = (preContentNode ? countRow + 1 : countRow)
      + (postContentNode && rowNodesCopyNA.length === 0 ? 1 : 0);
    const adjustedTagIdx = preContentNode ? tagIdx + 1 : tagIdx;
    let numberAlign: string;
    if (adjustedTagIdx === totalRows - 1) {
      numberAlign = 'end + bottom';
    } else if (adjustedTagIdx === 0) {
      numberAlign = 'end + top';
    } else {
      numberAlign = 'end + horizon';
    }
    const mathContentNode = joinRowNodes(rowNodesCopyNA, preContentNode);
    const eqnArgs: FuncArg[] = [
      namedArg('block', boolVal(true)),
    ];
    if (info.labelKey) eqnArgs.push(namedArg('supplement', rawVal('none')));
    eqnArgs.push(namedArg('numbering', rawVal(`n => [${info.tagContent}]`)));
    eqnArgs.push(namedArg('number-align', rawVal(numberAlign)));
    eqnArgs.push(posArg(inlineMathVal(mathContentNode, true)));
    const eqnNode = funcCall('math.equation', eqnArgs, { hash: true });
    const blockParts: TypstMathNode[] = [eqnNode];
    if (info.labelKey) {
      blockParts.push(label(info.labelKey));
    }
    blockParts.push(COUNTER_RESET);
    const inlineBase = rowNodesInline ? [...rowNodesInline] : [...rowNodes];
    if (postContentNode && inlineBase.length > 0) {
      inlineBase[inlineBase.length - 1] = seq([inlineBase[inlineBase.length - 1], postContentNode]);
    }
    const inlineNode = joinRowNodes(inlineBase, preContentNode);
    return {
      node: seq(blockParts),
      nodeInline: inlineNode
    };
  } else if (totalTagged > 0) {
    const rowNodesCopy = [...rowNodes];
    if (preContentNode && rowNodesCopy.length > 0) {
      rowNodesCopy[0] = seq([preContentNode, linebreak(), rowNodesCopy[0]]);
    }
    if (postContentNode && rowNodesCopy.length > 0) {
      rowNodesCopy[rowNodesCopy.length - 1] = seq([rowNodesCopy[rowNodesCopy.length - 1], postContentNode]);
    }
    const blockParts: TypstMathNode[] = [];
    for (let i = 0; i < countRow; i++) {
      const info = rowTagInfos[i];
      const rowNode = rowNodesCopy[i];
      if (info.isTagged) {
        const numbering = info.isAutoTag
          ? DEFAULT_EQ_NUMBERING
          : `n => [${info.tagContent}]`;
        const eqnArgs: FuncArg[] = [
          namedArg('block', boolVal(true)),
        ];
        if (info.labelKey) eqnArgs.push(namedArg('supplement', rawVal('none')));
        eqnArgs.push(namedArg('numbering', rawVal(numbering)));
        eqnArgs.push(posArg(inlineMathVal(rowNode, true)));
        const eqnNode = funcCall('math.equation', eqnArgs, { hash: true });
        if (info.labelKey) {
          blockParts.push(seq([eqnNode, label(info.labelKey)]));
        } else {
          blockParts.push(eqnNode);
        }
        if (info.isExplicitTag) {
          blockParts.push(COUNTER_RESET);
        }
      } else {
        blockParts.push(funcCall('math.equation', [
          namedArg('block', boolVal(true)),
          namedArg('numbering', rawVal('none')),
          posArg(inlineMathVal(rowNode, true)),
        ], { hash: true }));
      }
    }
    for (let i = 0; i < blockParts.length - 1; i++) {
      const next = blockParts[i + 1];
      const nextHasLeadingNewline = next.type === 'raw' && next.leadingNewline;
      if (nextHasLeadingNewline) {
        continue;
      }
      const part = blockParts[i];
      if (part.type === 'func') {
        blockParts[i] = funcCall(part.name, [...part.args], {
          hash: part.hash,
          body: part.body ? [...part.body] : undefined,
          semicolonSep: part.semicolonSep,
          escapeContext: part.escapeContext,
          trailingNewline: true,
        });
      } else if (part.type === 'raw') {
        blockParts[i] = raw(part.value, {
          leadingNewline: part.leadingNewline,
          trailingNewline: true
        });
      } else if (part.type === 'seq') {
        blockParts[i] = seq([...part.children], { trailingNewline: true });
      }
    }
    const inlineNode = joinRowNodes(rowNodesInline ?? rowNodes, null);
    return {
      node: seq(blockParts),
      nodeInline: inlineNode
    };
  } else {
    return buildUntaggedEqnArrayResult(rowNodes, preContentNode, postContentNode, rowNodesInline);
  }
};

/** eqnArray without tags → rows with \\ separators. */
export const buildUntaggedEqnArrayResult = (
  rowNodes: TypstMathNode[],
  preContentNode: TypstMathNode | null,
  postContentNode: TypstMathNode | null,
  rowNodesInline?: TypstMathNode[],
): TypstMathResult => {
  const appendPost = (nodes: TypstMathNode[]): TypstMathNode[] => {
    if (!postContentNode || nodes.length === 0) {
      return nodes;
    }
    const copy = [...nodes];
    copy[copy.length - 1] = seq([copy[copy.length - 1], postContentNode]);
    return copy;
  };
  const blockRows = appendPost(rowNodes);
  const blockNode = joinRowNodes(blockRows, preContentNode);
  if (rowNodesInline) {
    const inlineRows = appendPost(rowNodesInline);
    const inlineNode = joinRowNodes(inlineRows, preContentNode);
    return {
      node: blockNode,
      nodeInline: inlineNode
    };
  }
  return {
    node: blockNode
  };
};

/** Build a mat() FuncCallNode with params and rows. */
const buildMatFuncCall = (
  paramArgs: FuncArg[], rowNodes: TypstMathNode[],
): FuncCallNode => {
  const args: FuncArg[] = [...paramArgs];
  for (const rowNode of rowNodes) {
    args.push(posArg(mathVal(rowNode)));
  }
  return funcCall('mat', args, { semicolonSep: true });
};

/** Wrap a mat node in lr() for mismatched delimiters using DelimitedNode. */
const wrapMatInLr = (
  matNode: FuncCallNode, branchOpen: string, branchClose: string,
): TypstMathNode => {
  if (branchOpen || branchClose) {
    return delimited(DelimitedKind.Lr, matNode, branchOpen, branchClose);
  }
  return matNode;
};

/** matrix → mat(delim: ..., ...) with augment/align/frame. */
export const buildMatrixResult = (
  node: MathNode, rowNodes: TypstMathNode[],
  branchOpen: string, branchClose: string,
  rowNodesInline?: TypstMathNode[],
): TypstMathResult => {
  const frame = node.attributes.isSet('frame')
    ? String(node.attributes.get('frame') || '')
    : '';
  const augmentStr = computeAugment(node);
  const columnAlign = String(node.attributes.get('columnalign') || '');
  const alignArr = columnAlign ? columnAlign.trim().split(/\s+/) : [];
  const uniqueAligns = [...new Set(alignArr)];
  const matAlign = (uniqueAligns.length === 1 && uniqueAligns[0] !== 'center')
    ? uniqueAligns[0]
    : '';
  const paramArgs: FuncArg[] = [];
  const hasDelimiters = branchOpen || branchClose;
  const isMatchedPair = branchOpen && branchClose
    && (branchOpen === branchClose || OPEN_BRACKETS[branchOpen] === branchClose);
  if (isMatchedPair) {
    paramArgs.push(namedArg('delim', rawVal(delimiterToTypst(branchOpen))));
  } else {
    paramArgs.push(namedArg('delim', rawVal('#none')));
  }
  if (matAlign) {
    paramArgs.push(namedArg('align', rawVal(`#${matAlign}`)));
  }
  if (augmentStr) {
    paramArgs.push(namedArg('augment', rawVal(augmentStr)));
  }
  const buildExpr = (rNodes: TypstMathNode[]): TypstMathNode => {
    const matNode = buildMatFuncCall(paramArgs, rNodes);
    if (hasDelimiters && !isMatchedPair) {
      return wrapMatInLr(matNode, branchOpen, branchClose);
    }
    return matNode;
  };
  const matExpr = buildExpr(rowNodes);
  const matExprInline = rowNodesInline ? buildExpr(rowNodesInline) : undefined;
  if (frame === 'solid') {
    const boxNode = funcCall('box', [
      namedArg('stroke', rawVal(BOX_STROKE)),
      namedArg('inset', rawVal(BOX_INSET)),
      posArg(inlineMathVal(matExpr, true)),
    ]);
    return {
      node: funcCall('align', [posArg(rawVal('center')), posArg(callVal(boxNode))], { hash: true }),
      nodeInline: matExprInline ?? matExpr,
    };
  }
  if (matExprInline) {
    return {
      node: matExpr,
      nodeInline: matExprInline
    };
  }
  return {
    node: matExpr
  };
};

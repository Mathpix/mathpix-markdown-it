import { MathNode } from "../types";
import {
  RE_NBSP, RE_TAG_EXTRACT, RE_TAG_STRIP,
  DATA_LABEL_KEY, DEFAULT_EQ_NUMBERING, EQ_TAG_FIGURE_KIND,
  TEX_ATOM, MLABELEDTR,
} from "../consts";
import { getChildText, getNodeText, getProp, escapeTypstContent, sanitizeTypstLabel } from "../common";
import { treeContainsMo } from "../bracket-utils";
import { TypstMathNode, ITypstMathSerializer, LabelsMap } from "./types";
import { seq } from "./builders";
import { serializeTypstMath } from "./serialize";

/** Extract the original \label{} key from an mlabeledtr label cell.
 *  Primary: data-label-key property (set by mathjax.ts getTag patch for environments).
 *  Fallback: labels map from MathJax tags system (for bare display math where
 *  getTag isn't called). Matches by mtd id attribute → label key. */
export const getLabelKey = (labelCell: MathNode, labels: LabelsMap): string | null => {
  const key = getProp<string>(labelCell, DATA_LABEL_KEY);
  if (key) {
    return String(key);
  }
  // Fallback: look up label by mtd id in the labels map
  if (labels) {
    try {
      const id = labelCell.attributes?.get('id') as string | undefined;
      if (id) {
        for (const [labelKey, info] of Object.entries(labels)) {
          if (info?.id === id) {
            return labelKey;
          }
        }
      }
    } catch (_e: unknown) { /* */ }
  }
  return null;
};

/** Serialize a tag label mtd as Typst content for use inside [...].
 *  mtext → plain text, math → $typst_math$.
 *  "(1.2)" → "1.2", "($x\sqrt{5}$ 1.3.1)" → "$x sqrt(5)$ 1.3.1".
 *  NOTE: returns a plain string because tag content lives in Typst content-mode,
 *  not math-mode. */
export const serializeTagContent = (labelCell: MathNode, serialize: ITypstMathSerializer): string => {
  try {
    const parts: string[] = [];
    const visitChild = (child: MathNode) => {
      if (!child) {
        return;
      }
      if (child.kind === 'mtext') {
        let text = getChildText(child);
        if (text) {
          text = text.replace(RE_NBSP, ' ');
          text = escapeTypstContent(text);
          parts.push(text);
        }
      } else if (child.isInferred) {
        if (child.childNodes) {
          for (const c of child.childNodes) {
            visitChild(c);
          }
        }
      } else if (child.kind === 'mrow' || child.kind === TEX_ATOM) {
        const hasMtext = child.childNodes?.some(
          (c: MathNode) => c && (c.kind === 'mtext' || (c.isInferred && c.childNodes?.some((cc: MathNode) => cc?.kind === 'mtext')))
        );
        if (hasMtext) {
          if (child.childNodes) {
            for (const c of child.childNodes) {
              visitChild(c);
            }
          }
        } else {
          const mathStr = serializeTypstMath(serialize.visitNode(child)).trim();
          if (mathStr) {
            parts.push('$' + mathStr + '$');
          }
        }
      } else {
        const mathStr = serializeTypstMath(serialize.visitNode(child)).trim();
        if (mathStr) {
          parts.push('$' + mathStr + '$');
        }
      }
    };
    if (labelCell.childNodes) {
      for (const child of labelCell.childNodes) {
        visitChild(child);
      }
    }
    return parts.join('').trim();
  } catch (_e: unknown) {
    return '';
  }
};

// Extract explicit \tag{...} from a condition cell's mtext content.
export const extractTagFromConditionCell = (cell: MathNode): string | null => {
  let lastTag: string | null = null;
  const walk = (n: MathNode): void => {
    if (!n) {
      return;
    }
    if (n.kind === 'mtext') {
      const text = getChildText(n);
      const re = new RegExp(
        RE_TAG_EXTRACT.source,
        RE_TAG_EXTRACT.flags.includes('g') ? RE_TAG_EXTRACT.flags : RE_TAG_EXTRACT.flags + 'g'
      );
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        lastTag = m[1];
      }
      return;
    }
    n.childNodes?.forEach(walk);
  };
  walk(cell);
  return lastTag;
};

// Detect numcases/subnumcases pattern
export const isNumcasesTable = (node: MathNode): boolean => {
  if (!node.childNodes || node.childNodes.length === 0) {
    return false;
  }
  const firstRow = node.childNodes[0];
  if (firstRow.kind !== MLABELEDTR) {
    return false;
  }
  if (!firstRow.childNodes || firstRow.childNodes.length < 3) {
    return false;
  }
  const prefixCell = firstRow.childNodes[1];
  return treeContainsMo(prefixCell, '{');
};

/** Check if a node is nested inside a mat()/cases() cell */
export const isInsideMatrixCell = (node: MathNode): boolean => {
  let current = node.parent;
  while (current) {
    if (current.kind === 'mtd') {
      const mtr = current.parent;
      const outerTable = mtr?.parent;
      if (outerTable?.kind === 'mtable') {
        const firstRow = outerTable.childNodes?.[0];
        const isOuterEqnArray = firstRow?.attributes?.get('displaystyle') === true;
        if (!isOuterEqnArray) {
          return true;
        }
        const outerHasLines = outerTable.attributes.isSet('rowlines')
          || outerTable.attributes.isSet('columnlines');
        if (outerHasLines) {
          return true;
        }
        current = outerTable.parent;
        continue;
      }
      return false;
    }
    current = current.parent;
  }
  return false;
};

/** Check if a node is inside an eqnArray cell with sibling content. */
export const isInsideEqnArrayCellWithSiblings = (node: MathNode): boolean => {
  let current = node.parent;
  const MAX_DEPTH = 20;
  for (let i = 0; i < MAX_DEPTH && current; i++) {
    if (current.isInferred && current.parent?.kind === 'mtd') {
      const siblingCount = current.childNodes?.length ?? 0;
      if (siblingCount <= 1) {
        return false;
      }
      const mtr = current.parent.parent;
      const outerTable = mtr?.parent;
      if (outerTable?.kind === 'mtable') {
        const firstRow = outerTable.childNodes?.[0];
        return firstRow?.attributes?.get('displaystyle') === true;
      }
      return false;
    }
    if (current.kind === 'mtd') {
      const contentCount = current.childNodes?.length ?? 0;
      if (contentCount <= 1) {
        return false;
      }
      const mtr = current.parent;
      const outerTable = mtr?.parent;
      if (outerTable?.kind === 'mtable') {
        const firstRow = outerTable.childNodes?.[0];
        return firstRow?.attributes?.get('displaystyle') === true;
      }
      return false;
    }
    current = current.parent;
  }
  return false;
};

/** Count the actual maximum number of columns across all rows. */
const getActualColumnCount = (node: MathNode): number => {
  let maxCols = 0;
  for (const row of node.childNodes ?? []) {
    const cols = row.childNodes?.length ?? 0;
    if (cols > maxCols) {
      maxCols = cols;
    }
  }
  return maxCols;
};

/** Compute Typst augment string from rowlines/columnlines attributes. */
export const computeAugment = (node: MathNode): string => {
  const columnlines = node.attributes.isSet('columnlines')
    ? String(node.attributes.get('columnlines') || '').trim().split(/\s+/)
    : [];
  const rowlines = node.attributes.isSet('rowlines')
    ? String(node.attributes.get('rowlines') || '').trim().split(/\s+/)
    : [];
  const actualCols = getActualColumnCount(node);
  const maxVline = actualCols > 0 ? actualCols - 1 : 0;
  const vlinePositions: number[] = [];
  let hasDashedLine = false;
  let hasSolidLine = false;
  for (let i = 0; i < columnlines.length; i++) {
    if (columnlines[i] === 'solid' || columnlines[i] === 'dashed') {
      const pos = i + 1;
      if (pos > maxVline) {
        continue;
      }
      vlinePositions.push(pos);
      if (columnlines[i] === 'dashed') {
        hasDashedLine = true;
      } else {
        hasSolidLine = true;
      }
    }
  }
  const hlinePositions: number[] = [];
  for (let i = 0; i < rowlines.length; i++) {
    if (rowlines[i] === 'solid' || rowlines[i] === 'dashed') {
      hlinePositions.push(i + 1);
      if (rowlines[i] === 'dashed') {
        hasDashedLine = true;
      } else {
        hasSolidLine = true;
      }
    }
  }
  if (hlinePositions.length === 0 && vlinePositions.length === 0) return '';
  const parts: string[] = [];
  if (hlinePositions.length === 1) {
    parts.push(`hline: ${hlinePositions[0]}`);
  } else if (hlinePositions.length > 1) {
    parts.push(`hline: (${hlinePositions.join(', ')})`);
  }
  if (vlinePositions.length === 1) {
    parts.push(`vline: ${vlinePositions[0]}`);
  } else if (vlinePositions.length > 1) {
    parts.push(`vline: (${vlinePositions.join(', ')})`);
  }
  if (hasDashedLine && !hasSolidLine) {
    parts.push('stroke: (dash: "dashed")');
  }
  return `#(${parts.join(', ')})`;
};

/** Build a #figure() wrapper for an explicit equation tag with a label. */
export const buildFigureTag = (tagContent: string, labelKey: string): string => {
  const figure = `#figure(kind: "${EQ_TAG_FIGURE_KIND}", supplement: none, numbering: n => [${tagContent}], [${tagContent}])`;
  return `[${figure} <${sanitizeTypstLabel(labelKey)}>]`;
};

/** Build an auto-numbered tag entry with a label. */
export const buildAutoTagWithLabel = (labelKey: string): string => {
  const getNum = `numbering(${DEFAULT_EQ_NUMBERING}, ..counter(math.equation).get())`;
  const figure = `#figure(kind: "${EQ_TAG_FIGURE_KIND}", supplement: none, numbering: _ => n, [#n])`;
  return `{ counter(math.equation).step(); context { let n = ${getNum}; [${figure} <${sanitizeTypstLabel(labelKey)}>] } }`;
};

/** Simple auto-numbered tag entry. */
export const AUTO_TAG_ENTRY = `{ counter(math.equation).step(); context counter(math.equation).display(${DEFAULT_EQ_NUMBERING}) }`;

/** Flattenable containers for prefix extraction. */
const FLATTENABLE_KINDS: ReadonlySet<string> = new Set(['mtd', 'mpadded', 'mstyle']);
const shouldFlattenNode = (n: MathNode): boolean =>
  FLATTENABLE_KINDS.has(n.kind) || n.isInferred;

/** Visit flat children until stopMo, return SeqNode (for numcases prefix extraction). */
export const visitPrefixBeforeMo = (
  node: MathNode, serialize: ITypstMathSerializer, stopMoText: string,
): TypstMathNode | null => {
  const flatChildren: MathNode[] = [];
  const extractFlat = (n: MathNode): void => {
    if (!n || !n.childNodes) {
      return;
    }
    if (n.kind === 'mphantom') {
      return;
    }
    if (shouldFlattenNode(n)) {
      for (const child of n.childNodes) {
        extractFlat(child);
      }
    } else {
      flatChildren.push(n);
    }
  };
  extractFlat(node);
  const result: TypstMathNode[] = [];
  for (const child of flatChildren) {
    if (child.kind === 'mo' && getNodeText(child) === stopMoText) {
      break;
    }
    result.push(serialize.visitNode(child));
  }
  if (result.length === 0) {
    return null;
  }
  return seq(result);
};

/** Visit a cell's children, skipping mtext nodes that contain \tag{...}. */
export const visitCellWithoutTag = (mtdNode: MathNode, serialize: ITypstMathSerializer): TypstMathNode => {
  const children: TypstMathNode[] = [];
  const walk = (n: MathNode): void => {
    if (!n) {
      return;
    }
    if (n.isInferred && n.childNodes) {
      for (const c of n.childNodes) {
        walk(c);
      }
      return;
    }
    if (n.kind === 'mtext') {
      const text = getChildText(n);
      if (text && RE_TAG_EXTRACT.test(text)) {
        // Strip \tag{...} — if remaining text is non-empty, visit it
        const stripped = text.replace(RE_TAG_STRIP, '').replace(/\s{2,}/g, ' ').trim();
        if (stripped) {
          children.push(serialize.visitNode(n));
        }
        return;
      }
    }
    children.push(serialize.visitNode(n));
  };
  if (mtdNode.childNodes) {
    for (const c of mtdNode.childNodes) {
      walk(c);
    }
  }
  return children.length === 1
    ? children[0]
    : seq(children);
};

import { ITypstData, ITypstSerializer, HandlerFn, MathNode } from "./types";
import {
  RE_NBSP, RE_CONTENT_SPECIAL, RE_TAG_EXTRACT, RE_TAG_STRIP,
  DATA_PRE_CONTENT, DATA_POST_CONTENT,
  DATA_TAG_AUTO, DATA_LABEL_KEY, DEFAULT_EQ_NUMBERING, EQ_TAG_FIGURE_KIND,
  OPEN_BRACKETS,
} from "./consts";
import { initTypstData, addToTypstData, getChildText, getProp } from "./common";
import { escapeCasesSeparators } from "./escape-utils";
import {
  treeContainsMo, serializePrefixBeforeMo, replaceUnpairedBrackets, delimiterToTypst,
  escapeLrDelimiter,
} from "./bracket-utils";

/** Extract the original \label{} key from an mlabeledtr label cell.
 *  MathJax stores the id as "mjx-eqn:<label_key>" when useLabelIds is true. */
const getLabelKey = (labelCell: MathNode): string | null => {
  const key = getProp<string>(labelCell, DATA_LABEL_KEY);
  return key ? String(key) : null;
};

/** Serialize a tag label mtd as Typst content for use inside [...].
 *  mtext → plain text, math → $typst_math$.
 *  "(1.2)" → "1.2", "($x\sqrt{5}$ 1.3.1)" → "$x sqrt(5)$ 1.3.1". */
const serializeTagContent = (labelCell: MathNode, serialize: ITypstSerializer): string => {
  try {
    const parts: string[] = [];
    const visitChild = (child: MathNode) => {
      if (!child) return;
      if (child.kind === 'mtext') {
        let text = getChildText(child);
        if (text) {
          text = text.replace(RE_NBSP, ' ');
          text = text.replace(RE_CONTENT_SPECIAL, '\\$&');
          parts.push(text);
        }
      } else if (child.isInferred) {
        if (child.childNodes) {
          for (const c of child.childNodes) {
            visitChild(c);
          }
        }
      } else if (child.kind === 'mrow' || child.kind === 'TeXAtom') {
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
          const data: ITypstData = serialize.visitNode(child, '');
          const mathStr = data.typst.trim();
          if (mathStr) {
            parts.push('$' + mathStr + '$');
          }
        }
      } else {
        const data: ITypstData = serialize.visitNode(child, '');
        const mathStr = data.typst.trim();
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
// Returns the tag content (e.g. "3.12") or null if no \tag found.
// When multiple \tag{} are present, the last one wins (LaTeX behavior).
const RE_TAG_EXTRACT_G = new RegExp(
  RE_TAG_EXTRACT.source,
  RE_TAG_EXTRACT.flags.includes('g') ? RE_TAG_EXTRACT.flags : RE_TAG_EXTRACT.flags + 'g'
);

const extractTagFromConditionCell = (cell: MathNode): string | null => {
  let lastTag: string | null = null;
  const walk = (n: MathNode): void => {
    if (!n) return;
    if (n.kind === 'mtext') {
      const text = getChildText(n);
      RE_TAG_EXTRACT_G.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = RE_TAG_EXTRACT_G.exec(text)) !== null) {
        lastTag = m[1];
      }
      return;
    }
    n.childNodes?.forEach(walk);
  };
  walk(cell);
  return lastTag;
};

// Detect numcases/subnumcases pattern (best-effort heuristic):
// - First row is mlabeledtr with 3+ children (label + prefix + content [+ condition])
//   3 children: empty prefix or no & separator → label + prefix_with_brace + content
//   4 children: non-empty prefix with & separator → label + prefix + value + condition
// - First row's cell[1] contains a visible '{' mo (inside mpadded, outside mphantom)
// Note: '{' as a math symbol (e.g. \{x\}) in cell[1] could cause a false positive,
// but this position is almost always the cases brace in labeled equation arrays.
const isNumcasesTable = (node: MathNode): boolean => {
  if (!node.childNodes || node.childNodes.length === 0) return false;
  const firstRow = node.childNodes[0];
  if (firstRow.kind !== 'mlabeledtr') return false;
  if (firstRow.childNodes.length < 3) return false;
  // Check that cell[1] (first data column) contains a '{' brace
  const prefixCell = firstRow.childNodes[1];
  return treeContainsMo(prefixCell, '{');
};

/** Build a label suffix ` <key>` or empty string. */
const labelSuffix = (key: string | null): string =>
  key ? ` <${key}>` : '';

/** Build a #figure() wrapper for an explicit equation tag with a label. */
const buildFigureTag = (tagContent: string, labelKey: string): string => {
  const figure = `#figure(kind: "${EQ_TAG_FIGURE_KIND}", supplement: none, numbering: n => [${tagContent}], [${tagContent}])`;
  return `[${figure} <${labelKey}>]`;
};

/** Build an auto-numbered tag entry with a label (counter step + figure for referenceability). */
const buildAutoTagWithLabel = (labelKey: string): string => {
  const getNum = `numbering(${DEFAULT_EQ_NUMBERING}, ..counter(math.equation).get())`;
  const figure = `#figure(kind: "${EQ_TAG_FIGURE_KIND}", supplement: none, numbering: _ => n, [#n])`;
  return `{ counter(math.equation).step(); context { let n = ${getNum}; [${figure} <${labelKey}>] } }`;
};

/** Simple auto-numbered tag entry (counter step + display). */
const AUTO_TAG_ENTRY = `{ counter(math.equation).step(); context counter(math.equation).display(${DEFAULT_EQ_NUMBERING}) }`;

/** numcases/subnumcases → #grid() with cases + numbering column */
const buildNumcasesGrid = (node: MathNode, serialize: ITypstSerializer, countRow: number): ITypstData => {
  let res: ITypstData = initTypstData();
  const firstRow = node.childNodes[0];
  const prefixCell = firstRow.childNodes[1]; // cell after label
  const prefix = serializePrefixBeforeMo(prefixCell, serialize, '{');
  // Determine tag source for each row:
  // 1. Condition-embedded \tag{...} in mtext (MathJax leaves it as literal text)
  // 2. Label cell explicit tag (MathJax processed \tag, data-tag-auto is false)
  // 3. Auto-numbered (data-tag-auto is true)
  const rowTagSources: { source: 'condition' | 'label' | 'auto'; content: string; labelKey: string | null }[] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    const labelCell = (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) ? mtrNode.childNodes[0] : null;
    const labelKey = labelCell ? getLabelKey(labelCell) : null;
    // Check condition cell for embedded \tag{...} in mtext
    const condCell = mtrNode.childNodes[mtrNode.childNodes.length - 1];
    const condTag = extractTagFromConditionCell(condCell);
    if (condTag) {
      rowTagSources.push({ source: 'condition', content: condTag, labelKey });
    } else if (labelCell) {
      const isAutoNumber = !!getProp<boolean>(labelCell, DATA_TAG_AUTO);
      if (!isAutoNumber) {
        const tagContent = serializeTagContent(labelCell, serialize);
        rowTagSources.push({ source: 'label', content: tagContent, labelKey });
      } else {
        rowTagSources.push({ source: 'auto', content: '', labelKey });
      }
    } else {
      rowTagSources.push({ source: 'auto', content: '', labelKey: null });
    }
  }
  const caseRows: string[] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    const startCol = mtrNode.kind === 'mlabeledtr' ? 2 : 1; // skip label + prefix
    const cells: string[] = [];
    for (let j = startCol; j < mtrNode.childNodes.length; j++) {
      const mtdNode = mtrNode.childNodes[j];
      const cellData: ITypstData = serialize.visitNode(mtdNode, '');
      let trimmed = cellData.typst.trim();
      // Strip \tag{...} from condition column if tag was extracted from there
      if (j === mtrNode.childNodes.length - 1 && rowTagSources[i].source === 'condition') {
        trimmed = trimmed.replace(RE_TAG_STRIP, '');
        trimmed = trimmed.replace(/\s{2,}/g, ' ');
        trimmed = trimmed.replace(/\s+"$/g, '"');
        trimmed = trimmed.trim();
      }
      if (trimmed) cells.push(trimmed);
    }
    if (cells.length === 1) {
      caseRows.push(escapeCasesSeparators(replaceUnpairedBrackets(cells[0])));
    } else {
      caseRows.push(cells.map(c => escapeCasesSeparators(replaceUnpairedBrackets(c))).join(' & '));
    }
  }
  let casesContent: string;
  if (caseRows.length >= 2) {
    casesContent = `cases(\n  ${caseRows.join(',\n  ')},\n)`;
  } else {
    casesContent = `cases(${caseRows.join(', ')})`;
  }
  const mathContent = prefix ? `${prefix} ${casesContent}` : casesContent;
  const tagEntries: string[] = [];
  for (let i = 0; i < countRow; i++) {
    const info = rowTagSources[i];
    let tagText = '';
    if (info.source === 'condition') {
      // Escape content-mode special chars in condition-embedded tag text
      tagText = `(${info.content.replace(RE_CONTENT_SPECIAL, '\\$&')})`;
    } else if (info.source === 'label' && info.content) {
      tagText = info.content;  // already escaped by serializeTagContent
    }
    if (tagText && info.labelKey) {
      // Explicit tag with label — wrap in #figure() so the label is referenceable
      tagEntries.push(buildFigureTag(tagText, info.labelKey));
    } else if (tagText) {
      tagEntries.push(`[${tagText}]`);
    } else if (info.labelKey) {
      // Auto-numbered with label — step counter outside context, wrap in #figure() for referenceability
      tagEntries.push(buildAutoTagWithLabel(info.labelKey));
    } else {
      tagEntries.push(AUTO_TAG_ENTRY);
    }
  }
  const gridLines: string[] = [
    '#grid(',
    '  columns: (1fr, auto),',
    '  align: (left, right + horizon),',
    `  math.equation(block: true, numbering: none, $ ${mathContent} $),`,
    '  grid(',
    '    row-gutter: 0.65em,',
  ];
  for (const entry of tagEntries) {
    gridLines.push(`    ${entry},`);
  }
  gridLines.push('  ),');
  gridLines.push(')');
  res = addToTypstData(res, { typst: gridLines.join('\n') });
  res.typst_inline = mathContent;
  return res;
};

/** Join rows with \\ separators, optionally prepending preContent. */
const joinRows = (rows: string[], preContent: string): string =>
  preContent
    ? `${preContent} \\\n${rows.join(' \\\n')}`
    : rows.join(' \\\n');

/** eqnArray with tags → number-align / separate / no-tag strategies */
const buildTaggedEqnArray = (
  node: MathNode, serialize: ITypstSerializer, inputRows: string[], countRow: number,
  preContent: string, postContent: string
): ITypstData => {
  let res: ITypstData = initTypstData();
  const rows = [...inputRows];
  const rowTagInfos: { isTagged: boolean; isAutoTag: boolean; isExplicitTag: boolean; tagContent: string; labelKey: string | null }[] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    if (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) {
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
      rowTagInfos.push({ isTagged: false, isAutoTag: false, isExplicitTag: false, tagContent: '', labelKey: null });
    }
  }
  const explicitTagIndices = rowTagInfos.map((r, i) => r.isExplicitTag ? i : -1).filter(i => i >= 0);
  const autoTagIndices = rowTagInfos.map((r, i) => r.isAutoTag ? i : -1).filter(i => i >= 0);
  const totalTagged = explicitTagIndices.length + autoTagIndices.length;
  // Strategy: number-align — exactly ONE explicit tag in multi-row, no auto-tags
  if (explicitTagIndices.length === 1 && autoTagIndices.length === 0 && countRow > 1) {
    const tagIdx = explicitTagIndices[0];
    const info = rowTagInfos[tagIdx];
    // Merge pre/post content into rows
    if (postContent && rows.length > 0) {
      rows[rows.length - 1] += ` ${postContent}`;
    }
    // Determine number-align based on tag position
    // When preContent exists, it becomes an extra row at the top
    const totalRows = (preContent ? countRow + 1 : countRow)
      + (postContent && rows.length === 0 ? 1 : 0);
    const adjustedTagIdx = preContent ? tagIdx + 1 : tagIdx;
    let numberAlign: string;
    if (adjustedTagIdx === totalRows - 1) {
      numberAlign = 'end + bottom';
    } else if (adjustedTagIdx === 0) {
      numberAlign = 'end + top';
    } else {
      numberAlign = 'end + horizon';
    }
    const mathContent = joinRows(rows, preContent);
    const supplementPart = info.labelKey ? ', supplement: none' : '';
    const eqn = `#math.equation(block: true${supplementPart}, numbering: n => [${info.tagContent}], number-align: ${numberAlign}, $ ${mathContent} $)`;
    const block = `${eqn}${labelSuffix(info.labelKey)}\n#counter(math.equation).update(n => n - 1)`;
    res = addToTypstData(res, { typst: block });
    res.typst_inline = joinRows(rows, preContent);
  } else if (totalTagged > 0) {
    // Strategy: separate — multiple tags or auto-numbered rows
    // Each row becomes a separate #math.equation block
    // Merge pre/post content into rows
    if (preContent && rows.length > 0) {
      rows[0] = `${preContent} \\\n${rows[0]}`;
    }
    if (postContent && rows.length > 0) {
      rows[rows.length - 1] += ` ${postContent}`;
    }
    const eqnBlocks: string[] = [];
    for (let i = 0; i < countRow; i++) {
      const info = rowTagInfos[i];
      const rowContent = rows[i];
      if (info.isTagged) {
        const numbering = info.isAutoTag
          ? DEFAULT_EQ_NUMBERING
          : `n => [${info.tagContent}]`;
        const supplementPart = info.labelKey ? ', supplement: none' : '';
        eqnBlocks.push(
          `#math.equation(block: true${supplementPart}, numbering: ${numbering}, $ ${rowContent} $)${labelSuffix(info.labelKey)}`
        );
        if (info.isExplicitTag) {
          eqnBlocks.push('#counter(math.equation).update(n => n - 1)');
        }
      } else {
        eqnBlocks.push(`#math.equation(block: true, numbering: none, $ ${rowContent} $)`);
      }
    }
    res = addToTypstData(res, { typst: eqnBlocks.join('\n') });
    res.typst_inline = rows.join(' \\\n');
  } else {
    // mlabeledtr nodes present but no actual tag content — treat as no-tag
    return buildUntaggedEqnArray(rows, preContent, postContent);
  }
  return res;
};

/** eqnArray without tags → rows with \\ separators */
const buildUntaggedEqnArray = (
  inputRows: string[], preContent: string, postContent: string
): ITypstData => {
  let res: ITypstData = initTypstData();
  const rows = [...inputRows];
  if (postContent && rows.length > 0) {
    rows[rows.length - 1] += ` ${postContent}`;
  }
  const content = joinRows(rows, preContent);
  res = addToTypstData(res, { typst: content });
  return res;
};

/** matrix → mat(delim: ..., ...) with augment/align/frame */
const buildMatrix = (
  node: MathNode, rows: string[], branchOpen: string, branchClose: string
): ITypstData => {
  let res: ITypstData = initTypstData();
  let matContent: string;
  if (rows.length >= 2) {
    matContent = `\n  ${rows.join(';\n  ')},\n`;
  } else {
    matContent = rows.join('; ');
  }
  const columnlines = node.attributes.isSet('columnlines')
    ? String(node.attributes.get('columnlines') || '').trim().split(/\s+/)
    : [];
  const rowlines = node.attributes.isSet('rowlines')
    ? String(node.attributes.get('rowlines') || '').trim().split(/\s+/)
    : [];
  const frame = node.attributes.isSet('frame')
    ? String(node.attributes.get('frame') || '')
    : '';
  const vlinePositions: number[] = [];
  for (let i = 0; i < columnlines.length; i++) {
    if (columnlines[i] === 'solid' || columnlines[i] === 'dashed') {
      vlinePositions.push(i + 1);
    }
  }
  const hlinePositions: number[] = [];
  for (let i = 0; i < rowlines.length; i++) {
    if (rowlines[i] === 'solid' || rowlines[i] === 'dashed') {
      hlinePositions.push(i + 1);
    }
  }
  let augmentStr = '';
  if (hlinePositions.length > 0 || vlinePositions.length > 0) {
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
    augmentStr = `augment: #(${parts.join(', ')})`;
  }
  const columnAlign = String(node.attributes.get('columnalign') || '');
  const alignArr = columnAlign ? columnAlign.trim().split(/\s+/) : [];
  const uniqueAligns = [...new Set(alignArr)];
  const matAlign = (uniqueAligns.length === 1 && uniqueAligns[0] !== 'center')
    ? uniqueAligns[0]  // 'left' or 'right'
    : '';
  const params: string[] = [];
  const hasDelimiters = branchOpen || branchClose;
  // Matched pair (same char like |…| or paired like (…)) → mat(delim: ...).
  // Mismatched or asymmetric → mat(delim: #none) wrapped in lr() below.
  const isMatchedPair = branchOpen && branchClose
    && (branchOpen === branchClose || OPEN_BRACKETS[branchOpen] === branchClose);
  if (isMatchedPair) {
    params.push(`delim: ${delimiterToTypst(branchOpen)}`);
  } else {
    params.push('delim: #none');
  }
  if (matAlign) {
    params.push(`align: #${matAlign}`);
  }
  if (augmentStr) {
    params.push(augmentStr);
  }
  const paramStr = params.length > 0 ? params.join(', ') + ', ' : '';
  let matExpr = `mat(${paramStr}${matContent})`;
  // Non-matched delimiters (asymmetric or mismatched): wrap mat() in lr()
  if (hasDelimiters && !isMatchedPair) {
    const openEsc = branchOpen ? escapeLrDelimiter(branchOpen) : '';
    const closeEsc = branchClose ? escapeLrDelimiter(branchClose) : '';
    if (openEsc && closeEsc) {
      matExpr = `lr(${openEsc} ${matExpr} ${closeEsc})`;
    } else if (openEsc) {
      matExpr = `lr(${openEsc} ${matExpr})`;
    } else if (closeEsc) {
      matExpr = `lr(${matExpr} ${closeEsc})`;
    }
  }
  if (frame === 'solid') {
    res = addToTypstData(res, { typst: `#box(stroke: 0.5pt, inset: 3pt, $ ${matExpr} $)`, typst_inline: matExpr });
  } else {
    res = addToTypstData(res, { typst: matExpr });
  }
  return res;
};

export const mtable: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const countRow = node.childNodes.length;
  const envName = String(node.attributes.get('name') || '');
  // Check for enclosing brackets from \left...\right (mrow parent with open/close)
  const parentMrow = node.parent?.kind === 'mrow' ? node.parent : null;
  const openProp = getProp<string>(parentMrow, 'open');
  const closeProp = getProp<string>(parentMrow, 'close');
  const branchOpen: string = openProp !== undefined ? String(openProp) : '';
  const branchClose: string = closeProp !== undefined ? String(closeProp) : '';
  // Determine if this is a cases environment
  const isCases = envName === 'cases' || (branchOpen === '{' && branchClose === '');
  // Detect numcases/subnumcases pattern
  const isNumcases = isNumcasesTable(node);
  // Determine if this is an equation array (align, gather, split, etc.)
  // Skip eqnArray detection for numcases — it should be treated as cases
  const isEqnArray = !isNumcases && !isCases && node.childNodes.length > 0
    && node.childNodes[0].attributes?.get('displaystyle') === true;
  if (isNumcases) {
    return buildNumcasesGrid(node, serialize, countRow);
  }
  const rows: string[] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    const countColl = mtrNode.childNodes?.length || 0;
    // For mlabeledtr (numbered equation rows), the first child is the
    // equation number label — skip it so we only emit the math content
    const startCol = mtrNode.kind === 'mlabeledtr' ? 1 : 0;
    const cells: string[] = [];
    for (let j = startCol; j < countColl; j++) {
      const mtdNode = mtrNode.childNodes[j];
      const cellData: ITypstData = serialize.visitNode(mtdNode, '');
      cells.push(cellData.typst.trim());
    }
    if (isEqnArray) {
      // Join cells with & alignment markers.
      // Within each column pair (right-left): &
      // Between column pairs: &quad for visual spacing.
      const pairs: string[] = [];
      for (let k = 0; k < cells.length; k += 2) {
        if (k + 1 < cells.length) {
          pairs.push(`${cells[k]} &${cells[k + 1]}`);
        } else {
          pairs.push(cells[k]);
        }
      }
      rows.push(pairs.join(' &quad '));
    } else if (isCases) {
      // Cases: escape top-level commas in each cell to prevent them
      // being parsed as cases() argument separators, then join with &
      rows.push(cells.map(c => escapeCasesSeparators(replaceUnpairedBrackets(c))).join(' & '));
    } else {
      // Matrix: escape top-level commas and semicolons in each cell
      // to prevent them being parsed as mat() cell/row separators
      rows.push(cells.map(c => escapeCasesSeparators(replaceUnpairedBrackets(c))).join(', '));
    }
  }
  if (isEqnArray) {
    const hasAnyTag = node.childNodes.some(
      (child: MathNode) => child.kind === 'mlabeledtr'
    );
    const preContent = String(getProp<string>(node, DATA_PRE_CONTENT) || '');
    const postContent = String(getProp<string>(node, DATA_POST_CONTENT) || '');
    if (hasAnyTag) {
      return buildTaggedEqnArray(node, serialize, rows, countRow, preContent, postContent);
    } else {
      return buildUntaggedEqnArray(rows, preContent, postContent);
    }
  } else if (isCases) {
    // Cases environment
    let casesBody: string;
    if (rows.length >= 2) {
      casesBody = `cases(\n  ${rows.join(',\n  ')},\n)`;
    } else {
      casesBody = `cases(${rows.join(', ')})`;
    }
    res = addToTypstData(res, { typst: casesBody });
  } else {
    return buildMatrix(node, rows, branchOpen, branchClose);
  }
  return res;
};

export const mtr: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  for (let i = 0; i < node.childNodes.length; i++) {
    if (i > 0) {
      res = addToTypstData(res, { typst: ', ' });
    }
    const data: ITypstData = serialize.visitNode(node.childNodes[i], '');
    res = addToTypstData(res, data);
  }
  return res;
};

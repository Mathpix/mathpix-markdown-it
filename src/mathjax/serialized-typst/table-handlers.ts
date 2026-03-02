import {
  ITypstData, initTypstData, addToTypstData,
  RE_NBSP, RE_CONTENT_SPECIAL, RE_TAG_EXTRACT, RE_TAG_STRIP,
} from "./common";
import { escapeCasesSeparators } from "./escape-utils";
import {
  treeContainsMo, serializePrefixBeforeMo, replaceUnpairedBrackets, delimiterToTypst,
} from "./bracket-utils";

/** Extract the original \label{} key from an mlabeledtr label cell.
 *  MathJax stores the id as "mjx-eqn:<label_key>" when useLabelIds is true. */
const getLabelKey = (labelCell: any): string | null => {
  const key = labelCell?.properties?.['data-label-key'];
  return key ? String(key) : null;
};

/** Serialize a tag label mtd as Typst content for use inside [...].
 *  mtext → plain text, math → $typst_math$.
 *  "(1.2)" → "1.2", "($x\sqrt{5}$ 1.3.1)" → "$x sqrt(5)$ 1.3.1". */
const serializeTagContent = (labelCell: any, serialize: any): string => {
  try {
    const parts: string[] = [];
    const visitChild = (child: any) => {
      if (!child) return;
      if (child.kind === 'mtext') {
        // Escape content-mode specials: * _ ` @ # <
        let text = child.childNodes?.[0]?.text || '';
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
        // Mixed content (has mtext) → recurse; pure math → serialize as $...$
        const hasMtext = child.childNodes?.some(
          (c: any) => c && (c.kind === 'mtext' || (c.isInferred && c.childNodes?.some((cc: any) => cc?.kind === 'mtext')))
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
  } catch (_e) {
    return '';
  }
};

// Extract explicit \tag{...} from a condition cell's mtext content.
// Returns the tag content (e.g. "3.12") or null if no \tag found.
const extractTagFromConditionCell = (cell: any): string | null => {
  const walk = (n: any): string | null => {
    if (!n) return null;
    if (n.kind === 'mtext') {
      const text = n.childNodes?.[0]?.text || '';
      const match = text.match(RE_TAG_EXTRACT);
      return match ? match[1] : null;
    }
    if (n.childNodes) {
      for (const child of n.childNodes) {
        const found = walk(child);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(cell);
};

// Detect numcases/subnumcases pattern:
// - First row is mlabeledtr with 3+ children (label + prefix + content [+ condition])
//   3 children: empty prefix or no & separator → label + prefix_with_brace + content
//   4 children: non-empty prefix with & separator → label + prefix + value + condition
// - First row's cell[1] contains a visible '{' mo (inside mpadded, outside mphantom)
const isNumcasesTable = (node): boolean => {
  if (!node.childNodes || node.childNodes.length === 0) return false;
  const firstRow = node.childNodes[0];
  if (firstRow.kind !== 'mlabeledtr') return false;
  if (firstRow.childNodes.length < 3) return false;
  // Check that cell[1] (first data column) contains a '{' brace
  const prefixCell = firstRow.childNodes[1];
  return treeContainsMo(prefixCell, '{');
};

/** numcases/subnumcases → #grid() with cases + numbering column */
const buildNumcasesGrid = (node: any, serialize: any, countRow: number): ITypstData => {
  let res: ITypstData = initTypstData();
  const firstRow = node.childNodes[0];
  const prefixCell = firstRow.childNodes[1]; // cell after label
  const prefix = serializePrefixBeforeMo(prefixCell, serialize, '{');
  // Determine tag source for each row:
  // 1. Condition-embedded \tag{...} in mtext (MathJax leaves it as literal text)
  // 2. Label cell explicit tag (MathJax processed \tag, data-tag-auto is false)
  // 3. Auto-numbered (data-tag-auto is true)
  const autoTagEntry = '{ counter(math.equation).step(); context counter(math.equation).display("(1)") }';
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
      const isAutoNumber = !!(labelCell as any).properties?.['data-tag-auto'];
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
    casesContent = 'cases(\n  ' + caseRows.join(',\n  ') + ',\n)';
  } else {
    casesContent = 'cases(' + caseRows.join(', ') + ')';
  }
  const mathContent = prefix ? prefix + ' ' + casesContent : casesContent;
  const tagEntries: string[] = [];
  for (let i = 0; i < countRow; i++) {
    const info = rowTagSources[i];
    let tagText = '';
    if (info.source === 'condition') {
      // Escape content-mode special chars in condition-embedded tag text
      tagText = '(' + info.content.replace(RE_CONTENT_SPECIAL, '\\$&') + ')';
    } else if (info.source === 'label' && info.content) {
      tagText = info.content;  // already escaped by serializeTagContent
    }
    if (tagText && info.labelKey) {
      // Explicit tag with label — wrap in #figure() so the label is referenceable
      tagEntries.push('[#figure(kind: "eq-tag", supplement: none, numbering: n => [' + tagText + '], [' + tagText + ']) <' + info.labelKey + '>]');
    } else if (tagText) {
      tagEntries.push('[' + tagText + ']');
    } else if (info.labelKey) {
      // Auto-numbered with label — step counter outside context, wrap in #figure() for referenceability
      tagEntries.push('{ counter(math.equation).step(); context { let n = numbering("(1)", ..counter(math.equation).get()); [#figure(kind: "eq-tag", supplement: none, numbering: _ => n, [#n]) <' + info.labelKey + '>] } }');
    } else {
      tagEntries.push(autoTagEntry);
    }
  }
  const gridLines: string[] = [
    '#grid(',
    '  columns: (1fr, auto),',
    '  align: (left, right + horizon),',
    '  math.equation(block: true, numbering: none, $ ' + mathContent + ' $),',
    '  grid(',
    '    row-gutter: 0.65em,',
  ];
  for (const entry of tagEntries) {
    gridLines.push('    ' + entry + ',');
  }
  gridLines.push('  ),');
  gridLines.push(')');

  res = addToTypstData(res, { typst: gridLines.join('\n') });
  res.typst_inline = mathContent;
  return res;
};

/** eqnArray with tags → number-align / separate / no-tag strategies */
const buildTaggedEqnArray = (
  node: any, serialize: any, rows: string[], countRow: number,
  preContent: string, postContent: string
): ITypstData => {
  let res: ITypstData = initTypstData();
  const rowTagInfos: { isTagged: boolean; isAutoTag: boolean; isExplicitTag: boolean; tagContent: string; labelKey: string | null }[] = [];
  for (let i = 0; i < countRow; i++) {
    const mtrNode = node.childNodes[i];
    if (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) {
      const labelCell = mtrNode.childNodes[0];
      const tagContent = serializeTagContent(labelCell, serialize);
      const isAutoNumber = !!(labelCell as any).properties?.['data-tag-auto'];
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
      rows[rows.length - 1] = rows[rows.length - 1] + ' ' + postContent;
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
    const mathContent = preContent
      ? preContent + ' \\\n' + rows.join(' \\\n')
      : rows.join(' \\\n');
    const supplementPart = info.labelKey ? ', supplement: none' : '';
    const numberAlignPart = ', number-align: ' + numberAlign;
    const labelSuffix = info.labelKey ? ' <' + info.labelKey + '>' : '';
    const block = '#math.equation(block: true' + supplementPart
      + ', numbering: n => [' + info.tagContent + ']'
      + numberAlignPart + ', $ ' + mathContent + ' $)' + labelSuffix
      + '\n#counter(math.equation).update(n => n - 1)';
    res = addToTypstData(res, { typst: block });
    res.typst_inline = preContent
      ? preContent + ' \\\n' + rows.join(' \\\n')
      : rows.join(' \\\n');
  } else if (totalTagged > 0) {
    // Strategy: separate — multiple tags or auto-numbered rows
    // Each row becomes a separate #math.equation block
    // Merge pre/post content into rows
    if (preContent && rows.length > 0) {
      rows[0] = preContent + ' \\\n' + rows[0];
    }
    if (postContent && rows.length > 0) {
      rows[rows.length - 1] = rows[rows.length - 1] + ' ' + postContent;
    }
    const eqnBlocks: string[] = [];
    for (let i = 0; i < countRow; i++) {
      const info = rowTagInfos[i];
      const rowContent = rows[i];
      if (info.isTagged) {
        const numbering = info.isAutoTag
          ? '"(1)"'
          : 'n => [' + info.tagContent + ']';
        const labelKey = info.labelKey;
        const labelSuffix = labelKey ? ' <' + labelKey + '>' : '';
        const supplementPart = labelKey ? ', supplement: none' : '';
        eqnBlocks.push(
          '#math.equation(block: true' + supplementPart + ', numbering: ' + numbering + ', $ ' + rowContent + ' $)' + labelSuffix
        );
        if (info.isExplicitTag) {
          eqnBlocks.push('#counter(math.equation).update(n => n - 1)');
        }
      } else {
        eqnBlocks.push('#math.equation(block: true, numbering: none, $ ' + rowContent + ' $)');
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
  rows: string[], preContent: string, postContent: string
): ITypstData => {
  let res: ITypstData = initTypstData();
  if (postContent && rows.length > 0) {
    rows[rows.length - 1] = rows[rows.length - 1] + ' ' + postContent;
  }
  const content = preContent
    ? preContent + ' \\\n' + rows.join(' \\\n')
    : rows.join(' \\\n');
  res = addToTypstData(res, { typst: content });
  return res;
};

/** matrix → mat(delim: ..., ...) with augment/align/frame */
const buildMatrix = (
  node: any, rows: string[], branchOpen: string, branchClose: string
): ITypstData => {
  let res: ITypstData = initTypstData();
  let matContent: string;
  if (rows.length >= 2) {
    matContent = '\n  ' + rows.join(';\n  ') + ',\n';
  } else {
    matContent = rows.join('; ');
  }
  const columnlines = node.attributes.isSet('columnlines')
    ? (node.attributes.get('columnlines') as string).split(' ')
    : [];
  const rowlines = node.attributes.isSet('rowlines')
    ? (node.attributes.get('rowlines') as string).split(' ')
    : [];
  const frame = node.attributes.isSet('frame')
    ? (node.attributes.get('frame') as string)
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
      parts.push('hline: ' + hlinePositions[0]);
    } else if (hlinePositions.length > 1) {
      parts.push('hline: (' + hlinePositions.join(', ') + ')');
    }
    if (vlinePositions.length === 1) {
      parts.push('vline: ' + vlinePositions[0]);
    } else if (vlinePositions.length > 1) {
      parts.push('vline: (' + vlinePositions.join(', ') + ')');
    }
    augmentStr = 'augment: #(' + parts.join(', ') + '), ';
  }
  const columnAlign = node.attributes.get('columnalign') as string;
  const alignArr = columnAlign ? columnAlign.trim().split(/\s+/) : [];
  const uniqueAligns = [...new Set(alignArr)];
  const matAlign = (uniqueAligns.length === 1 && uniqueAligns[0] !== 'center')
    ? uniqueAligns[0]  // 'left' or 'right'
    : '';
  const params: string[] = [];
  const hasDelimiters = branchOpen || branchClose;
  if (hasDelimiters) {
    if (branchOpen) {
      params.push('delim: ' + delimiterToTypst(branchOpen));
    }
  } else {
    // Arrays/matrices without parent delimiters should not have parens
    params.push('delim: #none');
  }
  if (matAlign) {
    params.push('align: #' + matAlign);
  }
  if (augmentStr) {
    params.push(augmentStr.slice(0, -2)); // remove trailing ", "
  }
  const paramStr = params.length > 0 ? params.join(', ') + ', ' : '';
  const matExpr = 'mat(' + paramStr + matContent + ')';
  if (frame === 'solid') {
    res = addToTypstData(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $ ' + matExpr + ' $)', typst_inline: matExpr });
  } else {
    res = addToTypstData(res, { typst: matExpr });
  }
  return res;
};

// --- MTABLE handler: matrices and equation arrays ---
export const mtable = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const countRow = node.childNodes.length;
      const envName = node.attributes.get('name') as string;
      // Check for enclosing brackets from \left...\right (mrow parent with open/close)
      const parentMrow = node.parent?.kind === 'mrow' ? node.parent : null;
      const branchOpen = parentMrow?.properties?.hasOwnProperty('open') ? parentMrow.properties['open'] : '';
      const branchClose = parentMrow?.properties?.hasOwnProperty('close') ? parentMrow.properties['close'] : '';
      // Determine if this is a cases environment
      const isCases = envName === 'cases' || (branchOpen === '{' && branchClose === '');
      // Detect numcases/subnumcases pattern
      const isNumcases = isNumcasesTable(node);
      // Determine if this is an equation array (align, gather, split, etc.)
      // Skip eqnArray detection for numcases — it should be treated as cases
      const isEqnArray = !isNumcases && !isCases && node.childNodes.length > 0
        && node.childNodes[0].attributes?.get('displaystyle');

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
              pairs.push(cells[k] + ' &' + cells[k + 1]);
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
          (child: any) => child.kind === 'mlabeledtr'
        );
        const preContent = (node as any).properties?.['data-pre-content'] || '';
        const postContent = (node as any).properties?.['data-post-content'] || '';
        if (hasAnyTag) {
          return buildTaggedEqnArray(node, serialize, rows, countRow, preContent, postContent);
        } else {
          return buildUntaggedEqnArray(rows, preContent, postContent);
        }
      } else if (isCases) {
        // Cases environment
        let casesBody: string;
        if (rows.length >= 2) {
          casesBody = 'cases(\n  ' + rows.join(',\n  ') + ',\n)';
        } else {
          casesBody = 'cases(' + rows.join(', ') + ')';
        }
        res = addToTypstData(res, { typst: casesBody });
      } else {
        return buildMatrix(node, rows, branchOpen, branchClose);
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MTR handler: table row ---
export const mtr = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (i > 0) {
          res = addToTypstData(res, { typst: ', ' });
        }
        const data: ITypstData = serialize.visitNode(node.childNodes[i], '');
        res = addToTypstData(res, data);
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

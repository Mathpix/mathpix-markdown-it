import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { MmlNode, TextNode, XMLNode, TEXCLASS } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { handle } from './handlers';
import { ITypstData, addToTypstData, addSpaceToTypstData, initTypstData, isThousandSepComma, needsParens, needsTokenSeparator } from './common';
import { findTypstSymbol } from './typst-symbol-map';

// Extract big delimiter info from a TeXAtom node wrapping a sized mo.
// The TeXAtom itself may have texClass=0 (ORD); the OPEN/CLOSE class
// is on the inner inferredMrow or mo node.
// Returns { delim, size, isOpen } if found, or null.
const getBigDelimInfo = (node: any): { delim: string, size: string, isOpen: boolean } | null => {
  try {
    if (node.kind !== 'TeXAtom') return null;
    // TeXAtom > inferredMrow > mo(minsize/maxsize)
    const inferred = node.childNodes?.[0];
    if (!inferred || !inferred.isInferred) return null;
    const mo = inferred.childNodes?.[0];
    if (!mo || mo.kind !== 'mo') return null;
    const atr = mo.attributes?.getAllAttributes() || {};
    if (!atr.minsize) return null;
    // Check if this is OPEN or CLOSE via the mo or inferredMrow texClass
    const tc = mo.texClass ?? inferred.texClass ?? node.texClass;
    if (tc !== TEXCLASS.OPEN && tc !== TEXCLASS.CLOSE) return null;
    const delim = mo.childNodes?.[0]?.text || '';
    return { delim, size: atr.minsize.toString(), isOpen: tc === TEXCLASS.OPEN };
  } catch (e) {
    return null;
  }
};

// Return the text content of a single-mo node (bare mo, mrow or TeXAtom wrapping one mo).
// Used to detect delimiter characters like |, ⌊, ⌋, ⌈, ⌉, ‖, ⟨, ⟩.
const getDelimiterChar = (node: any): string | null => {
  try {
    let moNode: any = null;
    if (node?.kind === 'mo') {
      moNode = node;
    } else if (node?.kind === 'mrow' || node?.kind === 'TeXAtom') {
      let children = node.childNodes;
      if (children?.length === 1 && children[0].isInferred) {
        children = children[0].childNodes;
      }
      if (children?.length === 1 && children[0].kind === 'mo') {
        moNode = children[0];
      }
    }
    return moNode?.childNodes?.[0]?.text || null;
  } catch (_e) {
    return null;
  }
};

// Check if node is msub/msup/msubsup whose BASE is a closing delimiter.
// Returns the delimiter char if found, null otherwise.
// Used to detect \|x\|_2 where the closing ‖ is inside msub(‖, 2).
const getScriptedDelimiterChar = (node: any): string | null => {
  try {
    const k = node?.kind;
    if (k === 'msub' || k === 'msup' || k === 'msubsup') {
      return getDelimiterChar(node.childNodes?.[0]);
    }
    return null;
  } catch (_e) {
    return null;
  }
};

// Node kinds that carry sub/sup scripts (used in \idotsint pattern detection).
const SCRIPT_KINDS: Set<string> = new Set(['msubsup', 'msub', 'msup']);

// Map of opening delimiter char → expected close char + Typst output format.
const BARE_DELIM_PAIRS: Record<string, { close: string; typstOpen: string; typstClose: string }> = {
  '|':      { close: '|',      typstOpen: 'lr(| ', typstClose: ' |)' },
  '\u230A': { close: '\u230B', typstOpen: 'floor(', typstClose: ')' },  // ⌊...⌋
  '\u2308': { close: '\u2309', typstOpen: 'ceil(',  typstClose: ')' },  // ⌈...⌉
  '\u2016': { close: '\u2016', typstOpen: 'norm(',  typstClose: ')' },  // ‖...‖
  '\u27E8': { close: '\u27E9', typstOpen: 'lr(chevron.l ', typstClose: ' chevron.r)' }, // ⟨...⟩
  '\u2329': { close: '\u232A', typstOpen: 'lr(chevron.l ', typstClose: ' chevron.r)' }, // 〈...〉 (old form)
};

export interface ITypstVisitorOptions {
  [key: string]: any;
}

export class SerializedTypstVisitor extends MmlVisitor {
  options: ITypstVisitorOptions = {};

  constructor(options?: ITypstVisitorOptions) {
    super();
    this.options = options || {};
  }

  public visitTree(node: MmlNode): ITypstData {
    return this.visitNode(node, '');
  }

  public visitNode(node: any, ...args: any[]): ITypstData {
    let handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
    return handler.call(this, node, ...args);
  }

  public visitTextNode(node: TextNode, _space: string): ITypstData {
    let res: ITypstData = initTypstData();
    try {
      const text: string = node.getText();
      res = addToTypstData(res, { typst: text });
      return res;
    } catch (e) {
      return res;
    }
  }

  public visitXMLNode(_node: XMLNode, _space: string): ITypstData {
    return initTypstData();
  }

  public visitInferredMrowNode(node: MmlNode, space: string): ITypstData {
    let res: ITypstData = initTypstData();
    try {
      let j = 0;
      while (j < node.childNodes.length) {
        const child: any = node.childNodes[j];
        // Detect big delimiter pattern: TeXAtom(OPEN) ... TeXAtom(CLOSE)
        // with sized mo (from \big, \Big, \bigg, \Bigg)
        const openInfo = getBigDelimInfo(child);
        if (openInfo && openInfo.isOpen) {
          // Find matching CLOSE
          let closeIdx = -1;
          for (let k = j + 1; k < node.childNodes.length; k++) {
            const closeCandidate = getBigDelimInfo(node.childNodes[k]);
            if (closeCandidate && !closeCandidate.isOpen) {
              closeIdx = k;
              break;
            }
          }
          if (closeIdx >= 0) {
            const closeInfo = getBigDelimInfo(node.childNodes[closeIdx]);
            // Serialize content between delimiters
            let content = '';
            for (let k = j + 1; k < closeIdx; k++) {
              const innerData: ITypstData = this.visitNode(node.childNodes[k], space);
              if (needsTokenSeparator(content, innerData.typst)) {
                content += ' ';
              }
              content += innerData.typst;
            }
            const openDelim = findTypstSymbol(openInfo.delim);
            const closeDelim = findTypstSymbol(closeInfo?.delim || ')');
            const lrContent = openDelim + ' ' + content.trim() + ' ' + closeDelim;
            const lrExpr = 'lr(size: #' + openInfo.size + ', ' + lrContent + ')';
            // Add spacing before lr if needed
            if (needsTokenSeparator(res.typst, lrExpr)) {
              addSpaceToTypstData(res);
            }
            res = addToTypstData(res, { typst: lrExpr });
            j = closeIdx + 1;
            continue;
          }
        }
        // Detect paired delimiters without \left...\right:
        // |...| → lr(| ... |), ⌊...⌋ → floor(...), ⌈...⌉ → ceil(...), ‖...‖ → norm(...), ⟨...⟩ → lr(chevron.l ... chevron.r)
        // For symmetric delimiters (|, ‖), skip inside TeXAtom groups
        // (e.g. {|\alpha|} in superscripts) where content is already grouped.
        // Also detects closing delimiters inside msub/msup/msubsup (e.g. \|x\|_2 → norm(x)_2).
        const delimChar = getDelimiterChar(child);
        const delimPair = delimChar ? BARE_DELIM_PAIRS[delimChar] : null;
        if (delimPair && !(delimChar === delimPair.close && (node as any).parent?.kind === 'TeXAtom')) {
          let closeIdx = -1;
          let closeIsScripted = false;
          for (let k = j + 1; k < node.childNodes.length; k++) {
            // First check bare delimiter
            if (getDelimiterChar(node.childNodes[k]) === delimPair.close) {
              closeIdx = k;
              break;
            }
            // Then check delimiter inside msub/msup/msubsup base (e.g. ‖_2)
            if (getScriptedDelimiterChar(node.childNodes[k]) === delimPair.close) {
              closeIdx = k;
              closeIsScripted = true;
              break;
            }
          }
          if (closeIdx > j + 1) {
            let content = '';
            for (let k = j + 1; k < closeIdx; k++) {
              const innerData: ITypstData = this.visitNode(node.childNodes[k], space);
              if (needsTokenSeparator(content, innerData.typst)) {
                content += ' ';
              }
              content += innerData.typst;
            }
            let delimExpr = delimPair.typstOpen + content.trim() + delimPair.typstClose;
            // When the closing delimiter is inside a script node (e.g. ‖_2),
            // extract and append the script parts to the delimited expression.
            if (closeIsScripted) {
              const scriptNode = node.childNodes[closeIdx];
              if (scriptNode.kind === 'msubsup') {
                const sub = scriptNode.childNodes[1] ? this.visitNode(scriptNode.childNodes[1], '').typst.trim() : '';
                const sup = scriptNode.childNodes[2] ? this.visitNode(scriptNode.childNodes[2], '').typst.trim() : '';
                if (sub) delimExpr += '_' + (needsParens(sub) ? '(' + sub + ')' : sub);
                if (sup) delimExpr += '^' + (needsParens(sup) ? '(' + sup + ')' : sup);
              } else if (scriptNode.kind === 'msub') {
                const sub = scriptNode.childNodes[1] ? this.visitNode(scriptNode.childNodes[1], '').typst.trim() : '';
                if (sub) delimExpr += '_' + (needsParens(sub) ? '(' + sub + ')' : sub);
              } else if (scriptNode.kind === 'msup') {
                const sup = scriptNode.childNodes[1] ? this.visitNode(scriptNode.childNodes[1], '').typst.trim() : '';
                if (sup) delimExpr += '^' + (needsParens(sup) ? '(' + sup + ')' : sup);
              }
            }
            if (needsTokenSeparator(res.typst, delimExpr)) {
              addSpaceToTypstData(res);
            }
            res = addToTypstData(res, { typst: delimExpr });
            j = closeIdx + 1;
            continue;
          }
        }
        // Detect \idotsint pattern: mo(∫) mo(⋯) msubsup/msub/msup(mo(∫), ...)
        // Group as lr(integral dots.c integral)_(sub)^(sup)
        if (child?.kind === 'mo' && (child?.childNodes?.[0] as any)?.text === '\u222B') {
          const next1: any = node.childNodes[j + 1];
          const next2: any = node.childNodes[j + 2];
          if (next1?.kind === 'mo' && next1?.childNodes?.[0]?.text === '\u22EF' && next2) {
            const scriptBase = next2.childNodes?.[0];
            if (SCRIPT_KINDS.has(next2.kind)
              && scriptBase?.kind === 'mo'
              && scriptBase?.childNodes?.[0]?.text === '\u222B') {
              // Serialize the three base parts
              const part1: ITypstData = this.visitNode(child, space);
              const part2: ITypstData = this.visitNode(next1, space);
              const part3 = findTypstSymbol('\u222B'); // integral
              // Build base: "integral dots.c integral"
              let baseContent = part1.typst;
              if (needsTokenSeparator(baseContent, part2.typst)) {
                baseContent += ' ';
              }
              baseContent += part2.typst;
              if (needsTokenSeparator(baseContent, part3)) {
                baseContent += ' ';
              }
              baseContent += part3;
              const lrExpr = 'lr(' + baseContent.trim() + ')';
              // Add spacing before lr if needed
              if (needsTokenSeparator(res.typst, lrExpr)) {
                addSpaceToTypstData(res);
              }
              res = addToTypstData(res, { typst: lrExpr });
              // Add scripts from the scripted node (sub at childNodes[1], sup at childNodes[2] for msubsup;
              // single script at childNodes[1] for msub/msup)
              const subChild = next2.kind !== 'msup' ? next2.childNodes[1] : null;
              const supChild = next2.kind === 'msubsup' ? next2.childNodes[2]
                             : next2.kind === 'msup' ? next2.childNodes[1] : null;
              if (subChild) {
                const sub = this.visitNode(subChild, space).typst.trim();
                if (sub) {
                  res = addToTypstData(res, { typst: '_' });
                  res = addToTypstData(res, { typst: needsParens(sub) ? '(' + sub + ')' : sub });
                }
              }
              if (supChild) {
                const sup = this.visitNode(supChild, space).typst.trim();
                if (sup) {
                  res = addToTypstData(res, { typst: '^' });
                  res = addToTypstData(res, { typst: needsParens(sup) ? '(' + sup + ')' : sup });
                }
              }
              j += 3;
              continue;
            }
          }
        }
        // Detect thousand-separator chain: mn, mo(,), mn(3 digits), ...
        // e.g. 1,000,000 → 1\,000\,000 (commas escaped so Typst doesn't treat them as separators)
        // Also handles Indian numbering: 41,70,000 → 41\,70\,000
        if (isThousandSepComma(node, j)) {
          const numData: ITypstData = this.visitNode(child, space);
          if (needsTokenSeparator(res.typst, numData.typst)) {
            addSpaceToTypstData(res);
          }
          let chainTypst = numData.typst;
          let k = j;
          while (isThousandSepComma(node, k)) {
            const nextData: ITypstData = this.visitNode(node.childNodes[k + 2], space);
            chainTypst += '\\,' + nextData.typst;
            k += 2;
          }
          res = addToTypstData(res, { typst: chainTypst });
          j = k + 1;
          continue;
        }
        // Normal processing
        const data: ITypstData = this.visitNode(child, space);
        if (needsTokenSeparator(res.typst, data.typst)) {
          addSpaceToTypstData(res);
        }
        res = addToTypstData(res, data);
        j++;
      }
      return res;
    } catch (e) {
      return res;
    }
  }

  public visitTeXAtomNode(node: MmlNode, space: string): ITypstData {
    let res: ITypstData = initTypstData();
    try {
      const children: ITypstData = this.childNodeMml(node, space + '  ', '\n');
      if (children.typst?.match(/\S/)) {
        res = addToTypstData(res, children);
      }
      return res;
    } catch (e) {
      return res;
    }
  }

  public visitAnnotationNode(_node: MmlNode, _space: string): ITypstData {
    return initTypstData();
  }

  public visitDefault(node: MmlNode, _space: string): ITypstData {
    return this.childNodeMml(node, '  ', '');
  }

  protected childNodeMml(node: MmlNode, _space: string, _nl: string): ITypstData {
    const handleCh = handle.bind(this);
    let res: ITypstData = initTypstData();
    try {
      const data: ITypstData = handleCh(node, this);
      res = addToTypstData(res, data);
      return res;
    } catch (e) {
      return res;
    }
  }
}

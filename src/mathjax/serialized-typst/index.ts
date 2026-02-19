import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { MmlNode, TextNode, XMLNode, TEXCLASS } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { handle } from './handlers';
import { ITypstData, addToTypstData, initTypstData } from './common';
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

// Check if a node represents a single pipe `|` character.
// Handles bare mo(|), mrow wrapping a single mo(|), and inferredMrow in between.
const isSinglePipeNode = (node: any): boolean => {
  try {
    if (!node || !node.childNodes) return false;
    if (node.kind === 'mo') {
      return node.childNodes[0]?.text === '|';
    }
    if (node.kind === 'mrow' || node.kind === 'TeXAtom') {
      let children = node.childNodes;
      if (children.length === 1 && children[0].isInferred) {
        children = children[0].childNodes;
      }
      if (children.length === 1 && children[0].kind === 'mo') {
        return children[0].childNodes?.[0]?.text === '|';
      }
    }
    return false;
  } catch (_e) {
    return false;
  }
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
              if (content && innerData.typst
                && /^[\w."]/.test(innerData.typst)
                && !/[\s({[,|]$/.test(content)) {
                content += ' ';
              }
              content += innerData.typst;
            }
            const openDelim = findTypstSymbol(openInfo.delim);
            const closeDelim = findTypstSymbol(closeInfo?.delim || ')');
            const lrContent = openDelim + ' ' + content.trim() + ' ' + closeDelim;
            const lrExpr = 'lr(size: #' + openInfo.size + ', ' + lrContent + ')';
            // Add spacing before lr if needed
            if (res.typst && /^[\w.]/.test(lrExpr)
              && !/[\s({[,|]$/.test(res.typst)) {
              res.typst += ' ';
            }
            res = addToTypstData(res, { typst: lrExpr });
            j = closeIdx + 1;
            continue;
          }
        }
        // Detect |...| pipe pairs (absolute value without \left...\right).
        // Skip inside TeXAtom groups (e.g. {|\alpha|} in superscripts) where
        // the content is already grouped by the enclosing script parens.
        if (isSinglePipeNode(child) && (node as any).parent?.kind !== 'TeXAtom') {
          let closeIdx = -1;
          for (let k = j + 1; k < node.childNodes.length; k++) {
            if (isSinglePipeNode(node.childNodes[k])) {
              closeIdx = k;
              break;
            }
          }
          if (closeIdx > j + 1) {
            let content = '';
            for (let k = j + 1; k < closeIdx; k++) {
              const innerData: ITypstData = this.visitNode(node.childNodes[k], space);
              if (content && innerData.typst
                && /^[\w."]/.test(innerData.typst)
                && !/[\s({[,|]$/.test(content)) {
                content += ' ';
              }
              content += innerData.typst;
            }
            const pipeExpr = 'lr(| ' + content.trim() + ' |)';
            if (res.typst && /^[\w."]/.test(pipeExpr)
              && !/[\s({[,|]$/.test(res.typst)) {
              res.typst += ' ';
            }
            res = addToTypstData(res, { typst: pipeExpr });
            j = closeIdx + 1;
            continue;
          }
        }
        // Normal processing
        const data: ITypstData = this.visitNode(child, space);
        // Insert space between adjacent children when needed for Typst parsing:
        // word chars, dots, and quoted strings all need separation
        if (res.typst && data.typst
          && /^[\w."]/.test(data.typst)
          && !/[\s({[,|]$/.test(res.typst)) {
          res.typst += ' ';
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

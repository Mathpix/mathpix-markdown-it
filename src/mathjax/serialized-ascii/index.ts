import {MmlVisitor} from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import {MmlNode, TextNode, XMLNode} from 'mathjax-full/js/core/MmlTree/MmlNode.js';

import { handle } from "./handlers";

export class SerializedAsciiVisitor extends MmlVisitor {
  options = null;

  constructor(options) {
    super();
    this.options = options
  }

  public visitTree(node: MmlNode) {
    return this.visitNode(node, '');
  }

  public visitTextNode(node: TextNode, space: string) {
    return node.getText();
  }

  public visitXMLNode(node: XMLNode, space: string) {
    return space + node.getSerializedXML();
  }

  public needsGrouping(element) {
    if (element.parent
      && (element.parent.kind === 'math' || element.parent.kind === 'mstyle'
        || element.parent.kind ==='mtable' || element.parent.kind ==='mtr' || element.parent.kind ==='mtd' || element.parent.kind ==='menclose')) {
      return false;
    }

    if (element.parent.kind === 'TeXAtom' && element.parent.parent.kind === 'inferredMrow') {
      return false;
    }

    if (element.childNodes && element.childNodes.length === 1) {
      if (element.childNodes[0].childNodes && element.childNodes[0].childNodes.length === 1) {
        return false;
      }
    }

    if (element.properties && element.properties.open === '(' && element.properties.close === ')') {
      return false;
    }
    const firstChild = element.childNodes[0];

    if (element.childNodes.length == 1 && firstChild.kind == 'mtext') {
      return false;
    }

    return true;
  }

  public needsGroupingStyle(element) {
    if (element.childNodes.length < 2) { return null }
    let firstChild = element.childNodes[0];
    let firstAtr = this.getAttributes(firstChild);
    if (!firstAtr || !firstAtr.mathvariant || !firstAtr.hasOwnProperty('mathvariant')) { return null }

    for (let i = 1; i< element.childNodes.length; i++) {
      let atr = this.getAttributes(element.childNodes[i]);
      if (!atr || atr.mathvariant !== firstAtr.mathvariant ) {
        return null
      }
    }
    return firstAtr;
  }

  public visitInferredMrowNode(node: MmlNode, space: string) {
    let mml = [];

    const addParens = this.needsGrouping(node);
    const group = addParens ? this.needsGroupingStyle(node) : null;

    if (addParens && !group) {
      mml.push('(')
    }
    for (const child of node.childNodes) {
      mml.push(this.visitNode(child, space));
    }
    if (addParens&& !group) {
      mml.push(')')
    }
    return mml.join('');
  }

  public visitTeXAtomNode(node: MmlNode, space: string) {
    let children = this.childNodeMml(node, space + '  ', '\n');

    let mml =
      (children.match(/\S/) ? children : '');
    return mml;
  }


  public visitAnnotationNode(node: MmlNode, space: string) {
    return space + '<annotation' + this.getAttributes(node) + '>'
      + this.childNodeMml(node, '', '')
      + '</annotation>';
  }

  public visitDefault(node: MmlNode, space: string) {
    return  this.childNodeMml(node,  '  ', '')
  }

  protected childNodeMml(node: MmlNode, space: string, nl: string) {
    const handleCh = handle.bind(this);
    let mml = '';
    mml += handleCh(node, this);
    return mml;
  }

  protected getAttributes(node: MmlNode) {
    return node.attributes.getAllAttributes();
  }
}

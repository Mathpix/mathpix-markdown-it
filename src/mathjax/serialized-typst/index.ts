import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { handle } from './handlers';
import { ITypstData, addToTypstData, initTypstData } from './common';

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
      for (let j = 0; j < node.childNodes.length; j++) {
        const child: any = node.childNodes[j];
        const data: ITypstData = this.visitNode(child, space);
        res = addToTypstData(res, data);
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

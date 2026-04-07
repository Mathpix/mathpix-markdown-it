import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { ITypstData, MathNode } from './types';
import { createAstSerializer, dispatchFull } from './ast/dispatcher';
import { serializeTypstMath } from './ast/serialize';

export interface ITypstVisitorOptions {
  [key: string]: unknown;
}

export class SerializedTypstVisitor extends MmlVisitor {
  private readonly astSerializer = createAstSerializer();

  constructor(public readonly options: ITypstVisitorOptions = {}) {
    super();
  }

  public visitTree(node: MathNode): ITypstData {
    return this.visitNode(node, '');
  }

  public visitNode(node: MathNode, ...args: any[]): ITypstData {
    const handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
    return handler.call(this, node, ...args);
  }

  public visitTextNode(node: TextNode, _space: string): ITypstData {
    return {
      typst: node.getText()
    };
  }

  public visitXMLNode(_node: XMLNode, _space: string): ITypstData {
    return {
      typst: ''
    };
  }

  public visitAnnotationNode(_node: MathNode, _space: string): ITypstData {
    return {
      typst: ''
    };
  }

  public visitDefault(node: MathNode, _space: string): ITypstData {
    const result = dispatchFull(node, this.astSerializer);
    const typst = serializeTypstMath(result.node);
    const typstInline = result.nodeInline
      ? serializeTypstMath(result.nodeInline)
      : undefined;
    return {
      typst,
      typst_inline: typstInline
    };
  }
}

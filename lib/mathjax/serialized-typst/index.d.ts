import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { ITypstData } from './common';
export interface ITypstVisitorOptions {
    [key: string]: any;
}
export declare class SerializedTypstVisitor extends MmlVisitor {
    options: ITypstVisitorOptions;
    constructor(options?: ITypstVisitorOptions);
    visitTree(node: MmlNode): ITypstData;
    visitNode(node: any, ...args: any[]): ITypstData;
    visitTextNode(node: TextNode, _space: string): ITypstData;
    visitXMLNode(_node: XMLNode, _space: string): ITypstData;
    visitInferredMrowNode(node: MmlNode, space: string): ITypstData;
    visitTeXAtomNode(node: MmlNode, space: string): ITypstData;
    visitAnnotationNode(_node: MmlNode, _space: string): ITypstData;
    visitDefault(node: MmlNode, _space: string): ITypstData;
    protected childNodeMml(node: MmlNode, _space: string, _nl: string): ITypstData;
}

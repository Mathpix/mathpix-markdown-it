import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { ITypstData, MathNode } from './types';
export interface ITypstVisitorOptions {
    [key: string]: unknown;
}
export declare class SerializedTypstVisitor extends MmlVisitor {
    readonly options: ITypstVisitorOptions;
    private readonly astSerializer;
    constructor(options?: ITypstVisitorOptions);
    visitTree(node: MathNode): ITypstData;
    visitNode(node: MathNode, ...args: any[]): ITypstData;
    visitTextNode(node: TextNode, _space: string): ITypstData;
    visitXMLNode(_node: XMLNode, _space: string): ITypstData;
    visitAnnotationNode(_node: MathNode, _space: string): ITypstData;
    visitDefault(node: MathNode, _space: string): ITypstData;
}

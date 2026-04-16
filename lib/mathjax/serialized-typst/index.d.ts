import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { ITypstData, MathNode } from './types';
import { LabelsMap } from './ast/types';
export declare class SerializedTypstVisitor extends MmlVisitor {
    private readonly astSerializer;
    constructor(labels?: LabelsMap);
    visitTree(node: MathNode): ITypstData;
    visitNode(node: MathNode, ...args: string[]): ITypstData;
    visitTextNode(node: TextNode, _space: string): ITypstData;
    visitXMLNode(_node: XMLNode, _space: string): ITypstData;
    visitAnnotationNode(_node: MathNode, _space: string): ITypstData;
    visitDefault(node: MathNode, _space: string): ITypstData;
}

import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
export declare class SerializedAsciiVisitor extends MmlVisitor {
    options: any;
    constructor(options: any);
    visitTree(node: MmlNode): any;
    visitTextNode(node: TextNode, space: string): string;
    visitXMLNode(node: XMLNode, space: string): string;
    needsGrouping(element: any): boolean;
    needsGroupingStyle(element: any): import("mathjax-full/js/core/Tree/Node").PropertyList;
    visitInferredMrowNode(node: MmlNode, space: string): string;
    visitTeXAtomNode(node: MmlNode, space: string): string;
    visitAnnotationNode(node: MmlNode, space: string): string;
    visitDefault(node: MmlNode, space: string): string;
    protected childNodeMml(node: MmlNode, space: string, nl: string): string;
    protected getAttributes(node: MmlNode): import("mathjax-full/js/core/Tree/Node").PropertyList;
    protected getAttributesDefaults(node: MmlNode): import("mathjax-full/js/core/Tree/Node").PropertyList;
}

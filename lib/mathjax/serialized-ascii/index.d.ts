import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { IAsciiData } from "./common";
export declare class SerializedAsciiVisitor extends MmlVisitor {
    options: any;
    isSerializeChildStack: boolean;
    serializedStack: any[];
    serializedChildStack: any[];
    notApplyToSerializedStack: boolean;
    constructor(options: any);
    visitTree(node: MmlNode): IAsciiData;
    visitNode(node: any, ...args: any[]): IAsciiData;
    visitTextNode(node: TextNode, space: string): IAsciiData;
    visitXMLNode(node: XMLNode, space: string): IAsciiData;
    needsGrouping(element: any): boolean;
    needsGroupingStyle(element: any): import("mathjax-full/js/core/Tree/Node").PropertyList;
    visitInferredMrowNode(node: MmlNode, space: string): IAsciiData;
    visitTeXAtomNode(node: MmlNode, space: string): IAsciiData;
    visitAnnotationNode(node: MmlNode, space: string): IAsciiData;
    /** Apply inherited attribute to all children */
    setChildInheritedAttribute: (node: any, attrName: string) => void;
    visitDefault(node: MmlNode, space: string): IAsciiData;
    protected childNodeMml(node: MmlNode, space: string, nl: string): IAsciiData;
    protected getAttributes(node: MmlNode): import("mathjax-full/js/core/Tree/Node").PropertyList;
    protected getAttributesDefaults(node: MmlNode): import("mathjax-full/js/core/Tree/Node").PropertyList;
}

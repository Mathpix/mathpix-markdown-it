import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { MmlMover, MmlMunder } from "mathjax-full/js/core/MmlTree/MmlNodes/munderover.js";
import { TextNode } from "mathjax-full/js/core/MmlTree/MmlNode.js";
export declare class MathMLVisitorWord<N, T, D> extends SerializedMmlVisitor {
    options: any;
    constructor(options: any);
    visitTextNode(node: TextNode, space: string): string;
    restructureMtrForAligned(node: any, space: string): string;
    visitDefault(node: any, space: string): string;
    isSubTable: (node: any) => boolean;
    needToAddRow: (node: any) => void;
    visitMunderoverNode(node: any, space: string): string;
    protected visitMunderNode(node: MmlMunder, space: string): string;
    protected visitMoverNode(node: MmlMover, space: string): string;
    protected quoteHTML(value: string, replaceAll?: boolean): string;
    needConvertToFenced: (node: any) => boolean;
    pasteNodeToNewRow: (node: any, space: any) => string;
    convertToFenced: (node: any, space: any) => string;
}

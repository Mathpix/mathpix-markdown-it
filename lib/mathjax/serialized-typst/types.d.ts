import { MmlNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
/** MmlNode with childNodes typed as MathNode[] to match AbstractMmlNode runtime behavior.
 *  All nodes in a MathJax MathML tree are MmlNode instances; this extension narrows
 *  the childNodes type from Node[] to MathNode[] to eliminate casts at access sites. */
export interface MathNode extends MmlNode {
    childNodes: MathNode[];
    parent: MathNode;
}
/** Visitor/serializer interface used by handlers. */
export interface ITypstSerializer {
    visitNode(node: MathNode, space: string): ITypstData;
}
/** Handler function signature. */
export type HandlerFn = (node: MathNode, serialize: ITypstSerializer) => ITypstData;
export interface ITypstData {
    typst: string;
    /** Inline-safe variant: same as typst when no block wrappers are used,
     *  otherwise contains pure math expressions without #math.equation() wrappers. */
    typst_inline?: string;
}

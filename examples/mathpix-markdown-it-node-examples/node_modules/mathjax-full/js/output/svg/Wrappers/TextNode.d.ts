import { SVGWrapper } from '../Wrapper.js';
import { CommonTextNode } from '../../common/Wrappers/TextNode.js';
import { StyleList } from '../../common/CssStyles.js';
declare const SVGTextNode_base: import("../Wrapper.js").Constructor<CommonTextNode> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGTextNode<N, T, D> extends SVGTextNode_base {
    static kind: string;
    static styles: StyleList;
    toSVG(parent: N): void;
}
export {};

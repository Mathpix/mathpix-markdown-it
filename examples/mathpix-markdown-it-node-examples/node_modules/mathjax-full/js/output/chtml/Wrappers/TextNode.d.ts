import { CHTMLWrapper } from '../Wrapper.js';
import { CommonTextNode } from '../../common/Wrappers/TextNode.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLTextNode_base: import("../Wrapper.js").Constructor<CommonTextNode> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLTextNode<N, T, D> extends CHTMLTextNode_base {
    static kind: string;
    static autoStyle: boolean;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
export {};

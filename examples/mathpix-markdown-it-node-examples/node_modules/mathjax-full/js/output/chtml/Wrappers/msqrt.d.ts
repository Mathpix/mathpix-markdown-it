import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMsqrt } from '../../common/Wrappers/msqrt.js';
import { BBox } from '../BBox.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmsqrt_base: import("../Wrapper.js").Constructor<CommonMsqrt> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmsqrt<N, T, D> extends CHTMLmsqrt_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
    protected addRoot(ROOT: N, root: CHTMLWrapper<N, T, D>, sbox: BBox): void;
}
export {};

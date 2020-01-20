import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMtd } from '../../common/Wrappers/mtd.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmtd_base: import("../Wrapper.js").Constructor<CommonMtd> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmtd<N, T, D> extends CHTMLmtd_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
export {};

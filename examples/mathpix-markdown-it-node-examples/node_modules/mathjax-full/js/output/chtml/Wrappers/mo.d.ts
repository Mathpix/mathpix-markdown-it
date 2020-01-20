import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMo } from '../../common/Wrappers/mo.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmo_base: import("../Wrapper.js").Constructor<CommonMo> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmo<N, T, D> extends CHTMLmo_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
    protected stretchHTML(chtml: N, symmetric: boolean): void;
}
export {};

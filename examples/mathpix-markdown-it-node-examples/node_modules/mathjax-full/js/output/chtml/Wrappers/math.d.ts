import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMath } from '../../common/Wrappers/math.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmath_base: import("../Wrapper.js").Constructor<CommonMath> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmath<N, T, D> extends CHTMLmath_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
    setChildPWidths(recompute: boolean, w?: number, clear?: boolean): boolean;
}
export {};

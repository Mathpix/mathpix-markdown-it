import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMi } from '../../common/Wrappers/mi.js';
declare const CHTMLmi_base: import("../Wrapper.js").Constructor<CommonMi> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmi<N, T, D> extends CHTMLmi_base {
    static kind: string;
    toCHTML(parent: N): void;
}
export {};

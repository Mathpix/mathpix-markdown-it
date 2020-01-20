import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMspace } from '../../common/Wrappers/mspace.js';
declare const CHTMLmspace_base: import("../Wrapper.js").Constructor<CommonMspace> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmspace<N, T, D> extends CHTMLmspace_base {
    static kind: string;
    toCHTML(parent: N): void;
}
export {};

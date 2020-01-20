import { SVGWrapper } from '../Wrapper.js';
import { CommonMn } from '../../common/Wrappers/mn.js';
declare const SVGmn_base: import("../Wrapper.js").Constructor<CommonMn> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmn<N, T, D> extends SVGmn_base {
    static kind: string;
}
export {};

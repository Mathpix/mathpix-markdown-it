import { SVGWrapper } from '../Wrapper.js';
import { CommonMi } from '../../common/Wrappers/mi.js';
declare const SVGmi_base: import("../Wrapper.js").Constructor<CommonMi> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmi<N, T, D> extends SVGmi_base {
    static kind: string;
}
export {};

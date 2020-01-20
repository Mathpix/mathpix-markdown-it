import { SVGWrapper } from '../Wrapper.js';
import { CommonMspace } from '../../common/Wrappers/mspace.js';
declare const SVGmspace_base: import("../Wrapper.js").Constructor<CommonMspace> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmspace<N, T, D> extends SVGmspace_base {
    static kind: string;
}
export {};

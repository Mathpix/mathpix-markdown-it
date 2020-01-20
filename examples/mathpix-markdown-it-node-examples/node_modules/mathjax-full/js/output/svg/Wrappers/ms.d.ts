import { SVGWrapper } from '../Wrapper.js';
import { CommonMs } from '../../common/Wrappers/ms.js';
declare const SVGms_base: import("../Wrapper.js").Constructor<CommonMs> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGms<N, T, D> extends SVGms_base {
    static kind: string;
}
export {};

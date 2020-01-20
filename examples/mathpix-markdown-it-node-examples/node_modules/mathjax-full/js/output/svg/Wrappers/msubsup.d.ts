import { SVGWrapper, Constructor } from '../Wrapper.js';
import { SVGscriptbase } from './scriptbase.js';
import { CommonMsub } from '../../common/Wrappers/msubsup.js';
import { CommonMsubsup } from '../../common/Wrappers/msubsup.js';
declare const SVGmsub_base: Constructor<CommonMsub<SVGWrapper<any, any, any>>> & Constructor<SVGscriptbase<any, any, any>>;
export declare class SVGmsub<N, T, D> extends SVGmsub_base {
    static kind: string;
    static useIC: boolean;
}
declare const SVGmsup_base: Constructor<CommonMsub<SVGWrapper<any, any, any>>> & Constructor<SVGscriptbase<any, any, any>>;
export declare class SVGmsup<N, T, D> extends SVGmsup_base {
    static kind: string;
    static useIC: boolean;
}
declare const SVGmsubsup_base: Constructor<CommonMsubsup<SVGWrapper<any, any, any>>> & Constructor<SVGscriptbase<any, any, any>>;
export declare class SVGmsubsup<N, T, D> extends SVGmsubsup_base {
    static kind: string;
    static useIC: boolean;
    toSVG(parent: N): void;
}
export {};

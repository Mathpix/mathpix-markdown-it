import { SVGWrapper, Constructor } from '../Wrapper.js';
import { CommonMrow } from '../../common/Wrappers/mrow.js';
import { CommonInferredMrow } from '../../common/Wrappers/mrow.js';
declare const SVGmrow_base: Constructor<CommonMrow> & Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmrow<N, T, D> extends SVGmrow_base {
    static kind: string;
    toSVG(parent: N): void;
}
declare const SVGinferredMrow_base: Constructor<CommonInferredMrow> & Constructor<SVGmrow<any, any, any>>;
export declare class SVGinferredMrow<N, T, D> extends SVGinferredMrow_base {
    static kind: string;
}
export {};

import { SVGWrapper } from '../Wrapper.js';
import { CommonMfenced } from '../../common/Wrappers/mfenced.js';
import { SVGinferredMrow } from './mrow.js';
declare const SVGmfenced_base: import("../Wrapper.js").Constructor<CommonMfenced> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmfenced<N, T, D> extends SVGmfenced_base {
    static kind: string;
    mrow: SVGinferredMrow<N, T, D>;
    toSVG(parent: N): void;
    setChildrenParent(parent: SVGWrapper<N, T, D>): void;
}
export {};

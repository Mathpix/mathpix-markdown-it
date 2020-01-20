import { SVGWrapper } from '../Wrapper.js';
import { CommonMpadded } from '../../common/Wrappers/mpadded.js';
declare const SVGmpadded_base: import("../Wrapper.js").Constructor<CommonMpadded> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmpadded<N, T, D> extends SVGmpadded_base {
    static kind: string;
    toSVG(parent: N): void;
}
export {};

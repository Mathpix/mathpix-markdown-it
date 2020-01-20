import { SVGWrapper } from '../Wrapper.js';
import { CommonTeXAtom } from '../../common/Wrappers/TeXAtom.js';
declare const SVGTeXAtom_base: import("../Wrapper.js").Constructor<CommonTeXAtom> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGTeXAtom<N, T, D> extends SVGTeXAtom_base {
    static kind: string;
    toSVG(parent: N): void;
}
export {};

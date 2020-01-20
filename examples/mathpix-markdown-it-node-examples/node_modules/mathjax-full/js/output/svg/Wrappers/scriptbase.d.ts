import { SVGWrapper } from '../Wrapper.js';
import { CommonScriptbase } from '../../common/Wrappers/scriptbase.js';
declare const SVGscriptbase_base: import("../Wrapper.js").Constructor<CommonScriptbase<SVGWrapper<any, any, any>>> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGscriptbase<N, T, D> extends SVGscriptbase_base {
    static kind: string;
    static useIC: boolean;
    toSVG(parent: N): void;
}
export {};

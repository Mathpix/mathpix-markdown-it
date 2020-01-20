import { SVGWrapper } from '../Wrapper.js';
import { CommonMaction } from '../../common/Wrappers/maction.js';
import { EventHandler } from '../../common/Wrappers/maction.js';
import { StyleList } from '../../common/CssStyles.js';
declare const SVGmaction_base: import("../Wrapper.js").Constructor<CommonMaction<SVGWrapper<any, any, any>>> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmaction<N, T, D> extends SVGmaction_base {
    static kind: string;
    static styles: StyleList;
    static actions: Map<string, [import("../../common/Wrappers/maction.js").ActionHandler<SVGmaction<any, any, any>>, import("../../common/Wrappers/maction.js").ActionData]>;
    toSVG(parent: N): void;
    setEventHandler(type: string, handler: EventHandler): void;
}
export {};

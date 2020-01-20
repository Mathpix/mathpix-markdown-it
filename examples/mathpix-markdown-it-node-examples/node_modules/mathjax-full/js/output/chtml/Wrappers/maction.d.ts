import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMaction } from '../../common/Wrappers/maction.js';
import { EventHandler } from '../../common/Wrappers/maction.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmaction_base: import("../Wrapper.js").Constructor<CommonMaction<CHTMLWrapper<any, any, any>>> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmaction<N, T, D> extends CHTMLmaction_base {
    static kind: string;
    static styles: StyleList;
    static actions: Map<string, [import("../../common/Wrappers/maction.js").ActionHandler<CHTMLmaction<any, any, any>>, import("../../common/Wrappers/maction.js").ActionData]>;
    toCHTML(parent: N): void;
    setEventHandler(type: string, handler: EventHandler): void;
}
export {};

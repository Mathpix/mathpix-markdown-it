import { CHTMLWrapper, Constructor } from '../Wrapper.js';
import { CHTMLscriptbase } from './scriptbase.js';
import { CommonMsub } from '../../common/Wrappers/msubsup.js';
import { CommonMsubsup } from '../../common/Wrappers/msubsup.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmsub_base: Constructor<CommonMsub<CHTMLWrapper<any, any, any>>> & Constructor<CHTMLscriptbase<any, any, any>>;
export declare class CHTMLmsub<N, T, D> extends CHTMLmsub_base {
    static kind: string;
    static useIC: boolean;
}
declare const CHTMLmsup_base: Constructor<CommonMsub<CHTMLWrapper<any, any, any>>> & Constructor<CHTMLscriptbase<any, any, any>>;
export declare class CHTMLmsup<N, T, D> extends CHTMLmsup_base {
    static kind: string;
    static useIC: boolean;
}
declare const CHTMLmsubsup_base: Constructor<CommonMsubsup<CHTMLWrapper<any, any, any>>> & Constructor<CHTMLscriptbase<any, any, any>>;
export declare class CHTMLmsubsup<N, T, D> extends CHTMLmsubsup_base {
    static kind: string;
    static styles: StyleList;
    static useIC: boolean;
    markUsed(): void;
    toCHTML(parent: N): void;
}
export {};

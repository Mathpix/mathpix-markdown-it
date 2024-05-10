import { RenderOptions } from "../../mathpix-markdown-model";
export declare const getListRulesToDisable: (md: any, renderOptions: RenderOptions) => string[];
export declare const applyRulesToDisableRules: (md: any, rules: string[], disableRules: string[]) => string[];
export declare const applyRefRulesToDisableRules: (md: any, disableRules: string[]) => string[];
export declare const applyFootnoteRulesToDisableRules: (md: any, disableRules: string[]) => string[];
export declare const getListToDisableByOptions: (md: MarkdownIt, options: any) => string[];

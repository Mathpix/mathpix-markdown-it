import { FootnoteItem, FootnoteMeta } from "./interfaces";
export declare const addFootnoteToListForFootnote: (state: any, token: any, tokens: any, envText: any, numbered: any, isBlock?: boolean) => void;
export declare const addFootnoteToListForFootnotetext: (state: any, token: any, tokens: any, envText: any, numbered: any, isBlock?: boolean) => void;
export declare const addFootnoteToListForBlFootnotetext: (state: any, token: any, tokens: any, envText: any, isBlock?: boolean) => void;
export declare const getFootnoteItem: (env: any, meta: FootnoteMeta) => FootnoteItem;
export declare const set_mmd_footnotes_list: (list: any) => void;
export declare const rest_mmd_footnotes_list: () => void;

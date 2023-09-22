import { Token } from "markdown-it";
export interface FootnoteItem {
    id?: number;
    footnoteId?: number;
    count?: number;
    content?: string;
    tokens?: Array<Token>;
    numbered?: number;
    type?: string;
    lastNumber?: number;
    isBlock?: boolean;
    counter_footnote?: number;
    hasContent?: boolean;
    markerId?: number;
    textId?: number;
}
export interface FootnoteMeta {
    id: number;
    footnoteId?: number;
    numbered?: number;
    lastNumber?: number;
    type?: string;
    isBlock?: boolean;
    hasContent?: boolean;
}

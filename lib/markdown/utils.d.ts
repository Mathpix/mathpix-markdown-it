export declare const endTag: (arg: string, shouldBeFirst?: boolean) => RegExp;
export declare const beginTag: (arg: string, shouldBeFirst?: boolean) => RegExp;
export declare const getTextWidth: () => number;
export declare const getWidthFromDocument: (cwidth?: number) => number;
export declare const getLatexTextWidth: (strWidth: string, cWidth?: number) => string;
export declare const isNotBackticked: (str: string, tag: string) => boolean;
export declare const includesSimpleMathTag: (str: string, tag?: string) => boolean;
export declare const includesMultiMathBeginTag: (str: any, tag: any) => RegExp | null;
export declare const includesMultiMathTag: (str: any, tag: any) => boolean;
export declare const arraysCompare: (a1: any, a2: any) => any;
export declare const arrayDelElement: (arr: any, el: any) => any;
export declare const arrayResortFromElement: (arr: any, el: any, notReverse?: boolean, nextEl?: number) => any[];
export declare const uid: () => string;
/** Add attribute to begin of attribute list */
export declare const attrSetToBegin: (attrs: any, name: any, value: any) => void;
export declare const findBackTick: (posStart: number, str: string, pending?: string) => {
    marker: string;
    posEnd: number;
    content?: undefined;
    pending?: undefined;
} | {
    marker: string;
    content: string;
    posEnd: any;
    pending?: undefined;
} | {
    marker: string;
    posEnd: number;
    pending: string;
    content?: undefined;
};
export declare const findOpenCloseTags: (str: string, tagOpen: any, tagClose: any, pendingBackTick?: string, noBreakBackTick?: boolean) => {
    arrOpen: any[];
    arrClose: any[];
    pending: string;
};
/** To search for start and end markers in the entire string.
 * The search stops if the end of the string is reached
 * or if the number of end markers is equal to the number of start markers (for inline parser only isInline = true)
 * */
export declare const findOpenCloseTagsMathEnvironment: (str: string, tagOpen: RegExp, tagClose: RegExp, isInline?: boolean) => {
    arrOpen: any[];
    arrClose: any[];
};
export declare const canonicalMath: (math: any) => any[];
export declare const canonicalMathPositions: (math: any) => any[];
export declare const getSpacesFromLeft: (str: string) => number;
/** add additional attributes to the parent token */
export declare const addAttributesToParentTokenByType: (parentToken: Token, token: Token, tokenType: string, attrs: string[], reTagFind?: RegExp) => void;
export declare const addAttributesToParentToken: (parentToken: Token, token: Token) => void;

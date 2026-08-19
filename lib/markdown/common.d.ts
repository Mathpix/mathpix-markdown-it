export declare const tocRegexp: RegExp;
export declare const isAsciiLetter: (code: number) => boolean;
export declare const isSpace: (code: any) => boolean;
export declare const isWhitespace: (s: string) => boolean;
/** Position of the next `endMarker` at or after `i` that is not escaped by a `\`, or -1. */
export declare const findEndMarkerPos: (str: string, endMarker: string, i: number) => number;
export declare const slugify: (s: string) => string;
export declare const uniqueSlug: (slug: string, slugs: any) => string;
export interface InlineCodeItem {
    marker: string;
    posStart: number;
    posEnd: number;
    content: string;
}
/** Build a Set of all character positions that fall inside inline code spans.
 *  O(1) lookup per position instead of O(m) Array.find per check. */
export declare const buildInlineCodePositionSet: (codeList: Array<InlineCodeItem>) => Set<number>;
export declare const getInlineCodeListFromString: (str: any) => Array<InlineCodeItem>;
/** The function finds the position of the end marker in the specified string
 * and returns that position and the content between the start and end markers.
 *
 * In this case, if the line contains nested markers,
 * then these layouts will be ignored and the search will continue until the end marker is found.
 *   For example, for the expression \section{Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *     Need to find end marker } in line {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *     Here:
 *         {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *                        ^nested end markers {...} will be ignored
 *         {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *                                                        ^and the search will continue until it is found
 * The function returns an object containing the information:
 *     res: boolean, - Contains false if the end marker could not be found
 *     content?: string, - Contains content between start and end markers
 *     nextPos?: number - Contains the position just past the end marker (`endPos` is the marker itself)
 * */
export declare const findEndMarker: (str: string, startPos?: number, beginMarker?: string, endMarker?: string, onlyEnd?: boolean, openBracketsBefore?: number, inlineCodePositions?: Set<number>) => {
    res: boolean;
    content?: undefined;
    openBrackets?: undefined;
    nextPos?: undefined;
    endPos?: undefined;
} | {
    res: boolean;
    content: string;
    openBrackets: number;
    nextPos?: undefined;
    endPos?: undefined;
} | {
    res: boolean;
    content: string;
    nextPos: number;
    endPos: number;
    openBrackets?: undefined;
};
/** Offset past `\renewcommand{\name}{body}` — also the starred form, `[n]` and `[n][default]`, and a
 *  bare `\name` as the first argument — or -1 when the arguments do not close in `text`. Braces are
 *  paired, so a closer or an `\item` in the body is part of the command, not structure. */
export declare const renewCommandSpanEnd: (text: string) => number;
export declare const getTerminatedRules: (rule: string) => any[];
export declare const removeCaptionsFromTableAndFigure: (content: string) => {
    content: string;
    isNotCaption: boolean;
};
export declare const removeCaptionsSetupFromTableAndFigure: (content: string) => {
    content: string;
    isLabelFormatEmpty: boolean;
    isSingleLineCheck: boolean;
};
export declare const checkTagOutsideInlineCode: (text: string, regex: RegExp) => boolean;

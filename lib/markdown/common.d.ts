export declare const tocRegexp: RegExp;
export declare const isSpace: (code: any) => boolean;
export declare const slugify: (s: string) => string;
export declare const uniqueSlug: (slug: string, slugs: any) => string;
export interface InlineCodeItem {
    marker: string;
    posStart: number;
    posEnd: number;
    content: string;
}
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
 *     nextPos?: number - Contains the position of the end marker in the string
 * */
export declare const findEndMarker: (str: string, startPos?: number, beginMarker?: string, endMarker?: string, onlyEnd?: boolean, openBracketsBefore?: number) => {
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
export declare const getTerminatedRules: (rule: string) => any[];

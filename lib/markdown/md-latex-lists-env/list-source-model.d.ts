import { StateBlockLike, OpaqueEnvType } from "./latex-list-types";
/** Text around an inline transition. Callers match on `maskNonStructure`, so a transition reaching
 *  here is structure — what is written in a code span or an `\item[...]` marker never does. */
export declare const splitInlineListEnv: (lineText: string, match: any) => {
    sB: string;
    sE: string;
};
/** A command in a code span or an `\item[...]` marker is text. Blanked, not removed: the length and
 *  the spaces hold, so a match on the result still applies to `text` itself. */
export declare const maskNonStructure: (text: string) => string;
export declare const unclosedEnvsIn: (s: string) => number;
export declare const listCloserOffsets: (state: StateBlock) => readonly number[];
export declare const lastListEndPos: (state: StateBlock) => number;
export declare const wrapperBeginAt: (lineText: string) => RegExpExecArray | null;
export declare const absoluteOffsetOf: (state: StateBlockLike, line: number, lineText: string, index: number, text: string) => number;
export declare const closersLeftAfter: (state: StateBlockLike, at: number) => number;
export declare const canCloseAfter: (state: StateBlockLike, from: number, needed: number) => boolean;
export declare const listDepthBetween: (state: StateBlockLike, from: number, to: number) => number;
export declare const hasCloserAhead: (state: StateBlockLike, from: number, name: string) => boolean;
export declare const nextListEnvMatch: (s: string) => {
    match: RegExpMatchArray;
    isEnd: boolean;
};
export declare const firstUsableCloser: (state: StateBlockLike, line: number, text: string, env: OpaqueEnvType, skipCodeClosers: boolean) => {
    index: number;
    length: number;
} | null;
